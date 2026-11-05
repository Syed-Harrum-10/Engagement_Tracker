import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashbaord";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function Nav() {
 const token = localStorage.getItem("token");
 const navigate = useNavigate();

 const logout = () => {
   localStorage.removeItem("token");
   localStorage.removeItem("user");
   navigate("/login");
 };

 return (
   <header className="topbar">
     <Link className="brand" to="/" aria-label="Gather home">
       <span className="brand-mark" aria-hidden="true">g</span>
       Gather
     </Link>
     <nav className="nav-links" aria-label="Main navigation">
       <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/" end>
         Discover
       </NavLink>
     {token ? (
       <>
         <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/dashboard">
           Insights
         </NavLink>
         <button className="nav-action" onClick={logout}>Log out</button>
       </>
     ) : (
       <>
         <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/login">
           Log in
         </NavLink>
         <Link className="nav-action nav-cta" to="/register">Get started</Link>
       </>
     )}
     </nav>
   </header>
 );
}

function App() {
 return (
   <BrowserRouter>
     <div className="app-shell">
       <Nav />
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
       </Routes>
     </div>
   </BrowserRouter>
 );
}

export default App;