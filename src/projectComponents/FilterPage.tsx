import { Button } from "@/components/ui/button";

export interface IFilterOptionsState {
  id: string;
  label: string;
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

interface FilterPageProps {
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

function FilterPage({ selectedFilters = [], onFilterChange }: FilterPageProps) {
  const appliedFilterHandler = (value: string) => {
    if (!onFilterChange) return;
    const updated = selectedFilters.includes(value)
      ? selectedFilters.filter((f) => f !== value)
      : [...selectedFilters, value];
    onFilterChange(updated);
  };

  const handleReset = () => {
    if (onFilterChange) onFilterChange([]);
  };

  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg dark:text-white">
          Filter by cuisine
        </h1>
        <Button
          variant={"link"}
          className="bg-orange hover:bg-HoverOrange"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
      {filterOptions.map((options) => {
        const isChecked = selectedFilters.includes(options.label);
        return (
          <div className="flex items-center space-x-2 my-5" key={options.id}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden peer"
                id={options.id}
                checked={isChecked}
                onChange={() => appliedFilterHandler(options.label)}
              />
              <span
                className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                  isChecked
                    ? "bg-black border-black text-white"
                    : "border-gray-300"
                }`}
              >
                {isChecked && "✔"}
              </span>
              <span className="text-lg dark:text-gray-300">
                {" "}
                {options.label}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default FilterPage;
