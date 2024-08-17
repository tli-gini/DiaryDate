import "./ChatList.scss";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import { UseChatStore } from "@/lib/chatStorage";

interface Chat {
  id: string;
  displayName: string;
  lastMessage: string;
  profile: string;
}

const ChatList = () => {
  const { currentUser } = UseUserStore();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchChats = async () => {
      try {
        const chatsCollection = collection(
          db,
          "users",
          currentUser.id,
          "friends"
        );
        const chatsSnapshot = await getDocs(chatsCollection);
        const chatsList = chatsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Chat)
        );
        setChats(chatsList);
      } catch (error) {
        console.error("Error fetching chats: ", error);
      }
    };

    fetchChats();
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="chat-list">
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
        {/* friend info and chat */}
        {chats.map((chat) => (
          <div key={chat.id} className="friend">
            {/* <FaUser className="friend-profile" /> */}
            <img src={chat.profile} alt="img" />
            <div className="friend-name">
              <span>{chat.displayName}</span>
              <p>Last message...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
