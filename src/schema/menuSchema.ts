import {z} from "zod"
const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const menuSchema = z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    price:z.number().min(1, "Price is required & cannot be nagative"),
    image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `image is required`)
});

export type MenuFormSchema = z.input<typeof menuSchema>;
