import React, { useEffect, useState } from "react";
import "./Postbox.css";
import { IoPersonAdd } from "react-icons/io5";
import { IoIosPaperPlane } from "react-icons/io";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";

interface User {
  id: string;
  username: string;
  profile: string;
}

interface FriendState {
  [key: string]: "notFriend" | "requested" | "friend";
}

const Postbox = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friendState, setFriendState] = useState<FriendState>({});
  const { currentUser, sendFriendRequest } = UseUserStore();

  useEffect(() => {
    const fetchUsersAndStates = async () => {
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

      // Fetch ownRequests
      const ownRequestsRef = collection(
        db,
        "users",
        currentUser.id,
        "ownRequests"
      );
      const ownRequestsSnapshot = await getDocs(ownRequestsRef);
      const ownRequests = ownRequestsSnapshot.docs.map((doc) => doc.id);
      // Fetch friends
      const friendsRef = collection(db, "users", currentUser.id, "friends");
      const friendsSnapshot = await getDocs(friendsRef);
      const friends = friendsSnapshot.docs.map((doc) => doc.id);

      //
      const states: FriendState = {};
      usersList.forEach((user) => {
        if (friends.includes(user.id)) {
          states[user.id] = "friend";
        } else if (ownRequests.includes(user.id)) {
          states[user.id] = "requested";
        } else {
          states[user.id] = "notFriend";
        }
      });

      setFriendState(states);
    };

    fetchUsersAndStates();
  }, [currentUser]);

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!currentUser?.id) return;

    try {
      await sendFriendRequest(currentUser.id, targetUserId);
      setFriendState((prev) => ({ ...prev, [targetUserId]: "requested" }));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

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
            {friendState[user.id] === "friend" ? (
              <></>
            ) : friendState[user.id] === "requested" ? (
              <div className="icon-wrapper icon-friend-wrapper">
                <IoIosPaperPlane className="add-icon" />
                <span>已邀請</span>
              </div>
            ) : (
              <div
                className="icon-wrapper"
                onClick={() => handleSendFriendRequest(user.id)}
              >
                <IoPersonAdd className="add-icon" />
                <span>加朋友</span>
              </div>
            )}
          </div>
          <div className="diary-item-header">
            <div className="diary-item-title">
              <h2> post.title</h2>
            </div>
          </div>
          <div className="postTextContainer"> post.postText latest </div>
        </div>
      ))}
    </div>
  );
};

export default Postbox;
