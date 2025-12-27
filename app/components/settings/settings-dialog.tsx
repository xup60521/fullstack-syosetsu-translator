"use client";

import * as React from "react";
import {
    Bell,
    Check,
    Globe,
    Home,
    Keyboard,
    Link,
    Lock,
    Menu,
    MessageCircle,
    Paintbrush,
    Settings,
    Video,
    KeyRound,
    HardDrive,
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "~/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { APIKeysPanel } from "./api-keys";

const data = {
    nav: [
        { name: "API Keys", icon: KeyRound },
        { name: "Storage", icon: HardDrive },
        { name: "Appearance", icon: Paintbrush },
        { name: "Language & Region", icon: Globe },
        { name: "Connected Accounts", icon: Link },
    ],
} as const;

type SettingsPanel = (typeof data.nav)[number]["name"];

export function SettingsDialog({
    open,
    setOpen,
}: {
    open?: boolean;
    setOpen?: (open: boolean) => void;
}): React.JSX.Element {
    const [selectedPanel, setSelectedPanel] =
        React.useState<SettingsPanel>("API Keys");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden p-0 md:max-h-125 md:max-w-175 lg:max-w-200">
                <DialogTitle className="sr-only">Settings</DialogTitle>
                <DialogDescription className="sr-only">
                    Customize your settings here.
                </DialogDescription>
                <SidebarProvider className="items-start">
                    <Sidebar collapsible="none" className="hidden md:flex">
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {data.nav.map((item) => (
                                            <SidebarMenuItem key={item.name}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={
                                                        item.name ===
                                                        selectedPanel
                                                    }
                                                    onClick={() =>
                                                        setSelectedPanel(
                                                            item.name
                                                        )
                                                    }
                                                >
                                                    <a href="#">
                                                        <item.icon />
                                                        <span>{item.name}</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                    <main className="flex h-120 flex-1 flex-col overflow-hidden">
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            Settings
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {selectedPanel}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>
                        {selectedPanel === "API Keys" && <APIKeysPanel />}
                        {selectedPanel === "Storage" && <StoragePanel />}
                        {selectedPanel === "Appearance" && <AppearancePanel />}
                        {selectedPanel === "Language & Region" && (
                            <LanguageRegionPanel />
                        )}
                        {selectedPanel === "Connected Accounts" && (
                            <ConnectedAccountsPanel />
                        )}
                    </main>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    );
}



function StoragePanel(): React.JSX.Element {
    return <div className="p-4">Storage Settings Panel</div>;
}

function AppearancePanel(): React.JSX.Element {
    return <div className="p-4">Appearance Settings Panel</div>;
}

function LanguageRegionPanel(): React.JSX.Element {
    return <div className="p-4">Language & Region Settings Panel</div>;
}

function ConnectedAccountsPanel(): React.JSX.Element {
    return <div className="p-4">Connected Accounts Settings Panel</div>;
}
