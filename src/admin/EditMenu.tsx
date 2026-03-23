import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuFormSchema, menuEditSchema } from "@/schema/menuSchema";
import { useDispatch, useSelector } from "react-redux";
import { editMenu, fetchMenu } from "@/feature/adminMenuSlicer";
import { AppDispatch } from "@/app/store";

function EditMenu({
  selectedMenu,
  editOpen,
  setEditOpen,
}: {
  selectedMenu: MenuFormSchema & { _id?: string };
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });

  const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: any) => state.adminMenu);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 ~ submitHandler ~ input:", input);

    // Validate — image is optional for edits
    const dataToValidate = {
      ...input,
      image: input.image instanceof File ? input.image : undefined,
    };
    const result = menuEditSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<MenuFormSchema>);
      return;
    }
    setErrors({});

    try {
      await dispatch(editMenu({ ...input, _id: selectedMenu._id })).unwrap();

      // Reset form and close dialog
      setInput({
        name: "",
        description: "",
        price: 0,
        image: undefined,
      });
      setEditOpen(false);

      // Refresh menu list
      dispatch(fetchMenu());
    } catch (error) {
      console.log("Error editing menu:", error);
    }
  };

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  useEffect(() => {
    setInput({
      name: selectedMenu?.name || "",
      description: selectedMenu?.description || "",
      price: selectedMenu?.price || 0,
      image: selectedMenu?.image || undefined,
    });
  }, [selectedMenu]);
  // console.log("🚀 ~ selectedMenu:", selectedMenu);
  console.log("🚀 ~ changeEventHandler ~ input:", input);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update Your menu to keep your offerings fresh & exciting!
          </DialogDescription>
        </DialogHeader>
        <form
          action=""
          onSubmit={submitHandler}
          className="space-y-6 max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          {/* Name Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Menu Name
            </Label>
            <Input
              type="text"
              name="name"
              value={input?.name}
              placeholder="Enter menu name"
              onChange={changeEventHandler}
              className="bg-white dark:bg-gray-700 dark:text-white mt-2 px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.name && (
              <span className="text-xs text-red-600">{errors.name}</span>
            )}
          </div>

          {/* Description Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Input
              type="text"
              name="description"
              value={input?.description}
              onChange={changeEventHandler}
              placeholder="Enter menu description"
              className="bg-white dark:bg-gray-700 dark:text-white mt-2 px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.description && (
              <span className="text-xs text-red-600">{errors.description}</span>
            )}
          </div>

          {/* Price Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Price in (₹)
            </Label>
            <Input
              type="number"
              name="price"
              value={input?.price}
              onChange={changeEventHandler}
              placeholder="Enter menu price"
              className="bg-white dark:bg-gray-700 dark:text-white mt-2 px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.price && (
              <span className="text-xs text-red-600">{errors.price}</span>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Upload Menu Image
            </Label>
            <input
              type="file"
              // value={input?.image}
              name="image"
              onChange={(e) =>
                setInput({
                  ...input,
                  image: e.target.files?.[0] || undefined,
                })
              }
              className="bg-white dark:bg-gray-700 dark:text-gray-300 mt-2 w-full text-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full py-2 bg-orange hover:bg-HoverOrange text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Updating..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMenu;
