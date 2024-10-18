import React, { useEffect, useState } from "react";
import "./FriendRequest.css";
import { IoIosCheckmark } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UseUserStore } from "@/lib/userStorage";
import Image from "next/image";

interface FriendRequest {
  id: string;
  fromUser: string;
  displayName: string;
  profile: string;
  status: string;
}

interface FriendRequestProps {
  reload: () => void;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ reload }) => {
  const { currentUser, acceptFriendRequest, rejectFriendRequest } =
    UseUserStore();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [removeRequest, setRemoveRequest] = useState(0);

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
  }, [currentUser, removeRequest]);

  const handleAcceptFriendRequest = async (fromUserId: string) => {
    await acceptFriendRequest(currentUser!.id, fromUserId);
    setRemoveRequest((prev) => prev + 1);
    reload();
  };

  const handleRejectFriendRequest = async (fromUserId: string) => {
    await rejectFriendRequest(currentUser!.id, fromUserId);
    setRemoveRequest((prev) => prev + 1);
    reload();
  };

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
              <Image src={request.profile} alt="" width={46} height={46} />
              <span className="request-name">{request.displayName}</span>
            </div>
            <div className="check-x-wrapper">
              <IoIosCheckmark
                className="check-icon"
                onClick={() => handleAcceptFriendRequest(request.fromUser)}
              />
              <IoIosClose
                className="x-icon"
                onClick={() => handleRejectFriendRequest(request.fromUser)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
