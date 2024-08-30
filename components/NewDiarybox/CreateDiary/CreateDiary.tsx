import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./CreateDiary.css";
import { db } from "@/firebase/config.js";
import { addDoc, collection } from "firebase/firestore";
import { UseUserStore } from "@/lib/userStorage";

const CreateDiary = () => {
  const { currentUser } = UseUserStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [diaryText, setDiaryText] = useState("");

  const postsCollectionRef = collection(db, "posts");

  const postDiary = async () => {
    await addDoc(postsCollectionRef, {
      title,
      diaryText,
      author: { name: currentUser.username, id: currentUser.uid },
    });
    router.push("/my-diary");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="diary-container">
      <div className="input-wrapper">
        <label>標題：</label>
        <input
          className="title-input"
          placeholder=" ..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <div className="input-wrapper">
        <label>內文：</label>
        <textarea
          className="text-input"
          placeholder=" ..."
          onChange={(event) => {
            setDiaryText(event.target.value);
          }}
        />
      </div>
      <div className="btn-wrapper">
        <button onClick={postDiary}>發布日記</button>
      </div>
    </div>
  );
};

export default CreateDiary;
