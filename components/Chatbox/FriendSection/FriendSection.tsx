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
  reload: number;
}

const FriendSection: React.FC<FriendSectionProps> = ({
  onSelectFriend,
  reload,
}) => {
  return (
    <div className="friend-list">
      <UserInfo />
      <ChatList onSelectFriend={onSelectFriend} reload={reload} />
    </div>
  );
};

export default FriendSection;
