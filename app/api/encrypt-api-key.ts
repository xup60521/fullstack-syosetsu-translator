import type { Route } from "../+types/root";
import crypto from "crypto";

export async function action({ request }: Route.ActionArgs) {
    const ALGORITHM = "aes-256-gcm";
    // Get key and ensure it is a Buffer
    const encryption_key = process.env.ENCRYPTION_KEY;
    if (!encryption_key) {
        throw new Error("Encryption key is not set in environment variables.");
    }
    if (encryption_key.length !== 32) {
        throw new Error("ENCRYPTION_KEY must be 32 characters long.");
    }

    const reqData = await request.json();
    const api_key: string = reqData.api_key;

    const iv = crypto.randomBytes(12); // GCM standard IV length
    const cipher = crypto.createCipheriv(ALGORITHM, encryption_key, iv);

    let encrypted = cipher.update(api_key, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    // We return all three parts needed to decrypt later
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}
