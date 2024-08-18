import React, { useEffect, useState } from "react";
import "./FriendRequest.css";
import { FaUser } from "react-icons/fa6";
import { IoIosCheckmark } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import {
  doc,
  getDocs,
  collection,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import { UseChatStore } from "@/lib/chatStorage";

interface FriendRequest {
  id: string;
  fromUser: string;
  displayName: string;
  profile: string;
  status: string;
}

const FriendRequest: React.FC = () => {
  const { currentUser, acceptFriendRequest, rejectFriendRequest } =
    UseUserStore();
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser?.id) return;

      const requestsCollection = collection(
        db,
        "users",
        currentUser.id,
        "friendRequests"
      );
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsList = requestsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as FriendRequest)
      );
      setRequests(requestsList);
    };

    fetchRequests();
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="friend-request">
      <div className="title">
        <IoPersonAdd className="add-icon" />
        <span className="title-span">交友邀請</span>
      </div>
      <div className="request-list">
        {requests.map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-user">
              {/* <FaUser className="request-profile" /> */}
              <img src={request.profile} alt="img" />
              <span className="request-name">{request.displayName}</span>
            </div>
            <div className="check-x-wrapper">
              <IoIosCheckmark
                className="check-icon"
                onClick={() =>
                  acceptFriendRequest(currentUser.id, request.fromUser)
                }
              />
              <IoIosClose
                className="x-icon"
                onClick={() =>
                  rejectFriendRequest(currentUser.id, request.fromUser)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
