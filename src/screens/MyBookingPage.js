import { useState, useEffect } from "react"
import Header from "../components/HeaderHome"
import Footer from "../components/FooterHome"

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    // Giả sử chỉ có 1 booking (nếu cần hỗ trợ nhiều booking, bạn có thể lưu danh sách trong localStorage)
    const stored = JSON.parse(localStorage.getItem("confirmedCampingBooking"))
    if (stored) {
      setBookings([stored])
    }
  }, [])

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy booking này không?")) {
      localStorage.removeItem("confirmedCampingBooking")
      setBookings([])
    }
  }

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking)
  }

  const closePopup = () => {
    setSelectedBooking(null)
  }

  return (
    <>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px", paddingTop: "120px", marginTop:"80px" }}>
    <Header />
    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Booking của bạn</h2>

      {bookings.length === 0 ? (
        <p style={{ textAlign: "center" }}>Bạn chưa có booking nào.</p>
      ) : (
        bookings.map((booking, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              background: "#f9f9f9",
            }}
          >
            <h3>{booking.tourTitle}</h3>
            <p>
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
            <p>Thời gian: {booking.time}</p>
            <p>
              Tổng:{" "}
              <strong style={{ color: "#38a169" }}>
                {booking.totalPrice.toLocaleString()} VND
              </strong>
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => handleViewDetail(booking)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4299e1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Xem chi tiết
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e53e3e",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Hủy booking
              </button>
            </div>
          </div>
        ))
      )}

      {/* Popup chi tiết booking */}
      {selectedBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>{selectedBooking.tourTitle}</h3>
            <p>
              {new Date(selectedBooking.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedBooking.endDate).toLocaleDateString()}
            </p>
            <p>Thời gian: {selectedBooking.time}</p>

            <h4>Lều đã chọn:</h4>
            {selectedBooking.selectedTents?.length > 0 ? (
              selectedBooking.selectedTents.map((tent) => (
                <p key={tent.id}>
                  {tent.name} - {tent.quantity} cái ({tent.subtotal.toLocaleString()} VND)
                </p>
              ))
            ) : (
              <p>Không thuê lều</p>
            )}

            <h4>Đồ dùng camping:</h4>
            {selectedBooking.selectedEquipment?.length > 0 ? (
              selectedBooking.selectedEquipment.map((item) => (
                <p key={item.id}>
                  {item.name} - {item.quantity} cái ({item.subtotal.toLocaleString()} VND)
                </p>
              ))
            ) : (
              <p>Không thuê thêm đồ</p>
            )}

            <h4>Thông tin liên hệ:</h4>
            <p>Họ tên: {selectedBooking.userInfo?.name}</p>
            <p>SĐT: {selectedBooking.userInfo?.phone}</p>
            <p>Email: {selectedBooking.userInfo?.email}</p>
            {selectedBooking.userInfo?.note && <p>Ghi chú: {selectedBooking.userInfo.note}</p>}

            <h4>Phương thức thanh toán:</h4>
            <p>{selectedBooking.paymentMethod}</p>

            <button
              onClick={closePopup}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer/>
</>
  )
}

export default MyBookingsPage
