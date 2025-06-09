

export const API_ADMIN: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/`;

// Define TypeScript interfaces for restaurant update
export interface RestaurantUpdateAndEditDetails {
  restaurantName: string;
  restaurantCity: string;
  restaurantCountry: string;
  restaurantEdt?: any;
  restaurantCuisines?: string[];
  restaurantImage?: any;
}

export interface RestaurantUpdateAndEditResponse {
  message: string;
  restaurant: any;
}

// Define TypeScript interfaces for restaurant update
export interface MenuAddAndEditDetails {
  restaurantName: string;
  restaurantCity: string;
  restaurantCountry: string;
  restaurantEdt?: any;
  restaurantCuisines?: string[];
  restaurantImage?: any;
}

export interface MenuAddAndEditResponse {
  message: string;
  restaurant: any;
}
