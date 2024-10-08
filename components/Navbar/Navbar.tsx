"use client";
import Image from "next/image";
import Link from "next/link";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { UseUserStore } from "@/lib/userStorage";
import { toast } from "react-toastify";

export default function Navbar() {
  const router = useRouter();
  const { currentUser, fetchUserInfo } = UseUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  // user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid); // login: fetch user info
      } else {
        fetchUserInfo(null); // signout: clear user info
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [fetchUserInfo]);

  // Sign out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("登出完成");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // menu RWD
  const showMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="nav-container">
        <Link href="/">
          <div className="logo-wrapper">
            <Image
              src="/img/favicon.png"
              alt="logo"
              id="logo"
              width={500}
              height={500}
            />
            <Image
              src="/img/title.jpeg"
              alt="diary-date"
              id="logo-title"
              width={490}
              height={122}
            />
          </div>
        </Link>

        <div className="nav-items hamburger-icon-div">
          {!menuOpen && (
            <RxHamburgerMenu className="hamberger-icon" onClick={showMenu} />
          )}
        </div>
        <div className={`nav-items main-items ${menuOpen ? "show" : ""}`}>
          <Link href="/diary-share">
            <div className="nav-item">交換日記</div>
          </Link>
          <Link href="/my-diary">
            <div className="nav-item">我的日記</div>
          </Link>
          <Link href="/my-diary/new-diary">
            <div className="nav-item web-hide">寫日記</div>
          </Link>
          <Link href="/diary-share/chatroom">
            <div className="nav-item web-hide">聊天室</div>
          </Link>
          <>
            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="sign-out-btn"
                type="button"
              >
                <span>登出</span> &nbsp;
                <RiLogoutBoxRLine className="signout-icon" />
              </button>
            ) : (
              <Link href="/user">
                <div className="nav-item">登入/註冊</div>
              </Link>
            )}
          </>
          <IoIosClose className="close-icon" onClick={closeMenu} />
        </div>
      </div>
    </nav>
  );
}
