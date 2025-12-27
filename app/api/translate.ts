import { auth } from "~/lib/auth";
import type { Route } from "./+types/translate";
import crypto from "crypto";
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const payload = (await request.json()) as {
        urls: string[];
        provider: string;
        encrypted_api_key: string;
        model_id: string;
        concurrency: number;
        batch_size: number;
    };
    const encrypted_api_key = payload.encrypted_api_key;
    const api_key = decrypt(encrypted_api_key);
    return data(null, { status: 200 });
}

type EncryptedBlob = string;

const ALGORITHM = "aes-256-gcm";

/**
 * Ensures the MASTER_KEY is typed correctly.
 * Usually initialized from process.env.ENCRYPTION_KEY
 */
const MASTER_KEY: Buffer = Buffer.from(
    process.env.ENCRYPTION_KEY || "",
    "utf8"
);

/**
 * Decrypts a client-provided encrypted blob using the server's master secret.
 * @param encryptedBlob String format: "iv:authTag:encryptedData"
 * @throws Error if the blob is malformed or authentication fails
 */
function decrypt(encryptedBlob: EncryptedBlob): string {
    const parts: string[] = encryptedBlob.split(":");

    if (parts.length !== 3) {
        throw new Error("Invalid encrypted blob format. Expected 3 segments.");
    }

    const [ivHex, authTagHex, encryptedTextHex] = parts;

    // Convert hex strings to Buffers
    const iv: Buffer = Buffer.from(ivHex, "hex");
    const authTag: Buffer = Buffer.from(authTagHex, "hex");
    const encryptedText: Buffer = Buffer.from(encryptedTextHex, "hex");

    // Create decipher
    // Note: GCM requires setAuthTag to be called before final()
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        MASTER_KEY,
        iv
    ) as crypto.DecipherGCM;

    decipher.setAuthTag(authTag);

    try {
        let decrypted: string = decipher.update(
            encryptedTextHex,
            "hex",
            "utf8"
        );
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        // This will trigger if the authTag doesn't match (tampered data)
        throw new Error(
            "Decryption failed: Key is invalid or data has been tampered with."
        );
    }
}
