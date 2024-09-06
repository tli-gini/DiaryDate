import React, { useEffect, useState } from "react";
import "./CalendarItem.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";

interface CalendarItemProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}

const CalendarItem: React.FC<CalendarItemProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const { currentUser } = UseUserStore();
  const [diaryDates, setDiaryDates] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchDiaryDates();
    }
  }, [currentUser]);

  const fetchDiaryDates = async () => {
    try {
      const postsCollectionRef = collection(db, "posts");
      const q = query(
        postsCollectionRef,
        where("author.id", "==", currentUser?.id)
      );
      const querySnapshot = await getDocs(q);
      const dates = querySnapshot.docs.map((doc) => doc.data().diaryDate);
      setDiaryDates(dates);
    } catch (error) {
      console.error("Error fetching diary dates: ", error);
    }
  };

  const CustomPickersDay = (props: PickersDayProps<Dayjs>) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const formattedDate = day.format("YYYY/MM/DD");
    const isSelected = diaryDates.includes(formattedDate);

    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        className={isSelected ? "diary-date" : ""}
      />
    );
  };

  return (
    <div className="calendar-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={onDateChange}
          slots={{
            day: CustomPickersDay,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CalendarItem;
