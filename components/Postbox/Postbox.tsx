import React, { useEffect, useState } from "react";
import "./Postbox.css";
import { IoPersonAdd } from "react-icons/io5";
import { IoIosPaperPlane } from "react-icons/io";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface User {
  id: string;
  username: string;
  profile: string;
}

interface FriendState {
  [key: string]: "notFriend" | "requested" | "friend";
}

interface Post {
  id: string;
  title: string;
  diaryText: string;
  diaryDate: string;
  createdAt: {
    toDate: () => Date;
  };
  author: {
    id: string;
    name: string;
  };
}

const Postbox = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friendState, setFriendState] = useState<FriendState>({});
  const { currentUser, sendFriendRequest } = UseUserStore();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUsersStateAndPosts = async () => {
      if (!currentUser?.id) return;

      // Fetch users
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

      // Fetch friend states
      const ownRequestsRef = collection(
        db,
        "users",
        currentUser.id,
        "ownRequests"
      );
      const ownRequestsSnapshot = await getDocs(ownRequestsRef);
      const ownRequests = ownRequestsSnapshot.docs.map((doc) => doc.id);

      const friendsRef = collection(db, "users", currentUser.id, "friends");
      const friendsSnapshot = await getDocs(friendsRef);
      const friends = friendsSnapshot.docs.map((doc) => doc.id);

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

      // Fetch latest posts
      const postsCollection = collection(db, "posts");
      const postsPromises = usersList.map(async (user) => {
        const q = query(
          postsCollection,
          where("author.id", "==", user.id),
          orderBy("createdAt", "desc"),
          limit(1) // latest post
        );
        const postSnapshot = await getDocs(q);
        if (!postSnapshot.empty) {
          const postDoc = postSnapshot.docs[0];
          return { id: postDoc.id, ...postDoc.data() } as Post;
        }
        return null;
      });

      const posts = (await Promise.all(postsPromises)).filter(
        (post): post is Post => post !== null
      );
      setLatestPosts(posts);
    };

    fetchUsersStateAndPosts();
  }, [currentUser]);

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!currentUser?.id) return;

    // 先切換成已邀請 for UI
    setFriendState((prev) => ({ ...prev, [targetUserId]: "requested" }));
    try {
      await sendFriendRequest(currentUser.id, targetUserId);
    } catch (error) {
      console.error("Error sending friend request:", error);
      setFriendState((prev) => ({ ...prev, [targetUserId]: "notFriend" }));
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="diary-item-container">
      {latestPosts.map((post) => {
        const user = users.find((u) => u.id === post.author.id);
        if (!user) return null;

        return (
          <div key={post.id} className="post-item">
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

            <div className="post-item-title">
              <div className="post-item-title-text">
                {post.diaryDate} - {post.title}
              </div>
            </div>

            <div className="post-item-content">
              <ReactMarkdown>{post.diaryText}</ReactMarkdown>
            </div>

            <div className="post-item-bottom">
              <div className="realtime-div">
                發布時間：
                {post.createdAt.toDate().toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Postbox;
