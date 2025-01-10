import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function AvailableMenu() {
  return (
    <div className="md:p-8 p-6">
    <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center">
      Available Menu
    </h1>
    <Card className="md:max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img
        src="https://j6e2i8c9.rocketcdn.me/wp-content/uploads/2020/10/Paneer-tikka-pizza-recipe-4.jpg"
        className="w-full h-40 object-cover"
        alt="Paneer Pizza"
      />
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Paneer Pizza
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          A delicious blend of fresh paneer, spices, and a crispy base. Perfect for pizza lovers.
        </p>
        <h3 className="text-lg font-semibold mt-4 text-gray-900">
          Price: <span className="text-[#D19254]">₹80</span>
        </h3>
      </CardContent>
      <CardFooter>
        <Button className="bg-orange hover:bg-HoverOrange w-full text-white py-2 px-4 rounded-lg transition-colors duration-300">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  </div>
  
  );
}

export default AvailableMenu;
