import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Canteens from "./pages/Canteens";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import SubcategoryTypes from "./pages/SubcategoryTypes";
import MenuItems from "./pages/MenuItems";
import Orders from "./pages/Orders";
import Company from "./pages/Company";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="company" element={<Company />} />
            <Route path="canteens" element={<Canteens />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="subcategory-types" element={<SubcategoryTypes />} />
            <Route path="menu-items" element={<MenuItems />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
