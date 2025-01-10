import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import CheckOutConfirmPage from "./CheckOutConfirmPage";

const Cart = () =>{
  const [open,setOpen] = useState<boolean>(false);

    return (
      <div className="flex flex-col max-w-7xl mx-auto my-10">
        <div className="flex justify-end">
          <Button variant="link" className="bg-white">
            Clear all
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Items</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-start">
            <TableRow>
            <TableCell>
              <Avatar className="size-14">
                <AvatarImage
                  className="relative left-2 text-xs rounded-full size-10"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>Paneer Pizza</TableCell>
            <TableCell >80</TableCell>
            <TableCell>
                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                        <Button size={'icon'} className="rounded-full" ><Minus/></Button>
                        <Button disabled className="bg-white text-black font-semibold" >1</Button>
                        <Button size={'icon'} className="rounded-full" ><Plus/></Button>
                </div>
            </TableCell>
            <TableCell >80</TableCell>
            <TableCell className="text-right">
                <Button className="bg-orange hover:bg-HoverOrange text-right" size={"sm"}>Remove</Button>
            </TableCell>
            </TableRow>

          </TableBody>
          <TableFooter>
                <TableRow>
                    <TableCell colSpan={5} className="text-start font-semibold">Total</TableCell>
                    <TableCell className="text-right font-semibold">₹ 80</TableCell>
                </TableRow>
          </TableFooter>
        </Table>
        <div className="flex justify-end my-5">
          <Button className="bg-orange hover:bg-HoverOrange" onClick={() => setOpen(true)}>Proceed To CheckOut</Button>
        </div>
      <CheckOutConfirmPage open={open} setOpen={setOpen}/>
      </div>
    );
};

export default Cart;