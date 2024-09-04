import React, { useEffect, useState } from "react";
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

  return (
    <div className="diary-item-container">
      {myDiary.map((post) => (
        <div key={post.id} className="diary-item">
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
          <div className="diary-item-header">
            <div className="diary-item-title">
              <div className="title-text">{post.title}</div>
            </div>
            <div className="deletePost">
              <button onClick={() => deletePost(post.id)}>Delete</button>
            </div>
          </div>
          <div className="postTextContainer">{post.diaryText}</div>
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
      ))}
    </div>
  );
};

export default MyDiaryList;
