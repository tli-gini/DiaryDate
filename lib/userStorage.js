import { create } from "zustand";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
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
    if (!currentUserId || !targetUserId) {
      console.error("Invalid user IDs");
      return;
    }

    // Check if a request already exists
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

    const requestDoc = await getDoc(targetUserRef);
    if (requestDoc.exists()) {
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

    toast.success("成功發送交友邀請！");
  },

  acceptFriendRequest: async (currentUserId, fromUserId) => {
    try {
      const currentUserFriendRef = doc(
        db,
        "users",
        currentUserId,
        "friends",
        fromUserId
      );
      const fromUserFriendRef = doc(
        db,
        "users",
        fromUserId,
        "friends",
        currentUserId
      );

      // Fetch user data
      const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
      const fromUserDoc = await getDoc(doc(db, "users", fromUserId));

      if (!currentUserDoc.exists() || !fromUserDoc.exists()) {
        console.log("User data not found.");
        return;
      }

      const currentUserData = currentUserDoc.data();
      const fromUserData = fromUserDoc.data();

      // Add to friends subcollection for both users
      await setDoc(currentUserFriendRef, {
        friendUid: fromUserId,
        displayName: fromUserData.username || "Unknown",
        profile: fromUserData.profile || "",
      });

      await setDoc(fromUserFriendRef, {
        friendUid: currentUserId,
        displayName: currentUserData.username || "Unknown",
        profile: currentUserData.profile || "",
      });

      // Remove friend request
      await deleteDoc(
        doc(db, "users", currentUserId, "friendRequests", fromUserId)
      );
      await deleteDoc(
        doc(db, "users", fromUserId, "ownRequests", currentUserId)
      );

      toast.success("已接受交友邀請！");
    } catch (error) {
      console.error("Error accepting friend request: ", error);
      toast.error("接受交友邀請失敗");
    }
  },

  rejectFriendRequest: async (currentUserId, fromUserId) => {
    try {
      await deleteDoc(
        doc(db, "users", currentUserId, "friendRequests", fromUserId)
      );
      await deleteDoc(
        doc(db, "users", fromUserId, "ownRequests", currentUserId)
      );
      toast.success("已拒絕交友邀請");
    } catch (error) {
      console.error("Error rejecting friend request: ", error);
      toast.error("拒絕交友邀請失敗");
    }
  },

  getFriends: async (userId) => {
    const friendsRef = collection(db, "users", userId, "friends");
    const friendsSnapshot = await getDocs(friendsRef);
    return friendsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
}));
