import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import CollegeDashboard from "./pages/CollegeDashboard/CollegeDashboard";
import NominationForm from "./pages/CollegeDashboard/NominationForm/NominationForm";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const location = useLocation();
  const isDashboard =
    location.pathname === "/dashboard" ||
    location.pathname === "/college/dashboard" ||
    location.pathname === "/admin/dashboard" ||
    location.pathname.startsWith("/college/forms/");

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Guest Routes */}
        <Route path="/auth/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/auth/login" element={<GuestRoute><Signin /></GuestRoute>} />
        <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/auth/reset-password/:uid/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["committee"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/college/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <CollegeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/college/forms/nomination/:formId"
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <NominationForm />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

export default App;
