import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Landing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/auth/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.log(err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isAuthenticated) {
    return <Home />;
  }

 return (
   <div className="min-h-screen bg-gray-900">
     <div className="flex flex-col items-center justify-center h-screen ">
       {/* Image Section */}
       <img
         src="https://www.prevoyancesolutions.com/Content/img/prevoyance-logo-2.png"
         alt="Company Logo"
         className="mb-6 w-64 h-auto object-contain"
       />

       {/* Welcome Message */}
       <h1 className="text-4xl font-bold text-blue-500 mb-4">
         Welcome to Prevoyance Solutions
       </h1>

       {/* Buttons Section */}
       <div className="flex gap-4">
         <button
           className="px-6 py-3 bg-blue-400 text-white text-lg font-semibold rounded-lg shadow hover:bg-indigo-600 transition"
           onClick={() => navigate("/register")}
         >
           Sign Up
         </button>
         <button
           className="px-6 py-3 bg-blue-400 text-white text-lg font-semibold rounded-lg shadow hover:bg-indigo-600 transition"
           onClick={() => navigate("/login")}
         >
           Sign In
         </button>
       </div>
     </div>
   </div>
 );
};

const Home = () => {
  return <div className="text-3xl text-blue-500">Home</div>;
};

export default Landing;
