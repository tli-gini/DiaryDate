import React from "react";
import CalendarItem from "./CalendarItem/CalendarItem";
import MyDiaryItem from "./MyDiaryItem/MyDiaryItem";
import "./MyDiaryCalendar.css";

const MyDiaryCalendar = () => {
  return (
    <div className="new-diary-container">
      <CalendarItem />
      <MyDiaryItem />
    </div>
  );
};

export default MyDiaryCalendar;
