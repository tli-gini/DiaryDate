import React from "react";
import "./CalendarItem.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";

interface CalendarItemProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}

const CalendarItem: React.FC<CalendarItemProps> = ({
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="calendar-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={selectedDate} onChange={onDateChange} />
      </LocalizationProvider>
    </div>
  );
};

export default CalendarItem;
