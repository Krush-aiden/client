import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { restaurantFormSchema } from "@/schema/restaurantSchema";

const Restaurant = () => {
  const loading = false;
  const restaurantPresent = false;

  const [input, setInput] = useState<restaurantFormSchema>({
    restaurantName: "",
    restaurantCity: "",
    restaurantCountry: "",
    restaurantEdt: 0,
    restaurantCuisines: [],
    restaurantImage: undefined,
  });

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const [errors, setErrors] = useState<Partial<restaurantFormSchema>>({});

  const onSubmitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = restaurantFormSchema.safeParse(input);
    console.log("🚀 ~ onSubmitFormHandler ~ result:", result);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<restaurantFormSchema>);
      console.log("🚀 ~ Restaurant ~ errors:", errors);
      return;
    }

    //Todo Api Implementation starts here
    console.log(input);
  };

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
                name="restaurantImage"
                accept="image/*"
                // value = {input.restaurantImage?.name[0]}
                onChange={(e) =>
                  setInput({
                    ...input,
                    restaurantImage: e.target.files?.[0] || undefined,
                  })
                }
                className="bg-white mt-2 w-full text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              {errors && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.restaurantImage?.name}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Restaurant;
