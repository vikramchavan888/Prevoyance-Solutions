// Admin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not admin");
      navigate("/login");
      return;
    }
    fetchUsers(token);
  }, [navigate]);

  const fetchUsers = (token) => {
    axios
      .get("http://localhost:3000/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        toast.error("Error fetching users: " + error.message);
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:3000/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      })
      .catch((error) => {
        toast.error("Error deleting user: " + error.message);
      });
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
    });
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:3000/auth/users/${id}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const updatedUsers = users.map((user) =>
          user.id === id ? { ...user, ...editedUser } : user
        );
        setUsers(updatedUsers);
        setEditingUserId(null);
        setEditedUser({});
        toast.success("User updated successfully");
      })
      .catch((error) => {
        toast.error("Error updating user: " + error.message);
      });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  // Bulk Upload
  const handleBulkFileChange = (e) => {
    setBulkFile(e.target.files[0]);
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.error("Please select an Excel file to upload");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", bulkFile);
    axios
      .post("http://localhost:3000/auth/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message || "Bulk upload successful");
        setShowUploadModal(false);
        // Refresh users after bulk upload
        fetchUsers(token);
      })
      .catch((error) => {
        toast.error("Error uploading file: " + error.message);
      });
  };

  return (
    <>
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Home
        </button>
      </div>
      <div className="absolute top-4 right-24 flex gap-2">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded"
        >
          Upload File
        </button>
        <button
          onClick={() => navigate("/adduser")}
          className="bg-green-400 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Add New User
        </button>
      </div>

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-white">
                  Profile Picture
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Address
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-center">
                    {user.profile_picture ? (
                      /^https?:\/\//.test(user.profile_picture) ? (
                        <img
                          src={user.profile_picture}
                          alt="Profile"
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        <img
                          src={`http://localhost:3000/uploads/${user.profile_picture}`}
                          alt="Profile"
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                      )
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        name="first_name"
                        value={editedUser.first_name}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      user.first_name
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        name="last_name"
                        value={editedUser.last_name}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      user.last_name
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingUserId === user.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        name="mobile"
                        value={editedUser.mobile}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      user.mobile
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        name="address"
                        value={editedUser.address}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      user.address
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingUserId === user.id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      {/* Modal for Bulk Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Bulk Upload Users</h2>
            <form onSubmit={handleBulkUpload}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Upload Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleBulkFileChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
