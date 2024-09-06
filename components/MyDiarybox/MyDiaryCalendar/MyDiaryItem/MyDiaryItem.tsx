import React, { useEffect, useState } from "react";
import "./MyDiaryItem.css";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import dayjs, { Dayjs } from "dayjs";

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

interface MyDiaryItemProps {
  selectedDate: Dayjs | null;
}

const MyDiaryItem: React.FC<MyDiaryItemProps> = ({ selectedDate }) => {
  const { currentUser } = UseUserStore();
  const [myDiary, setMyDiary] = useState<MyDiary[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchMyDiary();
    }
  }, [currentUser, selectedDate]);

  const fetchMyDiary = async () => {
    try {
      const postsCollectionRef = collection(db, "posts");
      const dateDefault = selectedDate || dayjs(); // default is today
      const formattedDate = dateDefault.format("YYYY/MM/DD");

      const q = query(
        postsCollectionRef,
        where("author.id", "==", currentUser?.id),
        where("diaryDate", "==", formattedDate)
      );

      const querySnapshot = await getDocs(q);
      const diaries = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as MyDiary)
      );

      diaries.sort(
        (a, b) =>
          b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
      );

      setMyDiary(diaries);
    } catch (error) {
      console.error("Error fetching my diary: ", error);
    }
  };

  const displayDate = selectedDate || dayjs();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="diary-container">
      <div className="user-info-c">
        <Image
          src={currentUser.profile}
          alt=""
          className="user-profile"
          width={60}
          height={60}
        />
        <div className="user-name">{currentUser.username}</div>
      </div>
      {myDiary.length > 0 ? (
        myDiary.map((post) => (
          <div key={post.id} className="calendar-diary-item">
            <div className="diary-item-main">
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
            </div>
          </div>
        ))
      ) : (
        <div className="no-diary-message">
          {`沒有收藏在 ${displayDate.format("YYYY/MM/DD")} 的日記`}
        </div>
      )}
    </div>
  );
};

export default MyDiaryItem;
