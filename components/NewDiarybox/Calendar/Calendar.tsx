import React from "react";
import "./Calendar.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import Typography from "@mui/material/Typography";

interface CalendarProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
  return (
    <div className="calendar-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar views={["day"]} value={value} onChange={onChange} />
        <Typography className="calendar-date">
          <div className="date-value">
            {value
              ? `把日記存放在：${value.format("YYYY/MM/DD")}`
              : "選擇一個日期吧！ *"}
          </div>
        </Typography>
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
