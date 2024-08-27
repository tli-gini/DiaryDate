import "./FriendSection.css";
import React from "react";
import UserInfo from "./UserInfo/UserInfo";
import ChatList from "./ChatList/ChatList";

interface ChatFriend {
  id: string;
  displayName: string;
  lastMessage: string;
  profile: string;
}

interface FriendSectionProps {
  onSelectFriend: (targetFriend: ChatFriend) => void;
}

const FriendSection: React.FC<FriendSectionProps> = ({ onSelectFriend }) => {
  return (
    <div className="friend-list">
      <UserInfo />
      <ChatList onSelectFriend={onSelectFriend} />
    </div>
  );
};

export default FriendSection;
