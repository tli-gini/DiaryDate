import React, { useState } from "react";
import CalendarItem from "./CalendarItem/CalendarItem";
import MyDiaryItem from "./MyDiaryItem/MyDiaryItem";
import "./MyDiaryCalendar.css";
import { Dayjs } from "dayjs";

const MyDiaryCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  return (
    <div className="new-diary-container">
      <CalendarItem
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <MyDiaryItem selectedDate={selectedDate} />
    </div>
  );
};

export default MyDiaryCalendar;
