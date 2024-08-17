"use client";
import React, { useEffect } from "react";
import ChatDialog from "@/components/Chatbox/ChatDialog/ChatDialog";
import FriendSection from "@/components/Chatbox/FriendSection/FriendSection";
import FriendRequest from "@/components/Chatbox/FriendRequest/FriendRequest";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import "./chatroom.css";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config.js";
import { useUserStore } from "@/lib/userStorage";

const chatroom = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userLogin) => {
      console.log("uid: ", userLogin?.uid); // get uid
      fetchUserInfo(userLogin?.uid);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchUserInfo]);

  if (!isLoading && !currentUser) {
    router.push("/user");
  }

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container page-background chatroom-page">
      <Chatbox />
      <Diarybox />
      <div className="chatroom-container ">
        <FriendSection />
        <ChatDialog />
        <FriendRequest />
      </div>
    </div>
  );
};

export default chatroom;
