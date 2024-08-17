"use client";
import React, { useEffect, useState } from "react";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import CreateDiary from "@/components/NewDiarybox/CreateDiary/CreateDiary";
import Calendar from "@/components/NewDiarybox/Calendar/Calendar";
import "./new-diary.css";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config.js";
import { addDoc, collection } from "firebase/firestore";
import { UseUserStore } from "@/lib/userStorage";

const NewDiary = () => {
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
    <div className="container page-background new-diary-page">
      <Chatbox />
      <Diarybox />
      <div className="new-diary-container">
        <Calendar />
        <CreateDiary />
      </div>
    </div>
  );
};

export default NewDiary;
