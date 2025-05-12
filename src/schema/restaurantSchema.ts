import {z} from "zod";

export const restaurantFormSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required."),
    restaurantCity: z.string().min(1, "City name is required"),
    restaurantCountry: z.string().min(1, "Country name is required."),
    restaurantEdt: z.number().min(2,"Delivery time is required"),
    restaurantCuisines: z.array(z.string()).nonempty("At least one cuisine is required"),
    restaurantImage:z.instanceof(File)
    .refine((file) => file?.size !== 0, { message: "Image file is required" })
    .optional()
});

export type restaurantFormSchema = z.infer<typeof restaurantFormSchema>;
