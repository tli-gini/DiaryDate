import React from "react";
import "./Calendar.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import Typography from "@mui/material/Typography";

const Calendar = () => {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <div className="calendar-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar views={["day"]} value={value} onChange={setValue} />
        <Typography>
          value: {value == null ? "null" : value.format("YYYY/MM/DD - ")}
        </Typography>
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
