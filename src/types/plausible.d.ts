declare global {
    interface Window {
        plausible?: (
            eventName: string,
            options?: {
                props?: Record<string, string | number | boolean | null | undefined>;
                url?: string;
            }
        ) => void;
    }
}

export {};