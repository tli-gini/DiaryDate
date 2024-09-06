import "./DiaryDisplayButton.css";
import React from "react";
import { IoIosList } from "react-icons/io";
import { IoIosCalendar } from "react-icons/io";

interface DiaryDisplayButtonProps {
  isListView: boolean;
  handleToggle: () => void;
}

export default function DiaryDisplayButton({
  isListView,
  handleToggle,
}: DiaryDisplayButtonProps) {
  return (
    <div className="toggle-diary-btn" onClick={handleToggle}>
      {isListView ? (
        <IoIosList className="list-icon" />
      ) : (
        <IoIosCalendar className="list-icon" />
      )}
    </div>
  );
}
