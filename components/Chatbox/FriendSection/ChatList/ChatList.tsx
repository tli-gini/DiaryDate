import "./ChatList.scss";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import { UseChatStore } from "@/lib/chatStorage";

interface ChatFriend {
  id: string;
  displayName: string;
  lastMessage: string;
  profile: string;
}

const ChatList = () => {
  const { currentUser, getFriends } = UseUserStore();
  const [chatFriends, setChatFriends] = useState<ChatFriend[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchChatFriends = async () => {
      try {
        const friends = await getFriends(currentUser.id);
        setChatFriends(friends);
      } catch (error) {
        console.error("Error fetching chatFriends: ", error);
      }
    };

    fetchChatFriends();
  }, [currentUser, getFriends]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="chatFriend-list">
      <div className="search-section">
        <div className="search-bar">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="搜尋"
            className="search-bar-input"
          ></input>
        </div>
      </div>
      <div className="friend-item">
        {/* friend info and chatFriend */}
        {chatFriends.map((chatFriend) => (
          <div key={chatFriend.id} className="friend">
            {/* <FaUser className="friend-profile" /> */}
            <img src={chatFriend.profile} alt="img" />
            <div className="friend-name">
              <span>{chatFriend.displayName}</span>
              <p>Last message...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
