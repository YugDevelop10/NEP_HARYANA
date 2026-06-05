import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NavbarV2 from "./components/NavbarV2/NavbarV2";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import AboutUs from "./pages/AboutUs/AboutUs";
import Institutions from "./pages/Institutions/Institutions";
import Notifications from "./pages/Notifications/Notifications";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CollegeDashboard from "./pages/CollegeDashboard/CollegeDashboard";

// New Admin Panel imports
import AdminLayout from "./components/Admin/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview";
import CollegeManagement from "./pages/Admin/CollegeManagement";
import CollegeDetail from "./pages/Admin/CollegeDetail";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";
import Scoring from "./pages/Admin/Scoring";

import {
  ProtectedRoute,
  GuestRoute,
} from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext.jsx";

// Screening Committee Dashboard imports
import CommitteeLayout from "./components/Committee/CommitteeLayout";
import CommitteeOverview from "./pages/Committee/CommitteeOverview";
import CommitteeSubmissions from "./pages/Committee/CommitteeSubmissions";
import CommitteeReviewDetail from "./pages/Committee/CommitteeReviewDetail";

function App() {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/institution/") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/committee");

  return (
    <AuthProvider>
      {!isDashboard && <NavbarV2 />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/notifications" element={<Notifications />} />

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
        <Route
          path="/institution/:institutionName/:institutionAisheCode/dashboard/forms/:formId"
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
          <Route path="/admin/reviews" element={<CollegeManagement onlySubmitted={true} />} />
          <Route path="/admin/colleges" element={<CollegeManagement />} />
          <Route path="/admin/colleges/:id" element={<CollegeDetail />} />
          <Route path="/admin/scoring" element={<Scoring />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* Protected Routes - Screening Committee Console */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["committee"]}>
              <CommitteeLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/committee" element={<CommitteeOverview />} />
          <Route path="/committee/submissions" element={<CommitteeSubmissions />} />
          <Route path="/committee/submissions/:id" element={<CommitteeReviewDetail />} />
          <Route path="/committee/history" element={<CommitteeSubmissions onlyHistory={true} />} />
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
