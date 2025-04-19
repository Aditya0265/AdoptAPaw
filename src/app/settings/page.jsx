"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiSave,
  FiEdit,
} from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SettingsPage() {
  const router = useRouter();
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });
  const [userApplications, setUserApplications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState({
    profile: false,
    password: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return;

      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [status]);

  useEffect(() => {
    const fetchUserApplications = async () => {
      if (status === "loading") return;

      try {
        const response = await fetch("/api/applications");

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setUserApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchUserApplications();
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleEditing = (section) => {
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
    setErrors({});
    setSuccessMessage("");

    // Reset password fields if canceling password edit
    if (section === "password" && isEditing.password) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);

      await update({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
        },
      });

      setSuccessMessage("Profile updated successfully");
      setIsEditing((prev) => ({ ...prev, profile: false }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update password");
      }

      setSuccessMessage("Password updated successfully");
      setIsEditing((prev) => ({ ...prev, password: false }));
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || !userData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-20 flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Account Settings
          </h1>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
            >
              {successMessage}
            </motion.div>
          )}
          
          {/* Force centered content with proper width scaling */}
          <div className="px-4 md:px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto w-full lg:w-11/12 xl:w-10/12">
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">
                        Profile Information
                      </h2>
                      <button
                        onClick={() => toggleEditing("profile")}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        {isEditing.profile ? (
                          "Cancel"
                        ) : (
                          <>
                            <FiEdit className="mr-1" /> Edit
                          </>
                        )}
                      </button>
                    </div>

                    {errors.general && (
                      <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        {errors.general}
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="input-label">
                          Full Name
                        </label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing.profile}
                            className={`input-field pl-10 ${
                              isEditing.profile ? "" : "bg-gray-50"
                            } ${errors.name ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="input-label">
                          Email Address
                        </label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={userData.email}
                            disabled
                            className="input-field pl-10 bg-gray-50"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label htmlFor="phone" className="input-label">
                          Phone Number
                        </label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing.profile}
                            className={`input-field pl-10 ${
                              isEditing.profile ? "" : "bg-gray-50"
                            } ${errors.phone ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="address" className="input-label">
                          Address
                        </label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                            <FiMapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <textarea
                            id="address"
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing.profile}
                            className={`input-field pl-10 ${
                              isEditing.profile ? "" : "bg-gray-50"
                            } ${errors.address ? "border-red-500" : ""}`}
                          ></textarea>
                        </div>
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {isEditing.profile && (
                        <div>
                          <button
                            type="submit"
                            className="btn-primary w-full flex justify-center items-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            ) : (
                              <FiSave className="mr-2" />
                            )}
                            {isLoading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">
                        Password
                      </h2>
                      <button
                        onClick={() => toggleEditing("password")}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        {isEditing.password ? (
                          "Cancel"
                        ) : (
                          <>
                            <FiEdit className="mr-1" /> Change
                          </>
                        )}
                      </button>
                    </div>

                    {isEditing.password ? (
                      <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="input-label"
                          >
                            Current Password
                          </label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className={`input-field pl-10 ${
                                errors.currentPassword ? "border-red-500" : ""
                              }`}
                            />
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.currentPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="input-label">
                            New Password
                          </label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className={`input-field pl-10 ${
                                errors.newPassword ? "border-red-500" : ""
                              }`}
                            />
                          </div>
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="input-label"
                          >
                            Confirm New Password
                          </label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className={`input-field pl-10 ${
                                errors.confirmPassword ? "border-red-500" : ""
                              }`}
                            />
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btn-primary w-full flex justify-center items-center"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          ) : (
                            <FiSave className="mr-2" />
                          )}
                          {isLoading ? "Updating..." : "Update Password"}
                        </button>
                      </form>
                    ) : (
                      <p className="text-gray-600">
                        To change your password, click the "Change" button above.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {session?.user?.role !== 'ADMIN' ? (
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Your Applications
                      </h2>

                      {userApplications.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          You haven't applied for any adoptions yet.
                        </p>
                      ) : (
                        <ul className="space-y-4 mt-6">
                          {userApplications.map((app) => (
                            <li
                              key={app.id}
                              className="border-b border-gray-200 pb-4"
                            >
                              <Link
                                href={`/application/${app.dogId}`}
                                className="block hover:text-primary-600 transition-colors"
                              >
                                <p className="font-medium">{app.dog.name}</p>
                                <p className="text-sm text-gray-500">
                                  Submitted on{" "}
                                  {new Date(app.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                <span
                                  className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                                    app.status === "SUBMITTED"
                                      ? "bg-blue-100 text-blue-800"
                                      : app.status === "HOME_VISIT_SCHEDULED"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : app.status === "HOME_VISIT_COMPLETED"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : app.status === "FINAL_VISIT_SCHEDULED"
                                      ? "bg-purple-100 text-purple-800"
                                      : app.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {app.status === "SUBMITTED"
                                    ? "Submitted"
                                    : app.status === "HOME_VISIT_SCHEDULED"
                                    ? "Home Visit Scheduled"
                                    : app.status === "HOME_VISIT_COMPLETED"
                                    ? "Home Visit Completed"
                                    : app.status === "FINAL_VISIT_SCHEDULED"
                                    ? "Final Visit Scheduled"
                                    : app.status === "COMPLETED"
                                    ? "Completed"
                                    : "Rejected"}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Admin sidebar content
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Admin Quick Links
                      </h2>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/home" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            Manage Applications
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Manage Dogs
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        System Status
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Server Load</span>
                            <span className="text-sm font-medium text-gray-700">32%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Storage</span>
                            <span className="text-sm font-medium text-gray-700">68%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="text-sm text-gray-600">Last backup: <span className="font-medium">24 hours ago</span></p>
                          <p className="text-sm text-gray-600">Active users: <span className="font-medium">143</span></p>
                          <p className="text-sm text-gray-600">Pending applications: <span className="font-medium">28</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}