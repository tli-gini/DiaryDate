"use client";
import React, { useEffect, useState } from "react";
import ChatDialog from "@/components/Chatbox/ChatDialog/ChatDialog";
import FriendSection from "@/components/Chatbox/FriendSection/FriendSection";
import FriendRequest from "@/components/Chatbox/FriendRequest/FriendRequest";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import "./chatroom.css";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";

interface ChatFriend {
  id: string;
  displayName: string;
  lastMessage: string;
  profile: string;
}

const Chatroom = () => {
  const { currentUser, isLoading, fetchUserInfo } = UseUserStore();
  const [selectedFriend, setSelectedFriend] = useState<ChatFriend | null>(null);
  const [reload, setReload] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userLogin) => {
      console.log("uid: ", userLogin?.uid);
      if (userLogin) {
        fetchUserInfo(userLogin.uid);
      } else {
        router.push("/user");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchUserInfo, router]);

  const handleSelectFriend = (targetFriend: ChatFriend) => {
    setSelectedFriend(targetFriend);
  };

  const handleReload = () => {
    setReload((prev) => prev + 1);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container page-background chatroom-page">
      <Chatbox />
      <Diarybox />
      <div className="chatroom-container ">
        <FriendSection onSelectFriend={handleSelectFriend} reload={reload} />
        <ChatDialog selectedFriend={selectedFriend} />
        <FriendRequest reload={handleReload} />
      </div>
    </div>
  );
};

export default Chatroom;
