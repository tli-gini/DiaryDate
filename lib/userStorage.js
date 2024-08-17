import { create } from "zustand";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { toast } from "react-toastify";

// State Management Library

export const UseUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: { id: uid, ...docSnap.data() }, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },

  sendFriendRequest: async (currentUserId, targetUserId) => {
    // console.log("Firestore DB:", db);
    // console.log("Current User ID:", currentUserId);
    // console.log("Target User ID:", targetUserId);

    if (!currentUserId || !targetUserId) {
      console.error("Invalid user IDs");
      return;
    }

    const targetUserRef = doc(
      db,
      "users",
      targetUserId,
      "friendRequests",
      currentUserId
    );
    const currentUserRef = doc(
      db,
      "users",
      currentUserId,
      "ownRequests",
      targetUserId
    );

    // Check if a request already exists
    const requestDoc = await getDoc(targetUserRef);
    if (requestDoc.exists()) {
      console.log("已發送過交友邀請");
      toast.warn("已發送過交友邀請");
      return;
    }

    // Fetch current user's data
    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
    if (!currentUserDoc.exists()) {
      console.log("Current user data not found.");
      return;
    }
    const currentUserData = currentUserDoc.data();

    // Fetch target user's data
    const targetUserDoc = await getDoc(doc(db, "users", targetUserId));
    if (!targetUserDoc.exists()) {
      console.log("Target user data not found.");
      return;
    }
    const targetUserData = targetUserDoc.data();

    // Add request to target user's friendRequests
    await setDoc(targetUserRef, {
      fromUser: currentUserId,
      displayName: currentUserData?.username || "Unknown",
      profile: currentUserData?.profile || "",
      status: "requested",
    });

    // Add request to current user's ownRequests
    await setDoc(currentUserRef, {
      toUser: targetUserId,
      displayName: targetUserData?.username || "Unknown",
      profile: targetUserData?.profile || "",
      status: "requested",
    });

    console.log("Friend request sent.");
    toast.success("成功發送交友邀請！");
  },
}));
