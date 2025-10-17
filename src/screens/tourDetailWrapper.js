import React from "react";
import { useParams } from "react-router-dom";
import TourDetailPage from "./tourDetail";

const TourDetailWrapper = () => {
  const { campingId } = useParams(); // phải đúng với Route path

  if (!campingId) return <div className="container py-5">Không tìm thấy tour</div>;

  return (
    <TourDetailPage campingId={campingId} />
  );
};

export default TourDetailWrapper;
