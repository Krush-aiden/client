import { Button } from "@/components/ui/button";

export interface IFilterOptionsState {
    id:string;
    label:string;
}

const filterOptions: IFilterOptionsState[] = [
  {
    id: "Burger",
    label: "Burger",
  },
  {
    id: "Thali",
    label: "Thali",
  },
  {
    id: "Momos",
    label: "Momos",
  },
  {
    id: "Pizza",
    label: "Pizza",
  },
];

const appliedFilterHandler = (value:string) => {
      console.log(value);
};

function FilterPage() {
  return (
   <div className="md:w-72">
      <div className="flex items-center justify-between">
      <h1 className="font-medium text-lg">Filter by cuisine</h1>
      <Button variant={"link"} className="bg-orange hover:bg-HoverOrange">Reset</Button>
      </div>
    {
      filterOptions.map((options) => {
        return (
          <div className="flex items-center space-x-2 my-5" key={options.id}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="hidden peer" id={options.id} onClick={() => appliedFilterHandler(options.label)} />
              <span className="w-6 h-6 border-2 border-gray-300 rounded-lg peer-checked:bg-black peer-checked:border-black-600 peer-checked:before:content-['✔'] peer-checked:before:text-white transition-all"></span>
              <span className="text-lg"> {options.label}</span>
            </label>
          </div>
        );
      })
    }
   </div>
  );
}

export default FilterPage;
