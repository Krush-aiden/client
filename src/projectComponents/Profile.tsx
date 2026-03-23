import { updateProfileDetails } from "@/apiTypes/userApi";
import { AppDispatch } from "@/app/store";
import { updateProfile } from "@/feature/UserSlicer";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Camera,
  CheckCircle2,
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  MapPinHouse,
  Shield,
  User,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const imageRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState<updateProfileDetails>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    profilePictureName: {},
    admin: false,
  });

  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profileDataChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setIsDirty(true);
    // Clear the error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const [profileUrl, setProfileUrl] = useState("");
  const { isLoading }: any = useSelector((state: any) => state.user);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileData((previous) => ({
          ...previous,
          profilePictureName: file,
        }));
        setProfileUrl(result);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfileHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!profileData.fullName || profileData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required.";
    }
    if (!profileData.address || profileData.address.trim() === "") {
      newErrors.address = "Address is required.";
    }
    if (!profileData.city || profileData.city.trim() === "") {
      newErrors.city = "City is required.";
    }
    if (!profileData.country || profileData.country.trim() === "") {
      newErrors.country = "Country is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      dispatch(updateProfile(profileData)).unwrap();
      setIsDirty(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Compute completion percentage
  const completionFields = [
    profileData.fullName,
    profileData.email,
    profileData.address,
    profileData.city,
    profileData.country,
  ];
  const filledCount = completionFields.filter(
    (f) => f && f.toString().trim() !== "",
  ).length;
  const completionPercent = Math.round(
    (filledCount / completionFields.length) * 100,
  );

  useEffect(() => {
    const checkAuthUserVal = localStorage.getItem("users");
    let checkAuthUserParsed: any[] = [];
    if (checkAuthUserVal) {
      try {
        checkAuthUserParsed = JSON.parse(checkAuthUserVal);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    setProfileData({
      fullName: checkAuthUserParsed[0]?.user.fullName || "",
      email: checkAuthUserParsed[0]?.user.email || "",
      address: checkAuthUserParsed[0]?.user.address?.includes("update")
        ? ""
        : checkAuthUserParsed[0]?.user.address || "",
      city: checkAuthUserParsed[0]?.user.city?.includes("update")
        ? ""
        : checkAuthUserParsed[0]?.user.city || "",
      country: checkAuthUserParsed[0]?.user.country?.includes("update")
        ? ""
        : checkAuthUserParsed[0]?.user.country || "",
      profilePictureName: checkAuthUserParsed[0]?.user?.profilePictureName,
      admin: checkAuthUserParsed[0]?.user?.admin || false,
    });
    setProfileUrl(checkAuthUserParsed[0]?.user?.profilePictureName);
  }, []);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <form
      onSubmit={updateProfileHandler}
      className="max-w-4xl mx-auto my-24 px-4"
    >
      {/* Profile Header Card */}
      <div className="relative bg-gradient-to-r from-orange/80 to-orange rounded-2xl p-8 mb-8 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with camera overlay */}
          <div
            className="relative group cursor-pointer"
            onClick={() => imageRef.current?.click()}
          >
            <Avatar>
              <AvatarImage
                className="rounded-full w-28 h-28 object-cover border-4 border-white/30 shadow-lg"
                src={profileUrl || "https://github.com/shadcn.png"}
                alt="Profile picture"
              />
              <AvatarFallback className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold">
                {profileData.fullName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 w-28 h-28 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            name="profilePicture"
            ref={imageRef}
            accept="image/*"
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />

          <div className="text-center sm:text-left text-white">
            <h1 className="text-2xl font-bold">
              {profileData.fullName || "Your Name"}
            </h1>
            <p className="text-white/80 text-sm mt-1">{profileData.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  profileData.admin
                    ? "bg-white/20 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <Shield className="w-3 h-3" />
                {profileData.admin ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Completion ring - right side */}
          <div className="sm:ml-auto flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray={`${completionPercent} ${100 - completionPercent}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                {completionPercent}%
              </span>
            </div>
            <span className="text-white/70 text-xs mt-1">Complete</span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-orange" />
          Personal Information
        </h2>

        {/* Username */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={profileData.fullName}
            onChange={profileDataChangeHandler}
            placeholder="Enter your full name"
            className="w-full border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all"
          />
          {errors.fullName && (
            <span className="text-xs text-red-600 mt-1 block">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Email (disabled) */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <div className="relative">
            <input
              disabled
              value={profileData.email}
              name="email"
              className="w-full border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          </div>
        </div>

        {/* Address fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <LocateIcon className="w-4 h-4" />
              Address
            </label>
            <input
              name="address"
              value={profileData.address}
              onChange={profileDataChangeHandler}
              placeholder="Your address"
              className="w-full border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all"
            />
            {errors.address && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.address}
              </span>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              City
            </label>
            <input
              name="city"
              value={profileData.city}
              onChange={profileDataChangeHandler}
              placeholder="Your city"
              className="w-full border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all"
            />
            {errors.city && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.city}
              </span>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <MapPinHouse className="w-4 h-4" />
              Country
            </label>
            <input
              name="country"
              value={profileData.country}
              onChange={profileDataChangeHandler}
              placeholder="Your country"
              className="w-full border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all"
            />
            {errors.country && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.country}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Role Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-orange" />
          Account Role
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setProfileData({ ...profileData, admin: false });
              setIsDirty(true);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              !profileData.admin
                ? "bg-orange text-white shadow-md shadow-orange/25"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <User className="w-4 h-4" />
            User
          </button>
          <button
            type="button"
            onClick={() => {
              setProfileData({ ...profileData, admin: true });
              setIsDirty(true);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              profileData.admin
                ? "bg-orange text-white shadow-md shadow-orange/25"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-6 flex justify-center">
        {loading ? (
          <button
            disabled
            className="bg-orange/70 text-white flex items-center gap-2 px-10 py-3 rounded-xl font-medium cursor-not-allowed"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </button>
        ) : (
          <button
            type="submit"
            className={`flex items-center gap-2 px-10 py-3 rounded-xl font-medium transition-all ${
              isDirty
                ? "bg-orange hover:bg-HoverOrange text-white shadow-lg shadow-orange/25 hover:shadow-xl hover:shadow-orange/30"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {isDirty ? "Save Changes" : "No Changes"}
          </button>
        )}
      </div>
    </form>
  );
};

export default Profile;
