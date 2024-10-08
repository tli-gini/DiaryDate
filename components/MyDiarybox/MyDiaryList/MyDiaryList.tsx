import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./MyDiaryList.css";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";
import { IoIosTrash } from "react-icons/io";
import ReactMarkdown from "react-markdown";

interface MyDiary {
  id: string;
  title: string;
  diaryText: string;
  author: {
    name: string;
    id: string;
  };
  createdAt: {
    toDate: () => Date;
  };
  diaryDate: string;
}

const MyDiaryList: React.FC = () => {
  const { currentUser } = UseUserStore();
  const [myDiary, setMyDiary] = useState<MyDiary[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchMyDiary();
    }
  }, [currentUser]);

  const fetchMyDiary = async () => {
    try {
      const postsCollectionRef = collection(db, "posts");

      const q = query(
        postsCollectionRef,
        where("author.id", "==", currentUser?.id)
      );

      const querySnapshot = await getDocs(q);

      const diaries = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as MyDiary)
      );

      // Sort in descending order
      diaries.sort(
        (a, b) =>
          b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
      );

      setMyDiary(diaries);
    } catch (error) {
      console.error("Error fetching my diary: ", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setMyDiary(myDiary.filter((diary) => diary.id !== id));
    } catch (error) {
      console.error("Error deleting my diary: ", error);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (myDiary.length === 0) {
    return (
      <div className="no-diary-wrapper">
        <div className="no-diary-text">還沒有建立日記？</div>
        <div className="no-diary-btn-div">
          <Link href="/my-diary/new-diary">
            <button className="no-diary-btn">開始寫日記吧！</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-item-container">
      {myDiary.map((post) => (
        <div key={post.id} className="diary-item">
          <div className="diary-item-main">
            <div className="user-info">
              <Image
                src={currentUser.profile}
                alt=""
                className="user-profile"
                width={60}
                height={60}
              />
              <div className="user-name">{currentUser.username}</div>
            </div>
            <div className="diary-item-title">
              <div className="title-text">{`${post.diaryDate} - ${post.title}`}</div>
            </div>
            <div className="diary-item-content">
              <ReactMarkdown>{post.diaryText}</ReactMarkdown>
            </div>
          </div>

          <div className="diary-item-bottom">
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

            <IoIosTrash
              onClick={() => deletePost(post.id)}
              className="delete-icon"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyDiaryList;
