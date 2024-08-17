"use client";
import "./diary-share.scss";
import React, { useEffect } from "react";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import Postbox from "@/components/Postbox/Postbox";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config.js";
import { useUserStore } from "@/lib/userStorage";

const DiaryShare = () => {
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
    <div className="container page-background diary-share-page">
      <Chatbox />
      <Diarybox />
      <div className="diary-share-container">
        <Postbox />
      </div>
    </div>
  );
};

export default DiaryShare;
