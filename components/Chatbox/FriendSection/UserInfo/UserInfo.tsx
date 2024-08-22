import "./UserInfo.scss";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";

const UserInfo = () => {
  const { currentUser } = UseUserStore();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="user-info-container">
      <div className="user-info">
        <Image
          src={currentUser.profile}
          alt="User Profile"
          className="user-profile"
          width={60}
          height={60}
        />
        <div className="user-name">{currentUser.username}</div>
      </div>
      <IoIosMore className="more-icon" />
    </div>
  );
};

export default UserInfo;
