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
import { MenuFormSchema } from "@/schema/menuSchema";

function EditMenu({
  selectedMenu,
  editOpen,
  setEditOpen,
}: {
  selectedMenu: MenuFormSchema;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  console.log("🚀 ~ changeEventHandler ~ input:", input);

  //Todo api implementation starts here

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
          className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
        >
          {/* Name Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700">
              Menu Name
            </Label>
            <Input
              type="text"
              name="name"
              value={input?.name}
              placeholder="Enter menu name"
              onChange={changeEventHandler}
              className="bg-white mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Description Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700">
              Description
            </Label>
            <Input
              type="text"
              name="description"
              value={input?.description}
              onChange={changeEventHandler}
              placeholder="Enter menu description"
              className="bg-white mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Price Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700">
              Price in (₹)
            </Label>
            <Input
              type="number"
              name="price"
              value={input?.price}
              onChange={changeEventHandler}
              placeholder="Enter menu price"
              className="bg-white mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700">
              Upload Menu Image
            </Label>
            <input
              type="file"
              // value={input?.image}
              name="image"
              onChange={(e) => setInput({
                ...input,
                image: e.target.files?.[0] || undefined,
              })
            }
              className="bg-white mt-2 w-full text-gray-700 border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button className="w-full py-2 bg-orange hover:bg-HoverOrange text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMenu;
