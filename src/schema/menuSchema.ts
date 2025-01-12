import {z} from "zod"

export const menuSchema = z.object({
    name:z.string().nonempty({message:"name is required"}),
    description:z.string().nonempty({message:"description is required"}),
    price:z.number().min(0, {message:"price cannot be negative"}),
    image:z.instanceof(File)
    .refine((file) => file?.size !== 0, { message: "Image file is required" })
    .optional()
});

export type MenuFormSchema = z.input<typeof menuSchema>;
