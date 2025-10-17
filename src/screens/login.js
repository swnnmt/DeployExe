import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "../components/HeaderLogin";
import FooterLogin from "../components/FooterHome";
import { login } from "../api/authService";
import { register } from "../api/userSevices";
import "material-design-iconic-font/dist/css/material-design-iconic-font.min.css";

const AuthPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // mặc định USER
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [nameCamping, setNameCamping] = useState("");
  const [addressCamping, setAddressCamping] = useState("");
  const [addressPartner, setAddressPartner] = useState("");
  const [descriptionCamping, setDescriptionCamping] = useState("");
  const [campingImage, setCampingImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setCampingImage([]);
    setImagePreview([]);
    if (tab === "login") {
      setRole("USER");
    } else if (tab === "register") {
      setRole("USER");
    } else if (tab === "partner") {
      setRole("PARTNER");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      console.log("Login success:", res);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Lấy tất cả các file đã chọn
    const newImages = [];
    const newImagePreviews = [];
    let hasError = false;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, v.v.)!");
        hasError = true;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError(`Kích thước ảnh "${file.name}" không được vượt quá 5MB!`);
        hasError = true;
        return;
      }

      newImages.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === newImages.length) {
          // Khi tất cả ảnh đã được đọc
          setCampingImage((prevImages) => [...prevImages, ...newImages]);
          setImagePreview((prevPreviews) => [
            ...prevPreviews,
            ...newImagePreviews,
          ]);
          setError("");
        }
      };
      reader.readAsDataURL(file);
    });

    if (hasError) {
      // Nếu có lỗi, có thể bạn muốn xóa các ảnh đã chọn không hợp lệ
      // hoặc giữ lại các ảnh hợp lệ và chỉ báo lỗi cho những ảnh không hợp lệ.
      // Ở đây, tôi sẽ đơn giản là reset nếu có lỗi để tránh logic phức tạp.
      setCampingImage([]);
      setImagePreview([]);
    }
  };

  const removeImage = (indexToRemove) => {
    setCampingImage((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setImagePreview((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    if (role === "PARTNER" && !campingImage) {
      setError("Vui lòng tải lên ảnh khu camping!");
      return;
    }

    setLoading(true);

    try {
      const res = await register(
        firstName,
        lastName,
        phoneNumber,
        address,
        department,
        email,
        gender,
        password,
        role
      );

      if (res) {
        console.log("Register success:", res);
        console.log("Camping image:", campingImage);
        localStorage.setItem("registeredEmail", email);
        navigate("/verify-otp");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderLogin />
      <div
        className="login-template"
        style={{
          paddingTop: "100px",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        <div className="main">
          {activeTab === "login" ? (
            <section className="sign-in show">
              <div className="container">
                <div className="signin-content row align-items-center">
                  <div className="signin-image col-md-6 text-center">
                    <figure>
                      <img
                        src="/assets/images/login/signin-image.jpg"
                        alt="sign in"
                        className="img-fluid"
                      />
                    </figure>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => switchTab("register")}
                    >
                      Tạo tài khoản
                    </button>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => switchTab("partner")}
                    >
                      Đăng ký làm đối tác
                    </button>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => navigate("/forgotPassword")}
                    >
                      Quên mật khẩu
                    </button>
                  </div>

                  <div className="signin-form col-md-6">
                    <h2 className="form-title">Đăng nhập</h2>
                    <form onSubmit={handleLogin} className="login-form mt-4">
                      <div className="form-group mb-3">
                        <label htmlFor="username_login" className="form-label">
                          <i className="zmdi zmdi-account material-icons-name me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="username_login"
                          id="username_login"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="form-control"
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="password_login" className="form-label">
                          <i className="zmdi zmdi-lock me-2"></i>
                        </label>
                        <input
                          type="password"
                          name="password_login"
                          id="password_login"
                          placeholder="Mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="form-control"
                        />
                      </div>

                      {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {error}
                        </p>
                      )}

                      <div className="form-group form-button">
                        <input
                          type="submit"
                          className="btn btn-primary w-100"
                          value={loading ? "Đang đăng nhập..." : "Đăng nhập"}
                          disabled={loading}
                        />
                      </div>
                    </form>

                    <div className="social-login mt-4 text-center">
                      <span className="social-label">Hoặc đăng nhập bằng</span>
                      <ul className="socials list-inline mt-2">
                        <li className="list-inline-item me-3">
                          <a href="#">
                            <i className="zmdi zmdi-facebook zmdi-hc-2x"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a href="/auth/google">
                            <i className="zmdi zmdi-google zmdi-hc-2x"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : activeTab === "register" ? (
            <section className="signup">
              <div className="container">
                <div className="signup-content row align-items-center">
                  <div className="signup-form col-md-6">
                    <h2 className="form-title">Đăng ký người dùng</h2>
                    <form
                      onSubmit={handleRegister}
                      className="register-form mt-4"
                    >
                      <div className="form-group mb-3">
                        <label htmlFor="firstName" className="form-label">
                          <i className="zmdi zmdi-account me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="First Name"
                          required
                          className="form-control"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="lastName" className="form-label">
                          <i className="zmdi zmdi-account-circle me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Last Name"
                          required
                          className="form-control"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="phoneNumber" className="form-label">
                          <i className="zmdi zmdi-phone me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="Phone Number"
                          required
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="address" className="form-label">
                          <i className="zmdi zmdi-pin me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          placeholder="Address"
                          required
                          className="form-control"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="department" className="form-label">
                          <i className="zmdi zmdi-city me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          placeholder="Department"
                          required
                          className="form-control"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">
                          <i className="zmdi zmdi-email me-2"></i>
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Email"
                          required
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="gender" className="form-label">
                          <i className="zmdi zmdi-male-female me-2"></i>
                        </label>
                        <select
                          name="gender"
                          id="gender"
                          className="form-select"
                          required
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">-- Select Gender --</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">
                          <i className="zmdi zmdi-lock me-2"></i>
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Password"
                          required
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          <i className="zmdi zmdi-lock-outline me-2"></i>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="Confirm Password"
                          required
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {error}
                        </p>
                      )}

                      <div className="form-group form-button">
                        <input
                          type="submit"
                          className="btn btn-success w-100"
                          value={loading ? "Đang đăng ký..." : "Đăng ký"}
                          disabled={loading}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="signup-image col-md-6 text-center">
                    <figure>
                      <img
                        src="/assets/images/login/signup-image.jpg"
                        alt="sign up"
                        className="img-fluid"
                      />
                    </figure>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => switchTab("login")}
                    >
                      Tôi đã có tài khoản rồi
                    </button>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => switchTab("partner")}
                    >
                      Đăng ký làm đối tác
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="signup">
              <div className="container">
                <div className="signup-content row align-items-center">
                  <div className="signup-form col-md-6">
                    <h2 className="form-title">Đăng ký làm đối tác</h2>
                    <form
                      onSubmit={handleRegister}
                      className="register-form mt-4"
                    >
                      <div className="form-group mb-3">
                        <label
                          htmlFor="firstName_partner"
                          className="form-label"
                        >
                          <i className="zmdi zmdi-account me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="firstName_partner"
                          id="firstName_partner"
                          placeholder="Họ"
                          required
                          className="form-control"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label
                          htmlFor="lastName_partner"
                          className="form-label"
                        >
                          <i className="zmdi zmdi-account-circle me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="lastName_partner"
                          id="lastName_partner"
                          placeholder="Tên"
                          required
                          className="form-control"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label
                          htmlFor="phoneNumber_partner"
                          className="form-label"
                        >
                          <i className="zmdi zmdi-phone me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="phoneNumber_partner"
                          id="phoneNumber_partner"
                          placeholder="Số điện thoại"
                          required
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="address_partner" className="form-label">
                          <i className="zmdi zmdi-pin me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="address_partner"
                          id="address_partner"
                          placeholder="Địa chỉ đối tác"
                          required
                          className="form-control"
                          value={addressPartner}
                          onChange={(e) => setAddressPartner(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="address_camping" className="form-label">
                          <i className="zmdi zmdi-pin me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="address_camping"
                          id="address_camping"
                          placeholder="Địa chỉ khu camping"
                          required
                          className="form-control"
                          value={addressCamping}
                          onChange={(e) => setAddressCamping(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="name_camping" className="form-label">
                          <i className="zmdi zmdi-city me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="name_camping"
                          id="name_camping"
                          placeholder="Tên khu camping"
                          required
                          className="form-control"
                          value={nameCamping}
                          onChange={(e) => setNameCamping(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label
                          htmlFor="description_camping"
                          className="form-label"
                        >
                          <i className="zmdi zmdi-city me-2"></i>
                        </label>
                        <input
                          type="text"
                          name="description_camping"
                          id="description_camping"
                          placeholder="Mô tả khu camping"
                          required
                          className="form-control"
                          value={descriptionCamping}
                          onChange={(e) =>
                            setDescriptionCamping(e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="email_partner" className="form-label">
                          <i className="zmdi zmdi-email me-2"></i>
                        </label>
                        <input
                          type="email"
                          name="email_partner"
                          id="email_partner"
                          placeholder="Email"
                          required
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {/* TRƯỜNG UPLOAD ẢNH - GIAO DIỆN ĐẸP MẮT HƠN */}         
                                 {" "}
                      <div className="form-group mb-3">
                        <label
                          htmlFor="campingImages"
                          className="form-label d-block text-start"
                        >
                          <i className="zmdi zmdi-image me-2"></i>
                          **Ảnh khu camping*** (tối đa 5MB/ảnh)
                          {/* Thêm cảnh báo nếu chưa chọn ảnh và là PARTNER */}
                          {role === "PARTNER" && campingImage.length === 0 && (
                            <span style={{ color: "red", marginLeft: "10px" }}>
                              (Bắt buộc)
                            </span>
                          )}
                        </label>
                        <div className="input-group">
                          <input
                            type="file"
                            name="campingImages"
                            id="campingImages"
                            accept="image/*"
                            multiple
                            // Không dùng required trên input file khi dùng nút custom,
                            // việc kiểm tra được xử lý trong handleRegister
                            className="form-control d-none"
                            onChange={handleImageChange}
                          />
                          <label
                            htmlFor="campingImages"
                            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                            style={{ cursor: "pointer" }}
                            disabled={loading}
                          >
                            <i className="zmdi zmdi-upload me-2"></i>
                            {loading
                              ? "Đang tải ảnh..."
                              : campingImage.length > 0
                              ? `${campingImage.length} ảnh đã được chọn`
                              : "Chọn ảnh khu camping"}
                          </label>
                        </div>

                        {imagePreview.length > 0 && ( // Duyệt qua mảng imagePreviews
                          <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">
                            {imagePreview.map((preview, index) => (
                              <div key={index} className="position-relative">
                                <img
                                  src={preview}
                                  alt={`Preview camping ${index + 1}`}
                                  style={{
                                    maxWidth: "150px", // Kích thước nhỏ hơn cho nhiều ảnh
                                    maxHeight: "100px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle rounded-circle p-0"
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    lineHeight: "1",
                                    fontSize: "0.75rem",
                                  }}
                                  onClick={() => removeImage(index)}
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {error}
                        </p>
                      )}
                      <div className="form-group form-button">
                        <input
                          type="submit"
                          className="btn btn-warning w-100"
                          value={
                            loading ? "Đang đăng ký..." : "Đăng ký Partner"
                          }
                          disabled={loading}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="signup-image col-md-6 text-center">
                    <figure>
                      <img
                        src="/assets/images/login/signup-image.jpg"
                        alt="sign up"
                        className="img-fluid"
                      />
                    </figure>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => switchTab("login")}
                    >
                      Tôi đã có tài khoản rồi
                    </button>
                    <button
                      className="signup-image-link btn btn-link"
                      onClick={() => switchTab("register")}
                    >
                      Đăng ký người dùng
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <FooterLogin />
    </>
  );
};

export default AuthPage;
