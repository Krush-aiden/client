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
import { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { addMenu, fetchMenu, deleteMenu } from "@/feature/adminMenuSlicer";

function AddMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });

  const [selectedMenu, setSelectedMenu] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });

  const [error, setError] = useState<Partial<MenuFormSchema>>({});

  //MARK: Fetch Menus
  useEffect(() => {
    dispatch(fetchMenu()).unwrap();
  }, [dispatch]);

  const { menus, isLoading }: any = useSelector(
    (state: any) => state.adminMenu,
  );
  useEffect(() => {
    console.log("menu", menus);
  }, [menus]);

  //MARK: Input Change
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  //MARK: Submit Menu
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = menuSchema.safeParse(input);

    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      setError(fieldError as Partial<MenuFormSchema>);
      return;
    }

    setError({});

    try {
      await dispatch(addMenu(input)).unwrap();

      // reset form
      setInput({
        name: "",
        description: "",
        price: 0,
        image: undefined,
      });

      setOpen(false);

      // refresh list
      dispatch(fetchMenu());
    } catch (error) {
      console.log(error);
    }
  };

  //MARK: Delete Menu
  const handleDeleteClick = (id: string) => {
    setMenuToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (menuToDelete) {
      try {
        await dispatch(deleteMenu(menuToDelete)).unwrap();
        setDeleteConfirmOpen(false);
        setMenuToDelete(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 mb-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl dark:text-white">
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
              onSubmit={submitHandler}
              className="space-y-6 max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              {/* Name */}
              <div>
                <Label>Menu Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                />
                {error.name && (
                  <span className="text-xs text-red-600">{error.name}</span>
                )}
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                />
                {error.description && (
                  <span className="text-xs text-red-600">
                    {error.description}
                  </span>
                )}
              </div>

              {/* Price */}
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                />
                {error.price && (
                  <span className="text-xs text-red-600">{error.price}</span>
                )}
              </div>

              {/* Image */}
              <div>
                <Label>Upload Image</Label>
                <input
                  type="file"
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      image: e.target.files?.[0],
                    }))
                  }
                />
                {error.image && (
                  <span className="text-xs text-red-600">{error.image}</span>
                )}
              </div>

              <DialogFooter>
                <Button
                  disabled={isLoading}
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
                  {isLoading ? "Adding..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu List */}
      <div className="mt-6 space-y-4">
        {menus?.map((menu: any) => (
          <div
            key={menu._id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {menu.description}
              </p>
              <span className="text-orange font-bold text-sm">
                ₹{menu.price}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => {
                  setSelectedMenu(menu);
                  setEditOpen(true);
                }}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteClick(menu._id)}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddMenu;
