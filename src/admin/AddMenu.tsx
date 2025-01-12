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
// import pizzaImage from "@/assets/Hero_Page_Pizza.jpg";
import EditMenu from "./EditMenu";
import { MenuFormSchema } from "@/schema/menuSchema";

function AddMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image:  undefined
  });
  // const loading = false;
  const menus = [
    {
      name:"pizza",
    description:"lorem asjdkas asjdasdj",
    price:80,
    image:"https://media.istockphoto.com/id/638000936/photo/vegan-and-vegetarian-indian-cuisine-hot-spicy-dishes.jpg?s=612x612&w=0&k=20&c=ISxBGeKALq9c11v05BbNw2XtRzQaGn4BddU8BHF9ANk="
    },
    {
      name:"momos",
      description:"lorem asjdkas asjdasdj",
      price:80,
      image:"https://media.istockphoto.com/id/638000936/photo/vegan-and-vegetarian-indian-cuisine-hot-spicy-dishes.jpg?s=612x612&w=0&k=20&c=ISxBGeKALq9c11v05BbNw2XtRzQaGn4BddU8BHF9ANk="
    },
    {
      name:"burger",
      description:"lorem asjdkas asjdasdj",
      price:80,
      image:"https://media.istockphoto.com/id/638000936/photo/vegan-and-vegetarian-indian-cuisine-hot-spicy-dishes.jpg?s=612x612&w=0&k=20&c=ISxBGeKALq9c11v05BbNw2XtRzQaGn4BddU8BHF9ANk="
    },
    {
      name:"crispy paneer",
      description:"lorem asjdkas asjdasdj",
      price:80,
      image:"https://media.istockphoto.com/id/638000936/photo/vegan-and-vegetarian-indian-cuisine-hot-spicy-dishes.jpg?s=612x612&w=0&k=20&c=ISxBGeKALq9c11v05BbNw2XtRzQaGn4BddU8BHF9ANk="
    }
    
]

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menu
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-orange hover:bg-HoverOrange p-3 rounded-lg">
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
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        menus.map((menu:any, idx:number) => {
          return (
            <div key={idx} className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
              <img
                src={menu.image}
                alt="res_Image"
                className="md:h-24 md:w-24 object-cover w-full h-full rounded-lg shadow-lg"
              />
              <div className="flex-1 text-left">
                <h1 className="text-lg font-semibold text-gray-800">{menu.name}</h1>
                <p className="text-sm text-gray-600 mt-1"> Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                <h2 className="text-md font-semibold mt-2">
                  Price: <span className="text-[#D19254]">₹80</span>
                </h2>
              </div>
              <Button 
              onClick={() => {
                console.log("🚀 ~ menus.map ~ menu:", menu);
                setSelectedMenu(menu);
                setEditOpen(true);
              }}
              className="bg-orange hover:bg-hoverOrange mt-2" size={'sm'}>Edit</Button>
            </div>
          </div>
          );
        })
      }
      <EditMenu selectedMenu ={selectedMenu} editOpen = {editOpen} setEditOpen={setEditOpen} />
    </div>
  );
}

export default AddMenu;
