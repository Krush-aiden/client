import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function AddMenu() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menu
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-orange hover:bg-HoverOrange">
            + Add Menus
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add a new Menu
                <DialogDescription>
                  Create a menu that will make your restaurant stand out.
                </DialogDescription>
              </DialogTitle>
            </DialogHeader>
            <form
              action=""
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
                  placeholder="Enter menu name"
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
                  type="text"
                  name="price"
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
                  name="image"
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
      </div>
    </div>
  );
}

export default AddMenu;
