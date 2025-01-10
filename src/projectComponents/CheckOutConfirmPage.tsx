import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  { Dispatch, FormEvent, SetStateAction, useState } from "react";

function CheckOutConfirmPage({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [input, setInput] = useState({
        name:"",
        email:"",
        contact:"",
        address:"",
        city:"",
        country:""
    });
    const changEventHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
            const {name,value} = e.target;
            setInput({...input, [name]:value});
    };
    const checkOutHandler = (e:FormEvent<HTMLFormElement>) => {
        console.log("🚀 ~ checkOutHandler ~ e:", e);
        e.preventDefault();
        //Todo Api Implementation starts here
        console.log(input);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
          <DialogDescription className="text-xs">
            Please review your delivery details carefully to ensure all
            information is accurate. Once you are satisfied, click the
            &quot;Confirm&quot; button to finalize your order.
          </DialogDescription>
          <form onSubmit={checkOutHandler}>
            <div className="md:gird grid-cols-2 gap-2 space-y-1 md:space-y-0">
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changEventHandler}
              ></Input>
            </div>
            <div className="md:gird grid-cols-2 gap-2 space-y-1 md:space-y-0">
              <Label>E mail</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changEventHandler}
              ></Input>
            </div>
            <div className="md:gird grid-cols-2 gap-2 space-y-1 md:space-y-0">
              <Label>Contact</Label>
              <Input
                type="text"
                name="contact"
                value={input.contact}
                onChange={changEventHandler}
              ></Input>
            </div>
            <div className="md:gird grid-cols-2 gap-2 space-y-1 md:space-y-0">
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={input.address}
                onChange={changEventHandler}
              ></Input>
            </div>
            <div className="md:gird grid-cols-2 gap-2 space-y-1 md:space-y-0">
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={input.city}
                onChange={changEventHandler}
              ></Input>
            </div>
            <div className="md:gird grid-cols-2 gap-2 space-y-1 md:space-y-0">
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                value={input.country}
                onChange={changEventHandler}
              ></Input>
            </div>
            <DialogFooter className="col-span-2 pt-5">
              <Button className="bg-orange hover:bg-HoverOrange">Continue To Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
}

export default CheckOutConfirmPage;
