import "./FriendSection.css";
import React from "react";
import UserInfo from "./UserInfo/UserInfo";
import ChatList from "./ChatList/ChatList";

const FriendSection = () => {
  return (
    <div className="friend-list">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default FriendSection;
