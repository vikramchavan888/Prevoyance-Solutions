import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:3000/auth/home", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data.user);
        setEditedDetails({
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          email: response.data.user.email,
          mobile: response.data.user.mobile,
          address: response.data.user.address,
        });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        toast.error("Error fetching user details: " + error.message);
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:3000/auth/users/${user.id}`,
        {
          first_name: editedDetails.firstName,
          last_name: editedDetails.lastName,
          email: editedDetails.email,
          mobile: editedDetails.mobile,
          address: editedDetails.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setUser({
          ...user,
          first_name: editedDetails.firstName,
          last_name: editedDetails.lastName,
          email: editedDetails.email,
          mobile: editedDetails.mobile,
          address: editedDetails.address,
        });
        setIsEditing(false);
        toast.success("User details updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
        toast.error("Error updating user details: " + error.message);
      });
  };

  return (
    <>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-red-200 hover:bg-red-300 px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Welcome {editedDetails.firstName}
        </h1>
        {user ? (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                {user.profile_picture ? (
                  <img
                    src={`http://localhost:3000/uploads/${user.profile_picture}`}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-300"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-300">
                    <span className="text-xl text-white">No Image</span>
                  </div>
                )}
              </div>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editedDetails.firstName || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editedDetails.lastName || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedDetails.email || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={editedDetails.mobile || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editedDetails.address || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out mr-2"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedDetails({
                            firstName: user.first_name,
                            lastName: user.last_name,
                            email: user.email,
                            mobile: user.mobile,
                            address: user.address,
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700">
            Loading user details...
          </p>
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default UserDashboard;
