import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Adduser = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    profilePicture: null,
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    if (e.target.name === "profilePicture") {
      setValues({ ...values, [e.target.name]: e.target.files[0] });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      const response = await axios.post(
        "http://localhost:3000/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

     if (response.status === 201) {
       toast.success("User added successfully!");
       setTimeout(() => {
         navigate("/adminPage");
       }, 2000); 
     }

    } catch (err) {
      toast.error("Error adding user: " + err.message);
     
    }
  };

  return (
    <>
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/adminPage")}
          className="bg-blue-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Add New User
          </h2>
          <form onSubmit={handleSumbit} encType="multipart/form-data">
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                  onChange={handleChanges}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                  onChange={handleChanges}
                />
              </div>
            </div>

            {/* Row 2: Mobile & Address */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                  onChange={handleChanges}
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Enter Address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                  rows="2"
                  onChange={handleChanges}
                ></textarea>
              </div>
            </div>

            {/* Row 3: Email & Password */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                  onChange={handleChanges}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                  onChange={handleChanges}
                />
              </div>
            </div>

            {/* Row 4: Profile Picture */}
            <div className="mb-4">
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 font-medium mb-2"
              >
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 focus:outline-none"
                onChange={handleChanges}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition duration-300"
            >
              ADD
            </button>
          </form>
        </div>{" "}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default Adduser;
