export type CreateNotification = {
    title: string;
    description?: string;
    card?: Record<string, unknown>;
    originalCreatorUniqueId?: string;
};
