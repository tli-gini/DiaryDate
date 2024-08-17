"use client";
import "./my-diary.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import MyDiaryItem from "@/components/MyDiarybox/MyDiaryItem";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";

const MyDiary = () => {
  const { currentUser, isLoading, fetchUserInfo } = UseUserStore();
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
    <div className="container page-background my-diary-page">
      <Chatbox />
      <Diarybox />
      <div className="my-diary-container">
        <MyDiaryItem />
      </div>
    </div>
  );
};

export default MyDiary;
