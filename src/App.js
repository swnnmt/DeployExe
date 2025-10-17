import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HeaderHome from "./components/HeaderHome";
import FooterHome from "./components/FooterHome";
import HeaderHomePartner from "./components/partner/HeaderHomePartner";

import AboutPage from "./screens/about";
import Experience from "./screens/experience";
import Home from "./screens/home";
import Tours from "./screens/tour";
import Contact from "./screens/contact";
import Service from "./screens/service";

import Login from "./screens/login";
import UserProfileModal from "./components/UserProfileModal";
import TourDetailWrapper from "./screens/tourDetailWrapper";
import PaymentPage from "./screens/PaymentPage";
import MyBookingsPage from "./screens/MyBookingPage";
import OTPInputPage from "./screens/verifyOTP";
import ForgotPasswordPage from "./screens/forgotPassword";
import ChangePasswordModal from "./components/ChangePasswordModal";

import AdminDashboard from "./components/admin/AdminDashboard";
import ManagerUser from "./components/admin/ManagerUser";
import ManagerPartner from "./components/admin/ManagerPanter";

import HomePartnerPage from "./screens/partner/home_partner";
import ManagerCamping from "./screens/partner/ManagerCamping";
import CampingDetailScreen from "./screens/partner/ManagerCampingDetailScreen";
import CreateCamping from "./screens/partner/CreateCamping";

const PublicLayout = () => (
  <>
    <HeaderHome />
    <Outlet />
    <FooterHome />
  </>
);

const PartnerLayout = () => (
  <>
    <HeaderHomePartner />
    <Outlet />
    <FooterHome />
  </>
);

const AdminLayout = () => (
  <div className="admin-layout">
    <Outlet />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/camping-detail/:campingId" element={<TourDetailWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OTPInputPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<UserProfileModal />} />
          <Route path="/change-password" element={<ChangePasswordModal />} />

          {/* Partner routes */}
          <Route path="/seller" element={<PartnerLayout />}>
            <Route index element={<HomePartnerPage />} />
            <Route path="/seller/managercamping" element={<ManagerCamping />} />
            <Route path="/seller/createCamp" element={<CreateCamping />} />
            <Route path="/seller/camping/:id" element={<CampingDetailScreen />} />
            <Route path="/seller/createCamp/:campingId" element={<CreateCamping />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManagerUser />} />
            <Route path="partners" element={<ManagerPartner />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
