"use client";

import { useState, useEffect } from "react";
import Header from "../components/HeaderCamping";
import TourPreparationItems from "../components/Preparation";
import TentBookingSection from "./TentBookingSection";
import Footer from "../components/FooterHome";
import "./TourDetailPage.css";

const TourDetailPage = ({ campingId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [tentAvailability, setTentAvailability] = useState([]);
  const [tourDetail, setTourDetail] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [totalDays, setTotalDays] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Lấy dữ liệu từ file JSON trong public
    fetch("/data/campingData.json")
      .then((res) => res.json())
      .then((data) => {
        const selectedTour = data.find((c) => c.id === campingId);
        if (selectedTour) {
          setTourDetail(selectedTour);
          setGalleryImages(selectedTour.galleries ?? []);
          setTentAvailability(selectedTour.tents ?? []);
        }
      })
      .catch((err) => console.error("Error loading camping data:", err));
  }, [campingId]);

  // Tính tổng số ngày
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
    }
  }, [selectedStartDate, selectedEndDate]);

  const handleOpenPopup = () => {
    if (!selectedStartDate || !selectedEndDate) return alert("Vui lòng chọn ngày!");
    if (new Date(selectedStartDate) >= new Date(selectedEndDate))
      return alert("Ngày kết thúc phải sau ngày bắt đầu!");
    setShowPopup(true);
    document.body.style.overflow = "hidden";
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && showPopup) handleClosePopup();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [showPopup]);

  const preparationItems = [
    { icon: "/assets/images/icon-para/sacduphong.jpg", label: "Sạc dự phòng" },
    { icon: "/assets/images/icon-para/khantam.jpg", label: "Khăn tắm đa năng" },
    { icon: "/assets/images/icon-para/kinh.jpg", label: "Kính dâm" },
    { icon: "/assets/images/icon-para/mayanh.jpg", label: "Máy ảnh" },
    { icon: "/assets/images/icon-para/giay.jpg", label: "Giày leo núi" },
    { icon: "/assets/images/icon-para/binhnuoc.jpg", label: "Bình nước" },
    { icon: "/assets/images/icon-para/thuoc.jpg", label: "Thuốc chống côn trùng" },
  ];

  if (!tourDetail) return <p>Loading...</p>;

  return (
    <>
      <Header tourDetail={tourDetail} />

      <section className="container mb-5">
        <div className="row">
          <div className="col-lg-8">
            <h3>{tourDetail.name}</h3>
            <p className="text-muted">{tourDetail.address}</p>

            <div className="tour-description mb-4">
              {(tourDetail.description ?? "").split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            {galleryImages.length > 0 && (
              <div className="gallery">
                {galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.imageUrl}
                    alt={`Gallery ${idx}`}
                    className="gallery-image"
                  />
                ))}
              </div>
            )}

            <section id="prepare" className="mb-5">
              <TourPreparationItems items={preparationItems} />
            </section>
          </div>

          <div className="col-lg-4">
            <div className="bg-light p-4 rounded shadow-sm mb-4">
              <h4 className="mb-3">Đặt Camping</h4>

              <div className="mb-3">
                <label className="form-label fw-bold">Ngày bắt đầu:</label>
                <input
                  type="date"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                  min={today}
                  className="form-control date-input"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Ngày kết thúc:</label>
                <input
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                  min={selectedStartDate || today}
                  className="form-control date-input"
                />
              </div>

              <hr />
              <h6>Lều có sẵn:</h6>
              {tentAvailability.length > 0
                ? tentAvailability.map((tent) => {
                    let badgeClass = "unavailable",
                      badgeText = "Hết";
                    if (tent.quantity > 3) {
                      badgeClass = "available";
                      badgeText = "Còn";
                    } else if (tent.quantity > 0) {
                      badgeClass = "limited";
                      badgeText = `Còn ${tent.quantity}`;
                    }
                    return (
                      <div
                        className="d-flex justify-content-between align-items-center mb-2"
                        key={tent.id}
                      >
                        <div>
                          <small className="text-muted">{tent.tentName}</small>
                          <br />
                          <small className="fw-bold">
                            {tent.pricePerNight?.toLocaleString() ?? 0} VND/đêm
                          </small>
                        </div>
                        <span className={`availability-badge ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </div>
                    );
                  })
                : <p>Chưa có thông tin lều.</p>}

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleOpenPopup}
                disabled={totalDays <= 0}
              >
                {totalDays <= 0 ? "Ngày không hợp lệ" : "Đặt ngay"}
              </button>
            </div>
          </div>
        </div>
      </section>

           {showPopup && (
      <div className="booking-popup-overlay" onClick={handleClosePopup}>
        <div className="booking-popup-content" onClick={e => e.stopPropagation()}>
          <div className="booking-popup-header">
          <h4>Đặt Camping & Thuê Lều</h4>
        <button className="booking-popup-close" onClick={handleClosePopup}>X</button>
      </div>
      <div className="booking-popup-body">
        <TentBookingSection
          campingId={campingId}
          tourDetail={{
            ...tourDetail,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            time: `${totalDays} ngày ${Math.max(totalDays - 1, 0)} đêm`,
          }}
        />
      </div>
    </div>
  </div>
)}
      <Footer />
    </>
  );
};

export default TourDetailPage;
