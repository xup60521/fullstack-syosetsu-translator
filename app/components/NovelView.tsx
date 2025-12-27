import type { DecomposedURL } from "~/api/decompose_url";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { NovelContentLoading, SidePanelLoading } from "./NovelViewLoading";
import { cn } from "~/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { toast } from "sonner";
import TranslateDialogue from "./translate-dialogue";
import { authClient } from "~/lib/auth-client";

type NovelViewProps = {
    url_string: string;
};

const useData = (url_string: string) =>
    useQuery({
        queryKey: ["decompose_url", url_string],
        queryFn: async () => {
            const response = await fetch("/api/decompose_url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url_string,
                }),
            });
            const data = await response.json();
            return data.novel_url_list as DecomposedURL[];
        },
    });

export default function NovelView({
    url_string,
}: NovelViewProps): React.JSX.Element {
    const { data, error, isLoading } = useData(url_string);
    const [selectedNovelURL, setSelectedNovelURL] = React.useState<
        string | undefined
    >(undefined);

    return (
        <div className="flex flex-row flex-1 w-full grow min-h-0 gap-2">
            <NovelContentView selectedNovelURL={selectedNovelURL} />
            <SidePanel
                url_string={url_string}
                selectedNovelURL={selectedNovelURL}
                setSelectedNovelURL={setSelectedNovelURL}
            />
        </div>
    );
}

function NovelContentView({
    selectedNovelURL,
}: {
    selectedNovelURL: string | undefined;
}): React.JSX.Element {
    const query = useQuery({
        queryKey: ["novel_content", selectedNovelURL],
        queryFn: async () => {
            if (!selectedNovelURL) return null;
            const response = await fetch("/api/novel_handler", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: selectedNovelURL,
                }),
            });
            const data = await response.json();
            // console.log(data)
            return data;
        },
    });
    const { data, error, isLoading } = query;
    return (
        <div className="min-h-0 max-h-full h-full grow rounded-2xl overflow-hidden shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
            {error && (
                <div className="p-4 text-red-600">
                    Error:{" "}
                    {error instanceof Error ? error.message : "Unknown error"}
                </div>
            )}
            {isLoading && <NovelContentLoading />}
            {!selectedNovelURL && !isLoading && !error && (
                <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-lg">Select an episode to view</p>
                </div>
            )}
            {data && (
                <ScrollArea className="p-6 w-full min-w-0 flex-1 mx-auto overflow-auto h-full min-h-0 max-h-full">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold mb-4">
                            {data.title}
                        </h1>
                        <Button
                            variant={"outline"}
                            className="cursor-pointer"
                            onClick={() => {
                                const content =
                                    "# " +
                                    data.title +
                                    "\n\n" +
                                    data.author +
                                    "\n\n" +
                                    selectedNovelURL +
                                    "\n\n" +
                                    data.content;
                                navigator.clipboard.writeText(content);
                                toast.info(
                                    "Copied novel content to clipboard!"
                                );
                            }}
                        >
                            Copy
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold mb-6">
                        by {data.author}
                    </h2>

                    <h3 className="text-md font-medium mb-8 text-gray-600 break-all">
                        <a target="_blank" href={selectedNovelURL}>
                            {selectedNovelURL}
                        </a>
                    </h3>

                    {data.content
                        .split("\n")
                        .map((paragraph: string, index: number) => (
                            <p
                                key={`${selectedNovelURL}-${index}`}
                                className="mb-4 leading-relaxed"
                            >
                                {paragraph}
                            </p>
                        ))}
                </ScrollArea>
            )}
        </div>
    );
}

function SidePanel({
    url_string,
    selectedNovelURL,
    setSelectedNovelURL,
}: {
    url_string: string;
    selectedNovelURL: string | undefined;
    setSelectedNovelURL: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
}): React.JSX.Element {
    const { isLoading, error, data } = useData(url_string);
    const [checkedItems, setCheckedItems] = React.useState<boolean[]>([]);
    const [dialogueOpen, SetDialogueOpen] = React.useState(false)
    const session = authClient.useSession()
    React.useEffect(() => {
        if (
            isLoading === false &&
            error == null &&
            data != null &&
            data.length > 0
        ) {
            setSelectedNovelURL(data[0]!.url);
            setCheckedItems([...new Array(data.length).fill(true)]);
        }
    }, [isLoading]);
    return (
        <div className="min-h-0 h-full flex flex-none flex-col w-100 pr-0 rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-bold p-4 w-full">Novel Queue List</h2>
            <ScrollArea className="grow min-h-0 h-full w-full overflow-auto py-0">
                {error && (
                    <div className="p-4 text-red-600">
                        Error:{" "}
                        {error instanceof Error
                            ? error.message
                            : "Unknown error"}
                    </div>
                )}
                {isLoading && <SidePanelLoading />}

                {data &&
                    data.map((item, index) => (
                        <React.Fragment key={index}>
                            {index === 0 ? null : <Separator className="" />}
                            <div
                                rel="noopener noreferrer"
                                onClick={() =>
                                    setSelectedNovelURL(
                                        item.url === selectedNovelURL
                                            ? undefined
                                            : item.url
                                    )
                                }
                                className={cn(
                                    "text-black text-sm py-3 px-4 cursor-pointer flex gap-2 hover:bg-slate-100 transition",
                                    selectedNovelURL === item.url &&
                                        "bg-slate-200 hover:bg-slate-300 font-medium"
                                )}
                            >
                                <Checkbox
                                    checked={checkedItems[index] ?? false}
                                    className="mt-px"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newCheckedItems = [
                                            ...checkedItems,
                                        ];
                                        newCheckedItems[index] =
                                            !newCheckedItems[index];
                                        setCheckedItems(newCheckedItems);
                                    }}
                                />
                                <span>{item.title ?? item.url}</span>
                            </div>
                        </React.Fragment>
                    ))}
            </ScrollArea>
            <div className="w-full p-2 flex items-center rounded-b-2xl shadow-[inset_-12px_-8px_40px_#46464620]">
                <div className=" flex items-center gap-2 px-2">
                    <Checkbox
                        id="select-all-checkbox"
                        className="border-gray-400"
                        checked={isButtonAllChecked(checkedItems)}
                        onClick={() => {
                            if (isButtonAllChecked(checkedItems)) {
                                setCheckedItems([
                                    ...checkedItems.map(() => false),
                                ]);
                            } else {
                                setCheckedItems([
                                    ...checkedItems.map(() => true),
                                ]);
                            }
                        }}
                    />{" "}
                    <Label
                        className="text-xs font-bold"
                        htmlFor="select-all-checkbox"
                    >
                        Select All
                    </Label>
                </div>
                <div className="grow"></div>
                <TranslateDialogue dialogueOpen={dialogueOpen} SetDialogueOpen={SetDialogueOpen} checkedItems={checkedItems} data={data!} />
                    <Button
                        variant={"outline"}
                        disabled={!checkedItems.some((item) => item === true) || !data}
                        className="hover:cursor-pointer"
                        onClick={() => {
                            if (!session.data) {
                                toast.info("Please connect to a Google Drive account in settings to continue...")
                                return
                            }
                            SetDialogueOpen(true)
                        }}
                    >
                        Translate
                    </Button>
                
            </div>
        </div>
    );
}

function isButtonAllChecked(checkedItems: boolean[]): boolean {
    return checkedItems.every((item) => item === true);
}
