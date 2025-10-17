import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/authService";
import UserProfileModal from "./UserProfileModal"; // ✅ bỏ {} vì export default
import ChangePasswordModal from "./ChangePasswordModal";
const HeaderHome = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const currentPath = location.pathname;
  const isActive = (path) => (currentPath === path ? "active" : "");
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // ✅ Gọi API để lấy profile khi header mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // chưa login
        const data = await getProfile(token); // gọi API
        setProfile(data.data); // API trả { data: {...profile} }
        localStorage.setItem("user", JSON.stringify(data.data));
      } catch (err) {
        console.error("Lỗi khi lấy profile:", err);
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <header className="main-header header-one white-menu menu-absolute">
        <div className="header-upper py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              {/* logo */}
              <div className="logo-outer">
                <div className="logo">
                  <Link to="/">
                    <img src="/assets/images/logos/logo3.png" alt="Logo" />
                  </Link>
                </div>
              </div>

              {/* menu */}
              <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                <nav className="main-menu navbar-expand-lg">
                  <div className="navbar-header">
                    <div className="mobile-logo">
                      <Link to="/">
                        <img
                          src="/assets/images/logos/logo3 copy 2.png"
                          alt="Logo"
                          style={{ width: "150px", height: "70px" }}
                        />
                      </Link>
                    </div>
                  </div>

                  <div className="navbar-collapse collapse clearfix">
                    <ul className="navigation clearfix">
                      <li className={isActive("/")}>
                        <Link to="/">Trang chủ</Link>
                      </li>
                      <li className={isActive("/about")}>
                        <Link to="/about">Giới thiệu</Link>
                      </li>
                      <li className={isActive("/tours")}>
                        <Link to="/tours">Điểm đến</Link>
                      </li>
                      <li className={isActive("/contact")}>
                        <Link to="/contact">Liên hệ</Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>

              {/* search + dropdown */}
              <div className="menu-btns py-10">
                <Link to="/tours" className="theme-btn style-two bgc-secondary">
                  <span data-hover="Đặt Ngay">Book Now</span>
                  <i className="fal fa-arrow-right"></i>
                </Link>
                <div className="menu-sidebar">
                  <li className="drop-down">
                    <button
                      className="dropdown-toggle bg-transparent"
                      onClick={toggleDropdown}
                      style={{ color: "white" }}
                    >
                      {profile?.avatar ? (
                        <img
                          className="img-account-profile rounded-circle"
                          src={profile.avatar}
                          style={{ width: 36, height: 36 }}
                          alt="avatar"
                        />
                      ) : (
                        <i
                          className="bx bxs-user bx-tada"
                          style={{ fontSize: 36, color: "white" }}
                        ></i>
                      )}
                    </button>

                    {showDropdown && (
                      <ul
                        className="dropdown-menu show"
                        id="dropdownMenu"
                        style={{ position: "absolute", top: "50px", right: 0 }}
                      >
                        {profile ? (
                          <>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowProfileModal(true);
                                  setShowDropdown(false);
                                }}
                              >
                                Thông tin cá nhân
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowChangePasswordModal(true);
                                  setShowDropdown(false);
                                }}
                              >
                                Đổi mật khẩu
                              </button>
                            </li>
                            <li>
                              <Link
                                to="/my-bookings"
                                onClick={() => setShowDropdown(false)}
                              >
                                Camping đã đặt
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  logout();
                                  localStorage.removeItem("token");
                                  localStorage.removeItem("user");
                                  setProfile(null);
                                  setShowDropdown(false);
                                }}
                              >
                                Đăng xuất
                              </button>
                            </li>
                          </>
                        ) : (
                          <li>
                            <Link
                              to="/login"
                              onClick={() => setShowDropdown(false)}
                            >
                              Đăng nhập
                            </Link>
                          </li>
                        )}
                      </ul>
                    )}

                    {profile && showWelcome && (
                      <div className="welcome-banner">
                        👋 Xin chào {profile.firstName} {profile.lastName}!
                      </div>
                    )}
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal user profile */}
      {showProfileModal && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userProfile={profile}
        />
      )}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
};

export default HeaderHome;
