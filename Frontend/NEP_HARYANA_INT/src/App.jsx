import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CollegeDashboard from "./pages/CollegeDashboard/CollegeDashboard";

// New Admin Panel imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview";
import CollegeManagement from "./pages/Admin/CollegeManagement";
import CollegeDetail from "./pages/Admin/CollegeDetail";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

import {
  ProtectedRoute,
  GuestRoute,
} from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/institution/") ||
    location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Guest Routes */}
        <Route
          path="/auth/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <GuestRoute>
              <Signin />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/reset-password/:uid/:token"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        {/* Protected Routes - College Dashboard */}
        <Route
          path="/institution/:institutionName/:institutionAisheCode/dashboard"
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <CollegeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - DHE Admin Console */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/colleges" element={<CollegeManagement />} />
          <Route path="/admin/colleges/:id" element={<CollegeDetail />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* Redirects */}
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin" replace />}
        />
        <Route
          path="/admin/dashbpard"
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
      {!isDashboard && <Footer />}
    </AuthProvider>
  );
}

export default App;
