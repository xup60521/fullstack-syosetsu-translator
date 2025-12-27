import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Field } from "./ui/field";
import { Label } from "./ui/label";
import { cn, supportedProvider } from "~/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import z, { set } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { DecomposedURL } from "~/api/decompose_url";
import { Input } from "./ui/input";
import { modelList } from "~/lib/model_list";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";

const translateFormSchema = z.object({
    provider: z.string().min(1, "Please select a provider"),
    encrypted_api_key: z.string().min(1, "Encrypted API key is required"),
    model_id: z.string().min(1, "Please select a model"),
    concurrency: z.number().min(1, "Concurrency must be at least 1"),
    batch_size: z.number().min(1, "Batch size must be at least 1"),
});
type FormData = z.infer<typeof translateFormSchema>;

export default function TranslateDialogue({
    checkedItems,
    data,
    dialogueOpen,
    SetDialogueOpen,
}: {
    checkedItems: boolean[];
    data: DecomposedURL[];
    dialogueOpen: boolean;
    SetDialogueOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element {
    const form = useForm<FormData>({
        resolver: zodResolver(translateFormSchema),
        defaultValues: {
            concurrency: 1,
            batch_size: 5,
        },
    });
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
    const filteredApiKeys = api_keys?.filter(
        (key) => key.provider === form.watch("provider")
    );
    const checkedurls = data?.filter((_, index) => checkedItems[index]) ?? [];
    const modelListQuery = useQuery({
        queryKey: ["model-list", form.watch("provider")],
        queryFn: async () => {
            const provider = form.watch("provider");
            if (!provider) return [];
            const models = await modelList[provider]!();
            return models;
        },
    });
    const session = authClient.useSession()
    const selectedModel = form.watch("model_id");
    const [openSelectModel, setOpenSelectModel] = useState(false);
    const submitTranslationMutation = useMutation({
        mutationFn: async (payload: FormData & { urls: string[] }) => {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return response.status;
        },
    });
    const onSubmit = (translationSettings: FormData) => {
        if (!session.data) {
            alert("Please connect to a Google Drive account...")
            return
        }
        const payload = {
            ...translationSettings,
            urls: checkedurls.map((d) => d.url),
        };
        console.log(payload);
        submitTranslationMutation.mutate(payload, {
            onSuccess: () => {
                toast.info("Successfully create translation request!");
                SetDialogueOpen(false);
            },
        });
        // Implement translation logic here
    };

    return (
        <Dialog open={dialogueOpen} onOpenChange={SetDialogueOpen}>
            <DialogContent>
                <DialogTitle>
                    Translate from {checkedurls.length} URL
                    {checkedurls.length > 1 ? "s" : ""}
                </DialogTitle>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <Field>
                            <Label>Select Provider</Label>
                            <Select
                                value={form.watch("provider")}
                                onValueChange={(value) => {
                                    form.setValue("provider", value);
                                    form.setValue("encrypted_api_key", "");
                                    form.setValue("model_id", "");
                                }}
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
                        </Field>
                        <Field>
                            <Label>Select API Key</Label>
                            <Select
                                disabled={!form.watch("provider")}
                                value={form.watch("encrypted_api_key")}
                                onValueChange={(value) =>
                                    form.setValue("encrypted_api_key", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            filteredApiKeys &&
                                            filteredApiKeys.length > 0
                                                ? "Select an API key"
                                                : "No API keys available"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredApiKeys?.map((key) => (
                                        <SelectItem
                                            key={key.encrypted_key}
                                            value={key.encrypted_key}
                                        >
                                            {key.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label>Select Model</Label>
                            {/* <Select
                                disabled={!form.watch("encrypted_api_key")}
                                onOpenChange={(open) => {
                                    if (open) {
                                        // focus the search input in the popover when opened
                                        setTimeout(() => {
                                            const el = document.querySelector('[data-slot="select-content"] input[type="text"]') as HTMLInputElement | null;
                                            el?.focus();
                                        }, 0);
                                    } else {
                                        setModelFilter("");
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {form.watch("provider") !== "" && modelListQuery.data ? (
                                        <>
                                            <div className="px-2 py-2">
                                                <input
                                                    type="text"
                                                    value={modelFilter}
                                                    onChange={(e) => setModelFilter(e.target.value)}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    placeholder="Search models..."
                                                    className="w-full rounded-md border border-input px-3 py-1 text-sm mb-2"
                                                />
                                            </div>
                                            {filteredModels && filteredModels.length > 0 ? (
                                                filteredModels.map((model) => (
                                                    <SelectItem key={model.value} value={model.value}>
                                                        {model.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-2 text-sm text-muted-foreground">No models match</div>
                                            )}
                                        </>
                                    ) : null}
                                </SelectContent>
                            </Select> */}
                            <Popover
                                open={openSelectModel}
                                onOpenChange={setOpenSelectModel}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="justify-between"
                                    >
                                        {selectedModel
                                            ? selectedModel
                                            : "Select framework..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-115.75 p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search framework..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                No framework found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {modelListQuery.data?.map(
                                                    (model) => (
                                                        <CommandItem
                                                            key={model.value}
                                                            value={model.value}
                                                            onSelect={(
                                                                currentValue
                                                            ) => {
                                                                form.setValue(
                                                                    "model_id",
                                                                    currentValue
                                                                );

                                                                setOpenSelectModel(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            {model.name}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    selectedModel ===
                                                                        model.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    )
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <Field>
                            <Label htmlFor="concurrency">Concurrency</Label>
                            <Input
                                id="concurrency"
                                type="number"
                                min={1}
                                defaultValue={1}
                                value={form.watch("concurrency")}
                                onChange={(e) =>
                                    form.setValue(
                                        "concurrency",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="batch_size">Batch Size</Label>
                            <Input
                                id="batch_size"
                                type="number"
                                min={1}
                                defaultValue={5}
                                value={form.watch("batch_size")}
                                onChange={(e) =>
                                    form.setValue(
                                        "batch_size",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </Field>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                        >
                            {form.formState.isSubmitting
                                ? "Submitting"
                                : "Start Translation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
