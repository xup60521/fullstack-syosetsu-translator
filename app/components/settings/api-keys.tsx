import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollArea } from "../ui/scroll-area";
import React from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Field } from "../ui/field";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { supportedProvider } from "~/lib/utils";

export function APIKeysPanel(): React.JSX.Element {
    const queryClient = useQueryClient();
    const { data: api_keys } = useQuery({
        queryKey: ["api-keys"],
        queryFn: async (): Promise<
            {
                provider: string;
                name: string;
                encrypted_key: string;
            }[]
        > => {
            const storedKeys = localStorage.getItem("api_keys");
            return storedKeys ? JSON.parse(storedKeys) : [];
        },
    });
    const deleteApiKeyMutation = useMutation({
        mutationFn: async (index: number) => {
            const storedKeys = localStorage.getItem("api_keys");
            const keys = storedKeys ? JSON.parse(storedKeys) : [];
            keys.splice(index, 1);
            localStorage.setItem("api_keys", JSON.stringify(keys));
        },
        onSuccess: () => {
            toast.success("API key deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["api-keys"] });
        },
    });

    return (
        <div className="w-full flex flex-col px-4 gap-4 h-full min-h-0">
            <ScrollArea className="h-full">
                <section className="pr-4">
                    <h3>API Keys</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Manage your API keys here. You can edit the key name,
                        but the API key itself is immutable. Ensure your keys
                        are kept secure and never share them with anyone.
                    </p>
                    <div className="flex flex-col gap-4">
                        {api_keys?.map((key, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-2 p-3 border rounded-md"
                            >
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">
                                        Provider
                                    </label>
                                    <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                        {key.provider}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor={`key-name-${index}`}
                                        className="text-sm font-medium"
                                    >
                                        Key Name
                                    </label>
                                    <input
                                        type="text"
                                        id={`key-name-${index}`}
                                        value={key.name}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="e.g., Production, Development"
                                    />
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="self-start"
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the API key "{key.name}" for {key.provider}.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    deleteApiKeyMutation.mutate(index)
                                                }
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <AddAPIKeyDialog>
                                <Button variant="outline">Add Key</Button>
                            </AddAPIKeyDialog>
                        </div>
                    </div>
                </section>
            </ScrollArea>
        </div>
    );
}

const formSchema = z.object({
    provider: z.string().min(1, "Please select a provider"),
    name: z.string().min(1, "Name is required"),
    apiKey: z.string().min(1, "API Key is required"),
});

type FormData = z.infer<typeof formSchema>;

function AddAPIKeyDialog({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    const [open, setOpen] = React.useState(false);
    const [providerSelectMenuOpen, setProviderSelectMenuOpen] =
        React.useState(false);
    const queryClient = useQueryClient();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider: "",
            name: "",
            apiKey: "",
        },
    });

    const mutateApiKey = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch("/api/encrypt-api-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ api_key: data.apiKey }),
            });
            const encrypted = await response.text();
            return encrypted;
        },
    });

    const onSubmit = (data: FormData) => {
        toast("Encrypting and saving API key...");

        mutateApiKey.mutate(data, {
            onSuccess: (encryptedKey) => {
                const currentKeys = JSON.parse(
                    localStorage.getItem("api_keys") || "[]"
                ) as {
                    provider: string;
                    name: string;
                    encrypted_key: string;
                }[];
                currentKeys.push({
                    provider: data.provider,
                    name: data.name,
                    encrypted_key: encryptedKey,
                });
                localStorage.setItem("api_keys", JSON.stringify(currentKeys));
                setOpen(false);
                form.reset();
                toast.success("API key added successfully!");
                queryClient.invalidateQueries({ queryKey: ["api-keys"] });
            },
        });

        // Handle form submission here
        // setOpen(false);
        // form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogTitle>Add New API Key</DialogTitle>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <Field>
                            <Label onClick={()=>setProviderSelectMenuOpen(true)} htmlFor="provider">Provider</Label>
                            <Select
                                open={providerSelectMenuOpen}
                                onOpenChange={setProviderSelectMenuOpen}
                                value={form.watch("provider")}
                                onValueChange={(value) =>
                                    form.setValue("provider", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supportedProvider.map((provider) => (
                                        <SelectItem
                                            key={provider.value}
                                            value={provider.value}
                                        >
                                            {provider.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.provider &&
                                !form.watch("provider") && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.provider.message}
                                    </p>
                                )}
                        </Field>

                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="e.g., Production, Development"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="apiKey">API Key</Label>
                            <Input
                                type="password"
                                id="apiKey"
                                placeholder="Enter your API key"
                                {...form.register("apiKey")}
                            />
                            {form.formState.errors.apiKey && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.apiKey.message}
                                </p>
                            )}
                        </Field>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                        >
                            Add API Key
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
