import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";

export function NovelContentLoading(): React.JSX.Element {
    return (
        <div className="min-h-0 max-h-full h-full grow rounded-2xl">
            <ScrollArea className="p-6 w-full min-w-0 flex-1 mx-auto overflow-auto h-full min-h-0 max-h-full">
                <div className="mb-4">
                    <Skeleton className="h-10 w-3/4 mb-3" />
                    <Skeleton className="h-6 w-1/3" />
                </div>
                <div className="mb-8">
                    <Skeleton className="h-6 w-full" />
                </div>

                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="mb-4">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-11/12" />
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
}

export function SidePanelLoading(): React.JSX.Element {
    return (
        <div className="min-h-0 h-full flex flex-none flex-col w-100 pr-0 rounded-2xl">
            <ScrollArea className="grow min-h-0 h-full w-full overflow-auto py-0">
                {Array.from({ length: 16 }).map((_, i) => (
                    <React.Fragment key={i}>
                        {i === 0 ? null : <Separator />}
                        <div className="p-4">
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </React.Fragment>
                ))}
            </ScrollArea>

        </div>
    );
}
