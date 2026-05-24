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
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/college/dashboard" element={<CollegeDashboard />} />
        <Route
          path="/college/forms/nomination/:formId"
          element={<NominationForm />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

export default App;
