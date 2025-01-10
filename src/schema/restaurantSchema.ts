import {z} from "zod";

export const restaurantListSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required."),
    restaurantCity: z.string().min(1, "City name is required"),
    restaurantCountry: z.string().min(1, "Country name is required."),
    restaurantEdt: z.number().min(2,"Delivery time is required"),
    restaurantCuisines:z.array(z.string()),
    restaurantImage:z.instanceof(File).optional().refine((file) => file?.size !== 0, {message:"Image file is required"})
});

export type restaurantListState = z.infer<typeof restaurantListSchema>;
