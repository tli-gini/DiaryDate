import "./UserInfo.scss";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { useUserStore } from "@/lib/userStorage";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="user-info-container">
      <div className="user-info">
        <img src={currentUser.profile} alt="img" className="user-profile" />
        <div className="user-name">{currentUser.username}</div>
      </div>
      <IoIosMore className="more-icon" />
    </div>
  );
};

export default UserInfo;
