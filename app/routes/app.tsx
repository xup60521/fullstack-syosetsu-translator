import type { Route } from "./+types/app";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import React from "react";
import { cn } from "../lib/utils";
import NovelView from "../components/NovelView";
import z from "zod";
import { toast } from "sonner";
import { atomWithSearchParams } from "jotai-location";
import { atom, useAtom, useSetAtom } from "jotai";
import { Link } from "react-router";
import { Settings } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip";
import { SettingsDialog } from "~/components/settings/settings-dialog";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Syosetsu Translator" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

const urlStringAtom = atomWithSearchParams("url_string", "", {});
const settingsDialogOpenAtom = atom(false);

export default function App() {
    const [urlString, setUrlString] = useAtom(urlStringAtom);
    const [settingsDialogOpen, setSettingsDialogOpen] = useAtom(settingsDialogOpenAtom);
    return (
        <div className="w-full h-screen flex flex-col px-3 py-2 gap-2">
            <InputBar urlString={urlString} setUrlString={setUrlString} />
            <SettingsDialog open={settingsDialogOpen} setOpen={setSettingsDialogOpen} />
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
    const setSettingsDialogOpen = useSetAtom(settingsDialogOpenAtom);
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
                <div className="flex w-full gap-2 items-center">
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

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"outline"}
                                onClick={()=>setSettingsDialogOpen(true)}
                                className={cn(
                                    "fixed top-2 right-3 h-9 px-2 hover:scale-105 transition cursor-pointer",
                                    urlString !== "" &&
                                        "relative top-0 right-0 "
                                )}
                            >
                                <Settings />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
