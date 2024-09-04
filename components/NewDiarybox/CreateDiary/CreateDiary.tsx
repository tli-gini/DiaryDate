import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./CreateDiary.css";
import { db } from "@/firebase/config.js";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { UseUserStore } from "@/lib/userStorage";
import { toast } from "react-toastify";

interface DiaryEntry {
  title: string;
  diaryText: string;
  author: {
    name: string;
    id: string;
  };
  createdAt: ReturnType<typeof serverTimestamp>;
}

const CreateDiary: React.FC = () => {
  const { currentUser } = UseUserStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [diaryText, setDiaryText] = useState("");

  const postsCollectionRef = collection(db, "posts");

  const postDiary = async () => {
    if (!diaryText) {
      return;
    }

    try {
      const newDiary: DiaryEntry = {
        title,
        diaryText,
        author: {
          name: currentUser?.username || "Unknown",
          id: currentUser?.id || "",
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(postsCollectionRef, newDiary);
      toast.success("成功發布日記！");
      router.push("/my-diary");
    } catch (error) {
      console.error("Error posting diary: ", error);
      toast.error("發布日記發生錯誤，請再試一次");
    }
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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <label>內文： *</label>
        <textarea
          className="text-input"
          placeholder=" ..."
          value={diaryText}
          onChange={(event) => setDiaryText(event.target.value)}
        />
      </div>
      <div className="btn-wrapper">
        <button onClick={postDiary}>發布日記</button>
      </div>
    </div>
  );
};

export default CreateDiary;
