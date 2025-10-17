import React, { useState, useEffect } from "react";
import BannerHome from "../components/BannerHome";
import TourList from "../components/TourList";
import { Link } from "react-router-dom";
import axios from "axios";

const TourScreen = () => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        // const { data } = await axios.get("http://localhost:8080/api/v1/camping");
        // // Nếu muốn chỉ hiển thị active
        // const activeTours = data.filter((tour) => tour.active);
        // setTours(activeTours);  
        const response = await fetch("/data/campingData.json");
        const jsonData = await response.json();
        const activeTours = jsonData.filter((tour) => tour.active);
        setTours(activeTours);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu camping:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Pagination
  const indexOfLastTour = currentPage * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / itemsPerPage);

  return (
    <>
      <Link to="#" className="chatbot-fixed" title="Trợ lý ảo Campverse">
        <img src="/assets/images/login/chatbot.png" alt="Chatbot" />
      </Link>

      <BannerHome />

      <div className="tour-grid-wrap container">
        <div className="row" id="tours-container">
          {loading ? (
            <div className="col-12 text-center py-5">
              <h5>Đang tải danh sách camping...</h5>
            </div>
          ) : currentTours.length > 0 ? (
            <TourList
              tours={currentTours.map((tour) => ({
                id: tour.id,
                name: tour.name,
                thumbnail: tour.thumbnail || "/assets/images/default.jpg",
                rate: tour.rate || 0,
                cityName: tour.cityName || "",
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="col-12 text-center py-5">
              <h5>Không tìm thấy camping nào.</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TourScreen;
