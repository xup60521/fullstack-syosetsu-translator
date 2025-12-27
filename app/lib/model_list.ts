export const modelList = {
    "google-ai-studio": async () => [
        {
            name: "gemini-2.0-flash-thinking-exp-01-21",
            value: "gemini-2.0-flash-thinking-exp-01-21",
        },
        {
            name: "gemini-2.0-flash",
            value: "gemini-2.0-flash",
        },
        {
            name: "gemini-2.0-flash-lite",
            value: "gemini-2.0-flash-lite",
        },
        {
            name: "gemini-2.0-pro-exp-02-05",
            value: "gemini-2.0-pro-exp-02-05",
        },
        // 2.5
        {
            name: "gemini-2.5-flash",
            value: "gemini-2.5-flash",
        },
        {
            name: "gemini-flash-latest",
            value: "gemini-flash-latest",
        },
        {
            name: "gemini-2.5-flash-lite",
            value: "gemini-2.5-flash-lite",
        },
        {
            name: "gemini-flash-lite-latest",
            value: "gemini-flash-lite-latest",
        },
        {
            name: "gemini-2.5-pro",
            value: "gemini-2.5-pro",
        },
        {
            name: "gemini-3-flash-preview",
            value: "gemini-3-flash-preview",
        },
        {
            name: "gemini-3-pro-preview",
            value: "gemini-3-pro-preview",
        },
        // Gemma 3 & 3n
        {
            name: "gemma-3n-e4b-it",
            value: "gemma-3n-e4b-it",
        },
        {
            name: "gemma-3-12b-it",
            value: "gemma-3-12b-it",
        },
        {
            name: "gemma-3-27b-it",
            value: "gemma-3-27b-it",
        },
    ],
    openrouter: async () => {
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();
        return data.data.map((item: { id: string }) => ({
            value: item.id,
            name: item.id,
        })) as { name: string; value: string }[];
    },
    mistral: async () => [
        {
            name: "mistral-medium-2505",
            value: "mistral-medium-2505",
        },
        {
            name: "mistral-medium-2508",
            value: "mistral-medium-2508",
        },
        {
            name: "mistral-medium-latest",
            value: "mistral-medium-latest",
        },
        {
            name: "mistral-medium",
            value: "mistral-medium",
        },
        {
            name: "open-mistral-nemo",
            value: "open-mistral-nemo",
        },
        {
            name: "open-mistral-nemo-2407",
            value: "open-mistral-nemo-2407",
        },
        {
            name: "mistral-tiny-2407",
            value: "mistral-tiny-2407",
        },
        {
            name: "mistral-tiny-latest",
            value: "mistral-tiny-latest",
        },
        {
            name: "mistral-large-2411",
            value: "mistral-large-2411",
        },
        {
            name: "pixtral-large-2411",
            value: "pixtral-large-2411",
        },
        {
            name: "pixtral-large-latest",
            value: "pixtral-large-latest",
        },
        {
            name: "mistral-large-pixtral-2411",
            value: "mistral-large-pixtral-2411",
        },
        {
            name: "codestral-2508",
            value: "codestral-2508",
        },
        {
            name: "codestral-latest",
            value: "codestral-latest",
        },
        {
            name: "devstral-small-2507",
            value: "devstral-small-2507",
        },
        {
            name: "devstral-medium-2507",
            value: "devstral-medium-2507",
        },
        {
            name: "devstral-2512",
            value: "devstral-2512",
        },
        {
            name: "mistral-vibe-cli-latest",
            value: "mistral-vibe-cli-latest",
        },
        {
            name: "devstral-medium-latest",
            value: "devstral-medium-latest",
        },
        {
            name: "devstral-latest",
            value: "devstral-latest",
        },
        {
            name: "labs-devstral-small-2512",
            value: "labs-devstral-small-2512",
        },
        {
            name: "devstral-small-latest",
            value: "devstral-small-latest",
        },
        {
            name: "mistral-small-2506",
            value: "mistral-small-2506",
        },
        {
            name: "mistral-small-latest",
            value: "mistral-small-latest",
        },
        {
            name: "labs-mistral-small-creative",
            value: "labs-mistral-small-creative",
        },
        {
            name: "magistral-medium-2509",
            value: "magistral-medium-2509",
        },
        {
            name: "magistral-medium-latest",
            value: "magistral-medium-latest",
        },
        {
            name: "magistral-small-2509",
            value: "magistral-small-2509",
        },
        {
            name: "magistral-small-latest",
            value: "magistral-small-latest",
        },
        {
            name: "voxtral-mini-2507",
            value: "voxtral-mini-2507",
        },
        {
            name: "voxtral-mini-latest",
            value: "voxtral-mini-latest",
        },
        {
            name: "voxtral-small-2507",
            value: "voxtral-small-2507",
        },
        {
            name: "voxtral-small-latest",
            value: "voxtral-small-latest",
        },
        {
            name: "mistral-large-2512",
            value: "mistral-large-2512",
        },
        {
            name: "mistral-large-latest",
            value: "mistral-large-latest",
        },
        {
            name: "ministral-3b-2512",
            value: "ministral-3b-2512",
        },
        {
            name: "ministral-3b-latest",
            value: "ministral-3b-latest",
        },
        {
            name: "ministral-8b-2512",
            value: "ministral-8b-2512",
        },
        {
            name: "ministral-8b-latest",
            value: "ministral-8b-latest",
        },
        {
            name: "ministral-14b-2512",
            value: "ministral-14b-2512",
        },
        {
            name: "ministral-14b-latest",
            value: "ministral-14b-latest",
        },
        {
            name: "open-mistral-7b",
            value: "open-mistral-7b",
        },
        {
            name: "mistral-tiny",
            value: "mistral-tiny",
        },
        {
            name: "mistral-tiny-2312",
            value: "mistral-tiny-2312",
        },
        {
            name: "pixtral-12b-2409",
            value: "pixtral-12b-2409",
        },
        {
            name: "pixtral-12b",
            value: "pixtral-12b",
        },
        {
            name: "pixtral-12b-latest",
            value: "pixtral-12b-latest",
        },
        {
            name: "ministral-3b-2410",
            value: "ministral-3b-2410",
        },
        {
            name: "ministral-8b-2410",
            value: "ministral-8b-2410",
        },
        {
            name: "codestral-2501",
            value: "codestral-2501",
        },
        {
            name: "codestral-2412",
            value: "codestral-2412",
        },
        {
            name: "codestral-2411-rc5",
            value: "codestral-2411-rc5",
        },
        {
            name: "mistral-small-2501",
            value: "mistral-small-2501",
        },
        {
            name: "mistral-embed-2312",
            value: "mistral-embed-2312",
        },
        {
            name: "mistral-embed",
            value: "mistral-embed",
        },
        {
            name: "codestral-embed",
            value: "codestral-embed",
        },
        {
            name: "codestral-embed-2505",
            value: "codestral-embed-2505",
        },
        {
            name: "mistral-moderation-2411",
            value: "mistral-moderation-2411",
        },
        {
            name: "mistral-moderation-latest",
            value: "mistral-moderation-latest",
        },
        {
            name: "mistral-ocr-2512",
            value: "mistral-ocr-2512",
        },
        {
            name: "mistral-ocr-latest",
            value: "mistral-ocr-latest",
        },
        {
            name: "mistral-ocr-2505",
            value: "mistral-ocr-2505",
        },
        {
            name: "mistral-ocr-2503",
            value: "mistral-ocr-2503",
        },
        {
            name: "voxtral-mini-transcribe-2507",
            value: "voxtral-mini-transcribe-2507",
        },
        {
            name: "voxtral-mini-2507",
            value: "voxtral-mini-2507",
        },
        {
            name: "voxtral-mini-latest",
            value: "voxtral-mini-latest",
        },
    ],
    cerebras: async () => [
        {
            name: "qwen-3-235b-a22b-instruct-2507",
            value: "qwen-3-235b-a22b-instruct-2507",
        },
        {
            name: "qwen-3-32b",
            value: "qwen-3-32b",
        },
        {
            name: "llama3.1-8b",
            value: "llama3.1-8b",
        },
        {
            name: "zai-glm-4.6",
            value: "zai-glm-4.6",
        },
        {
            name: "gpt-oss-120b",
            value: "gpt-oss-120b",
        },
        {
            name: "llama-3.3-70b",
            value: "llama-3.3-70b",
        },
    ],
    groq: async () => [
        { value: "allam-2-7b", name: "allam-2-7b" },
        { value: "groq/compound", name: "groq/compound" },
        { value: "groq/compound-mini", name: "groq/compound-mini" },
        { value: "llama-3.1-8b-instant", name: "llama-3.1-8b-instant" },
        { value: "llama-3.3-70b-versatile", name: "llama-3.3-70b-versatile" },
        {
            value: "meta-llama/llama-4-maverick-17b-128e-instruct",
            name: "meta-llama/llama-4-maverick-17b-128e-instruct",
        },
        {
            value: "meta-llama/llama-4-scout-17b-16e-instruct",
            name: "meta-llama/llama-4-scout-17b-16e-instruct",
        },
        {
            value: "meta-llama/llama-guard-4-12b",
            name: "meta-llama/llama-guard-4-12b",
        },
        {
            value: "meta-llama/llama-prompt-guard-2-22m",
            name: "meta-llama/llama-prompt-guard-2-22m",
        },
        {
            value: "meta-llama/llama-prompt-guard-2-86m",
            name: "meta-llama/llama-prompt-guard-2-86m",
        },
        {
            value: "moonshotai/kimi-k2-instruct",
            name: "moonshotai/kimi-k2-instruct",
        },
        {
            value: "moonshotai/kimi-k2-instruct-0905",
            name: "moonshotai/kimi-k2-instruct-0905",
        },
        { value: "openai/gpt-oss-120b", name: "openai/gpt-oss-120b" },
        { value: "openai/gpt-oss-20b", name: "openai/gpt-oss-20b" },
        {
            value: "openai/gpt-oss-safeguard-20b",
            name: "openai/gpt-oss-safeguard-20b",
        },
        { value: "qwen/qwen3-32b", name: "qwen/qwen3-32b" },
    ],
} as {[key: string]: () => Promise<{name: string; value: string}[]> };
