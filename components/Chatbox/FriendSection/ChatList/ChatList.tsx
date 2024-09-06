import "./ChatList.scss";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";

interface ChatFriend {
  id: string;
  displayName: string;
  lastMessage: string;
  profile: string;
}

interface Chat {
  [key: string]: {
    date: Date;
    userInfo: {
      uid: string;
      displayName: string;
      photoURL: string;
    };
    lastMessage?: {
      text: string;
    };
  };
}

interface ChatListProps {
  onSelectFriend: (targetFriend: ChatFriend) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectFriend }) => {
  const { currentUser, getFriends } = UseUserStore();
  const [chatFriends, setChatFriends] = useState<ChatFriend[]>([]);

  // friend list
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

  // chat with a friend
  const [chats, setChats] = useState<Chat>({});

  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribe = onSnapshot(
      doc(db, "userchats", currentUser.id),
      (doc) => {
        const data = doc.data() as Chat | undefined;
        if (data) {
          setChats(data);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser?.id]);

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
      <div className="friend-item-wrapper">
        <div className="friend-item">
          {/* friend info and chatFriend */}
          {chatFriends.map((targetFriend) => (
            <div
              key={targetFriend.id}
              className="friend"
              onClick={() => onSelectFriend(targetFriend)}
            >
              {/* <FaUser className="friend-profile" /> */}
              <Image src={targetFriend.profile} alt="" width={46} height={46} />
              <div className="friend-name">
                <span>{targetFriend.displayName}</span>
                <p>Last message...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
