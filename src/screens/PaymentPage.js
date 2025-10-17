import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/HeaderHome"

const PaymentPage = () => {
    const [bookingData, setBookingData] = useState(null)
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: "",
        email: "",
        note: "",
    })
    const [paymentMethod, setPaymentMethod] = useState("")
    const [isConfirming, setIsConfirming] = useState(false)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("campingBookingData"))
        if (!data) {
            navigate("/")
        } else {
            setBookingData(data)
        }
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleConfirmBooking = () => {
        if (!userInfo.name || !userInfo.phone || !userInfo.email || !paymentMethod) {
            alert("Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán!")
            return
        }

        setIsConfirming(true)

        setTimeout(() => {
            setSuccess(true)

            const fullBooking = {
                ...bookingData,
                userInfo,
                paymentMethod,
            }

            localStorage.setItem("confirmedCampingBooking", JSON.stringify(fullBooking))
            localStorage.removeItem("campingBookingData")

            setTimeout(() => {
                navigate("/my-bookings")
            }, 2000)
        }, 1500)

    }

    if (!bookingData) return null

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px", paddingTop: "120px", marginTop:"80px" }}>
            <Header />
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Xác nhận thanh toán</h2>

            <div style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "20px", background: "#f9f9f9" }}>
                <h3>{bookingData.tourTitle}</h3>
                <p>
                    Ngày: {new Date(bookingData.startDate).toLocaleDateString()} -{" "}
                    {new Date(bookingData.endDate).toLocaleDateString()}
                </p>
                <p>Thời gian: {bookingData.time}</p>

                <hr />

                <h4>Lều đã chọn:</h4>
                {bookingData.selectedTents.length > 0 ? (
                    bookingData.selectedTents.map((tent) => (
                        <p key={tent.id}>
                            {tent.name} - {tent.quantity} cái ({tent.subtotal.toLocaleString()} VND)
                        </p>
                    ))
                ) : (
                    <p>Không thuê lều</p>
                )}

                <h4>Đồ dùng camping:</h4>
                {bookingData.selectedEquipment.length > 0 ? (
                    bookingData.selectedEquipment.map((item) => (
                        <p key={item.id}>
                            {item.name} - {item.quantity} cái ({item.subtotal.toLocaleString()} VND)
                        </p>
                    ))
                ) : (
                    <p>Không thuê thêm đồ</p>
                )}

                <h3 style={{ marginTop: "20px", color: "#38a169" }}>
                    Tổng cộng: {bookingData.totalPrice.toLocaleString()} VND
                </h3>

                <hr />

                <h4>Thông tin liên hệ:</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Họ và tên"
                        value={userInfo.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={userInfo.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userInfo.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="note"
                        placeholder="Ghi chú (tuỳ chọn)"
                        rows={3}
                        value={userInfo.note}
                        onChange={handleChange}
                    />
                </div>

                <h4 style={{ marginTop: "20px" }}>Phương thức thanh toán:</h4>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />{" "}
                        Thanh toán khi đến nơi
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="BANK"
                            checked={paymentMethod === "BANK"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />{" "}
                        Chuyển khoản ngân hàng
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="WALLET"
                            checked={paymentMethod === "WALLET"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />{" "}
                        Ví điện tử (Momo, ZaloPay)
                    </label>
                </div>

                <button
                    onClick={handleConfirmBooking}
                    disabled={isConfirming}
                    style={{
                        marginTop: "20px",
                        padding: "12px 24px",
                        backgroundColor: "#38a169",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        cursor: "pointer",
                    }}
                >
                    {isConfirming ? "Đang xử lý..." : "Xác nhận đặt chỗ"}
                </button>

                {success && (
                    <div style={{ marginTop: "20px", textAlign: "center", color: "#2f855a", fontWeight: "bold" }}>
                        ✅ Đặt chỗ thành công! Đang chuyển hướng...
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentPage
