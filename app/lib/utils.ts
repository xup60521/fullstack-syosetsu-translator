import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const windowsFileEscapeRegex = /[<>:"/\\|?*]/g;

export const supportedProvider = [
    { value: "google-ai-studio", label: "Google AI Studio" },
    { value: "openrouter", label: "OpenRouter" },
    { value: "mistral", label: "MistralAI" },
    { value: "cerebras", label: "Cerebras" },
    { value: "groq", label: "Groq" },
];

