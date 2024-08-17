import React, { useEffect, useState } from "react";
import "./MyDiaryItem.css";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";

const MyDiaryItem = () => {
  const { currentUser } = UseUserStore();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="diary-item-container">
      <div className="diary-item">
        <div className="user-info">
          <img src={currentUser.profile} alt="img" className="user-profile" />
          <div className="user-name">{currentUser.username}</div>
        </div>
        <div className="diary-item-header">
          <div className="diary-item-title">
            <h2>post.title</h2>
          </div>
          {/* <div className="deletePost">
            <button>Delete</button>
          </div> */}
        </div>
        <div className="postTextContainer"> post.postText </div>
      </div>
    </div>
  );
};

export default MyDiaryItem;
