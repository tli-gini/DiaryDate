"use client";
import "./my-diary.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import MyDiarybox from "@/components/MyDiarybox/DiaryDisplayButton";
import MyDiaryList from "@/components/MyDiarybox/MyDiaryList/MyDiaryList";
import MyDiaryCalendar from "@/components/MyDiarybox/MyDiaryCalendar/MyDiaryCalendar";
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
    return <div className="loading">Loading...</div>;
  }

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container page-background my-diary-page">
      <Chatbox />
      <Diarybox />
      <MyDiarybox />
      <div className="my-diary-container">
        <MyDiaryList />
        <MyDiaryCalendar />
      </div>
    </div>
  );
};

export default MyDiary;
