import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const result = await response.data;

        if (result.success && !result.error) {
          setUser(result.data);
        } else {
          setError(result.message || "Failed to fetch profile.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-sm"
          />
        </div>

        {/* Name & Email */}
        <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-gray-500 mb-4">{user.email}</p>

        {/* Info Section */}
        <div className="text-left space-y-3">
          {user.phone && (
            <div>
              <p className="text-gray-600 text-sm font-medium">Phone</p>
              <p className="text-gray-800 font-semibold">{user.phone}</p>
            </div>
          )}

          {user.address && (
            <div>
              <p className="text-gray-600 text-sm font-medium">Address</p>
              <p className="text-gray-800 font-semibold">{user.address}</p>
            </div>
          )}

          {user.createdAt && (
            <div>
              <p className="text-gray-600 text-sm font-medium">Member Since</p>
              <p className="text-gray-800 font-semibold">
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200">
            Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
