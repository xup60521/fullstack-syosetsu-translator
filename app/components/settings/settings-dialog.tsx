import * as React from "react";
import {
    Globe,
    Link,
    Paintbrush,
    KeyRound,
    HardDrive,
    FolderOpen,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Cloud, LogOut, RefreshCw } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
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
import { APIKeysPanel } from "./api-keys";
import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { useLocation } from "react-router";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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
    const location = useLocation();
    const { data } = authClient.useSession();
    const [outputPath, setOutputPath] = React.useState("/My Drive/Output");
    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: location.pathname + location.search,
        });
    };
    const handleLogout = async () => {
        await authClient.signOut();
    };
    const handleBrowseFolder = () => {
        // Implement Google Drive folder picker
        console.log("Opening folder picker...");
    };

    const handleSavePath = () => {
        // Save the output path
        console.log("Saving path:", outputPath);
    };
    return (
    <div className="space-y-6 px-4">
      {/* Connection Section */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-base">Google Drive</h3>
          <p className="text-sm text-slate-500 mt-1">
            Connect your account to access files
          </p>
        </div>

        {data ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md border text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                {data.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">
                  {data.user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {data.user?.email || 'email@example.com'}
                </p>
              </div>
              <Button variant={"outline"} onClick={handleGoogleLogin}>Reconnect</Button>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleGoogleLogin}
            className="w-full"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Connect with Google
          </Button>
        )}
      </div>

      {/* Output Path Section */}
      {data && (
        <div className="space-y-3 pt-3 border-t">
          <div>
            <h3 className="font-semibold text-base">Output Path</h3>
            <p className="text-sm text-slate-500 mt-1">
              Where files will be saved
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="output-path" className="text-sm">
              Folder Path
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="output-path"
                  value={outputPath}
                  onChange={(e) => setOutputPath(e.target.value)}
                  placeholder="/My Drive/Output"
                  className="text-sm"
                />
              </div>
              <Button
                onClick={handleBrowseFolder}
                variant="outline"
                size="sm"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleSavePath}
              className="w-full"
              size="sm"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
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
