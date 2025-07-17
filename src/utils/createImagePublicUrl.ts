export const createImagePublicUrl = (imagePath: string): string => {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const relativePath = imagePath.replace("mnt/storage", "storage");
    return `${baseUrl}/${relativePath}`;
};
