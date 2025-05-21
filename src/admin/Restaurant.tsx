import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { restaurantFormSchema } from "@/schema/restaurantSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import {
  fetchRestaurantFunction,
  restaurantUpdate,
  restaurantEdit,
  RestaurantUpdateAndEditDetails,
} from "@/feature/adminSlicer";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const Restaurant = () => {
  const loading = false;
  const [restaurantPresent, setRestaurantPresent] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const [input, setInput] = useState<RestaurantUpdateAndEditDetails>({
    restaurantName: "",
    restaurantCity: "",
    restaurantCountry: "",
    restaurantEdt: 0,
    restaurantCuisines: [],
    restaurantImage: {},
  });

  const dispatch = useDispatch<AppDispatch>();
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const [errors, setErrors] = useState<Partial<restaurantFormSchema>>({});

  const [profileUrl, setProfileUrl] = useState("");
  // console.log("🚀 ~ Restaurant ~ profileUrl:", profileUrl);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setInput((previous) => ({
          ...previous,
          restaurantImage: file, // Store the data URL
        }));
        setProfileUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = restaurantFormSchema.safeParse(input);
    console.log("🚀 ~ onSubmitFormHandler ~ result:", result);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      console.log("🚀 ~ onSubmitFormHandler ~ fieldErrors:", fieldErrors);
      setErrors(fieldErrors as Partial<restaurantFormSchema>);
      console.log("🚀 ~ Restaurant ~ errors:", errors);
      return;
    } else {
      setErrors({
        restaurantName: "",
        restaurantCity: "",
        restaurantCountry: "",
        restaurantEdt: undefined,
        restaurantCuisines: [""],
      });
    }

    //Todo Api Implementation starts here
    console.log(input);

    try {
      if (restaurantPresent) {
        dispatch(restaurantEdit(input)).unwrap();
      } else {
        dispatch(restaurantUpdate(input)).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchRestaurantFunction()).unwrap();
  }, []);

  const { restaurantDetails }: any = useSelector((state: any) => state.admin);

  useEffect(() => {
    console.log(
      "🚀 ~ getRestaurantDetails ~ restaurantDetails:",
      restaurantDetails
    );
    if (restaurantDetails?.[0]?.success) {
      setInput({
        restaurantName: restaurantDetails[0].restaurant[0].restaurantName,
        restaurantCity: restaurantDetails[0].restaurant[0].city,
        restaurantCountry: restaurantDetails[0].restaurant[0].country,
        restaurantEdt: restaurantDetails[0].restaurant[0].deliveryTime,
        restaurantCuisines: restaurantDetails[0].restaurant[0].cuisines,
      });
      setProfileUrl(restaurantDetails[0].restaurant[0].imageUrl);
      setRestaurantPresent(restaurantDetails?.[0]?.success);
    }
  }, [restaurantDetails]);

  return (
    <div className="max-w-6xl mx-auto my-10 px-6">
      <div>
        <h1 className="font-extrabold text-3xl text-gray-800 mb-6">
          {restaurantPresent ? "Update Restaurant" : "Add Your Restaurant"}
        </h1>
        <form onSubmit={onSubmitFormHandler}>
          <div className="md:grid grid-cols-2 gap-6 space-y-4 md:space-y-0">
            <div>
              <Label className="block font-semibold text-lg text-left text-gray-700 mb-2">
                Restaurant Name
              </Label>
              <Input
                type="text"
                name="restaurantName"
                value={input.restaurantName}
                onChange={changeEventHandler}
                placeholder="Enter your restaurant name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantName}
                </span>
              )}
            </div>
            <div>
              <Label className="block font-semibold text-lg text-left text-gray-700 mb-2">
                City
              </Label>
              <Input
                type="text"
                name="restaurantCity"
                placeholder="Enter your city"
                value={input.restaurantCity}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantCity}
                </span>
              )}
            </div>
            <div>
              <Label className="block font-semibold text-lg text-left text-gray-700 mb-2">
                Country
              </Label>
              <Input
                type="text"
                name="restaurantCountry"
                placeholder="Enter your country"
                value={input.restaurantCountry}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantCountry}
                </span>
              )}
            </div>
            <div>
              <Label className="block font-semibold text-lg text-left text-gray-700 mb-2">
                Estimated Delivery Time(Minutes)
              </Label>
              <Input
                type="number"
                name="restaurantEdt"
                placeholder="0"
                value={input.restaurantEdt}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantEdt}
                </span>
              )}
            </div>
            <div>
              <Label className="block font-semibold text-lg text-left text-gray-700 mb-2">
                Cuisines
              </Label>
              <Input
                type="text"
                name="restaurantCuisines"
                placeholder="eg:Italian, Chinese, Indian"
                value={input.restaurantCuisines}
                onChange={(e) =>
                  setInput({
                    ...input,
                    restaurantCuisines: e.target.value.split(","),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantCuisines}
                </span>
              )}
            </div>

            <div>
              <Label className="block font-semibold text-lg text-left text-gray-700 mb-2">
                Upload Restaurant Banner
              </Label>
              <input
                type="file"
                name="restaurantBanner"
                ref={imageRef}
                accept="image/*"
                onChange={fileChangeHandler}
                className="bg-white mt-2 w-full text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantImage}
                </span>
              )}
            </div>
            {loading ? (
              <Button
                disabled
                className="w-full py-2 bg-orange hover:bg-HoverOrange text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-full py-2 bg-orange hover:bg-HoverOrange text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                {restaurantPresent
                  ? "Update Restaurant"
                  : "Add Your Restaurant"}
              </Button>
            )}

            <div>
              <Avatar>
                <AvatarImage
                  className="relative text-xs rounded w-50 h-24 object-cover"
                  src={
                    profileUrl ||
                    "https://img.freepik.com/free-psd/food-menu-restaurant-web-banner-template_106176-812.jpg?t=st=1744647131~exp=1744650731~hmac=1b45f7a0d053a8a74531d186d02d98a9980d57f8778e73d830c3e84b96b87579&w=900"
                  } // Default or selected profile image
                  alt="Rectangle Banner"
                />
              </Avatar>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Restaurant;
