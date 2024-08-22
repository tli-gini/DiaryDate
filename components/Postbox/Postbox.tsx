import React, { useEffect, useState } from "react";
import "./Postbox.css";
import { IoPersonAdd } from "react-icons/io5";
import { IoIosPaperPlane } from "react-icons/io";
import { IoIosPeople } from "react-icons/io";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import { toast } from "react-toastify";
import Image from "next/image";

interface User {
  id: string;
  username: string;
  profile: string;
}

const Postbox = () => {
  const [addFriend, setAddFriend] = useState();
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser, sendFriendRequest } = UseUserStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username || "Unknown",
            profile: data.profile || "",
          };
        })
        .filter((user) => user.id !== currentUser?.id);

      setUsers(usersList as User[]);
    };

    fetchUsers();
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="diary-item-container">
      {users.map((user) => (
        <div key={user.id} className="diary-item">
          <div className="user-info-wrapper">
            <div className="user-info">
              <Image
                src={user.profile}
                alt=""
                className="user-profile"
                width={60}
                height={60}
              />
              <div className="user-name">{user.username}</div>
            </div>

            {addFriend ? (
              <div
                className="icon-wrapper icon-friend-wrapper"
                // onClick={() => setAddFriend((prev) => !prev)}
              >
                <IoIosPaperPlane className="add-icon" />
                <span>已邀請</span>
              </div>
            ) : (
              <div
                className="icon-wrapper"
                onClick={() => sendFriendRequest(currentUser.id, user.id)}
              >
                <IoPersonAdd className="add-icon" />
                <span>加朋友</span>
              </div>
            )}
            {/* <div className="icon-wrapper icon-friend-wrapper">
            <IoIosPeople className="friend-icon" />
            <span>好友</span>
          </div> */}
          </div>
          <div className="diary-item-header">
            <div className="diary-item-title">
              <h2> post.title</h2>
            </div>
            {/* <div className="deletePost">
            <button>Delete</button>
          </div> */}
          </div>
          <div className="postTextContainer"> post.postText </div>
        </div>
      ))}
    </div>
  );
};

export default Postbox;
