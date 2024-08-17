import Link from "next/link";
import "./DiaryButton.css";
import React from "react";
import { IoIosCreate } from "react-icons/io";

export default function DiaryButton() {
  return (
    <Link href="/my-diary/new-diary" className="new-diary-link">
      <div className="diary-btn">
        <IoIosCreate className="create-icon" />
      </div>
    </Link>
  );
}
