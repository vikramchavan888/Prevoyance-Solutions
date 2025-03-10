import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from './pages/Admin'
import UserDashboard from "./pages/Profile";
import Adduser from './pages/Adduser'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/adminPage" element={<Admin />}></Route>
        <Route path="/profile" element={<UserDashboard />}></Route>
        <Route path="/adduser" element={<Adduser />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
