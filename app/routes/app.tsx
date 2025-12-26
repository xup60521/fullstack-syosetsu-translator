import type { Route } from "./+types/app";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import React from "react";
import { cn } from "../lib/utils";
import NovelView from "../components/NovelView";
import z from "zod";
import { toast } from "sonner";
import { atomWithSearchParams } from "jotai-location";
import { useAtom } from "jotai";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Syosetsu Translator" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

const atom = atomWithSearchParams("url_string", "", {});

export default function App() {
    const [urlString, setUrlString] = useAtom(atom);
    return (
        <div className="w-full h-screen flex flex-col px-3 py-2 gap-2">
            <InputBar urlString={urlString} setUrlString={setUrlString} />
            {urlString !== "" && <NovelView url_string={urlString} />}
        </div>
    );
}

const urlString_schema = z.string().refine((value) => {
    const urls = value.split(" ");
    for (const url of urls) {
        try {
            new URL(url);
        } catch (e) {
            return false;
        }
    }
    return true;
});

function InputBar({
    urlString,
    setUrlString,
}: {
    urlString?: string;
    setUrlString: React.Dispatch<React.SetStateAction<string>>;
}): React.JSX.Element {
    const ref = React.useRef<HTMLInputElement>(null);
    function onClickTranslate() {
        const inputValue = ref.current?.value;
        
        if (inputValue && urlString_schema.safeParse(inputValue).success) {
            setUrlString(inputValue);
        } else {
            toast.error("Please enter valid URLs separated by spaces.", {
                className: "!bg-red-800 !text-white",
            });
        }
    }
    return (
        <div
            className={cn(
                "w-full h-screen flex justify-center items-center",
                urlString !== "" && "h-fit"
            )}
        >
            <div
                className={cn(
                    "max-w-150 w-full flex flex-col items-center gap-4",
                    urlString !== "" && "flex-row max-w-screen w-full gap-0"
                )}
            >
                <h1 className="font-bold text-2xl font-mono w-65">
                    <a href="/">Novel Translator</a>
                </h1>
                <div className="flex w-full gap-2">
                    <Input
                        placeholder="Input novel urls, separated by space flex-grow"
                        className="placeholder:text-gray-400"
                        ref={ref}
                        defaultValue={urlString ?? ""}
                    />
                    <Button
                        className="hover:cursor-pointer"
                        variant={"default"}
                        onClick={onClickTranslate}
                    >
                        Enter
                    </Button>
                </div>
            </div>
        </div>
    );
}
