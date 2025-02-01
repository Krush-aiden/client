import { AppDispatch } from "@/app/store";
import { updateProfile } from "@/feature/UserSlicer";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Loader2, LocateIcon, Mail, MapPin, MapPinHouse } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  //   const [selectedProfilePic, setProfilePic] = useState<string>("");
  //   const [username, setUsername] = useState<string>("");

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    profilePictureName: {},
  });
  const [loading, setLoading] = useState(false);
  const profileDataChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  const dispatch = useDispatch<AppDispatch>();
  const [profileUrl, setprofileUrl] = useState("");
  const { isLoading }: any = useSelector((state: any) => state.user);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileData((previous) => ({
          ...previous,
          profilePictureName: file, // Store the data URL
        }));
        setprofileUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfileHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Todo Update Profile Data update API Implementation
    const payload = { updateProfileDetails: profileData };

    try {
      dispatch(updateProfile(payload)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthUserVal = localStorage.getItem("users");

    let checkAuthUserParsed = [];
    if (checkAuthUserVal) {
      try {
        checkAuthUserParsed = JSON.parse(checkAuthUserVal);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("No data found for users in localStorage.");
    }

    setProfileData({
      fullName: checkAuthUserParsed[0]?.user.fullName,
      email: checkAuthUserParsed[0]?.user.email,
      address: checkAuthUserParsed[0]?.user.address.includes("update")
        ? ""
        : checkAuthUserParsed[0]?.user.address,
      city: checkAuthUserParsed[0]?.user.city.includes("update")
        ? ""
        : checkAuthUserParsed[0]?.user.city,
      country: checkAuthUserParsed[0]?.user.country.includes("update")
        ? ""
        : checkAuthUserParsed[0]?.user.country,
      profilePictureName: checkAuthUserParsed[0]?.user?.profilePictureName,
    });
    setprofileUrl(checkAuthUserParsed[0]?.user?.profilePictureName);
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Avatar and Username Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Avatar */}
          <Avatar>
            <AvatarImage
              className="relative text-xs rounded-full w-32 h-32 object-cover"
              src={profileUrl || "https://github.com/shadcn.png"} // Default or selected profile image
              alt="Profile picture"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Username Input */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={profileDataChangeHandler}
              placeholder="Enter your username"
              className="border border-gray-300 p-3 rounded-md w-64 sm:w-80 md:w-96 bg-white" // Adjusted widths and padding
            />
          </div>
        </div>
      </div>
      {/* File Upload Button */}
      <div className="flex flex-col items-center mt-4 md:items-start md:mt-4">
        <label
          htmlFor="profile-pic-upload"
          className="cursor-pointer text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-all text-xs"
        >
          Choose a new profile picture
        </label>
        <input
          name="profilePicture"
          ref={imageRef}
          id="profile-pic-upload"
          accept="image/*"
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
      </div>
      {/* Email Input Section */}
      <div className="grid md:grid-cols-4 md:gap-6 gap-5 my-10">
        {/* Email Section */}
        <div className="flex items-center gap-4 rounded-md p-3 bg-gray-200 shadow-sm border border-gray-300">
          <Mail className="text-gray-500 w-5 h-5" />
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              disabled
              id="email"
              className="w-full text-xs text-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 mt-1"
              onChange={profileDataChangeHandler}
              value={profileData.email}
              name="email"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="flex items-center gap-4 rounded-md p-3 bg-white shadow-sm border border-gray-300">
          <LocateIcon className="text-gray-500 w-5 h-5" />
          <div className="w-full">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              className="w-full text-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 mt-1"
              onChange={profileDataChangeHandler}
              value={profileData.address}
              name="address"
              placeholder="Enter your address"
            />
          </div>
        </div>

        {/* City Section */}
        <div className="flex items-center gap-4 rounded-md p-3 bg-white shadow-sm border border-gray-300">
          <MapPin className="text-gray-500 w-5 h-5" />
          <div className="w-full">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              className="w-full text-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 mt-1"
              onChange={profileDataChangeHandler}
              value={profileData.city}
              name="city"
              placeholder="Enter your city"
            />
          </div>
        </div>

        {/* Country Section */}
        <div className="flex items-center gap-4 rounded-md p-3 bg-white shadow-sm border border-gray-300">
          <MapPinHouse className="text-gray-500 w-5 h-5" />
          <div className="w-full">
            <label
              htmlFor="country"
              className="text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              id="country"
              className="w-full text-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 mt-1"
              onChange={profileDataChangeHandler}
              value={profileData.country}
              name="country"
              placeholder="Enter your country"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 max-w-md justify-center items-center my-6 mx-auto">
        {loading ? (
          <button
            disabled
            className="bg-orange hover:bg-HoverOrange flex items-center justify-center px-6 py-2 rounded-lg"
          >
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </button>
        ) : (
          <button className="bg-orange hover:bg-HoverOrange flex items-center justify-center px-6 py-2 rounded-lg">
            Update
          </button>
        )}
      </div>
    </form>
  );
};

export default Profile;
