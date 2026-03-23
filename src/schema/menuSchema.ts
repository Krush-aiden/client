import {z} from "zod"
const MAX_FILE_SIZE = 5000000;

export const menuSchema = z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    price:z.number().min(1, "Price is required & cannot be negative"),
    image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `image is required`)
});

// Edit variant — image is optional (only validate if a new file was picked)
export const menuEditSchema = z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    price: z.number().min(1, "Price is required & cannot be negative"),
    image: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Image must be under 5 MB`)
    .optional(),
});

export type MenuFormSchema = z.input<typeof menuSchema>;
