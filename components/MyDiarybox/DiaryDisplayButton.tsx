import "./DiaryDisplayButton.css";
import React, { useState } from "react";
import { IoIosList } from "react-icons/io";
import { IoIosCalendar } from "react-icons/io";

export default function DiaryDisplayButton() {
  const [list, setList] = useState(true);
  const handleToggle = () => {
    setList((prevList) => !prevList);
  };

  return (
    <div className="toggle-diary-btn" onClick={handleToggle}>
      {list ? (
        <IoIosList className="list-icon" />
      ) : (
        <IoIosCalendar className="list-icon" />
      )}
    </div>
  );
}
