"use client";
import React, { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase/config.js";
import { doc, setDoc } from "firebase/firestore";
import upload from "@/firebase/storage/uploadProfile.js";
import { FcGoogle } from "react-icons/fc";
import "./user.css";
import { IoIosCamera } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { IoIosLock } from "react-icons/io";

const User = () => {
  const router = useRouter();

  // signup or login
  const [action, setAction] = useState("註冊");

  // profile
  const [profile, setProfile] = useState({
    file: null as File | null,
    url: "",
  });

  const handleProfile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  //
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());

    if (action === "註冊") {
      // Sign Up logic
      const email = formEntries.email as string;
      const password = formEntries.password as string;
      const username = formEntries.username as string;
      console.log({ username, email, password });

      if (!username && !email && !password)
        return toast.warn("請輸入您的資料以完成註冊");
      if (!username) return toast.warn("請輸入您的用戶名稱");
      if (!email) return toast.warn("請輸入您的電子信箱");
      if (!password) return toast.warn("請設定您的密碼");
      if (!profile.file) return toast.warn("請上傳個人圖片以完成註冊");

      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const imgUrl = await upload(profile.file);

        await setDoc(doc(db, "users", res.user.uid), {
          username,
          email,
          profile: imgUrl,
          id: res.user.uid, // UID from firebase auth
          blocked: [], // Not necessary
        });

        await setDoc(doc(db, "userchats", res.user.uid), {
          chats: [],
        });

        toast.success("註冊成功，歡迎加入 DiaryDate!");
      } catch (err) {
        console.log(err);
        toast.error("註冊失敗，請再試一次");
      }
    } else if (action === "登入") {
      // Login logic
      const email = formEntries.email as string;
      const password = formEntries.password as string;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem("email", email);
        toast.success("登入成功，開始你的 DiaryDate!");
        router.push("/");
      } catch (err) {
        console.log(err);
        toast.error("登入失敗，請再試一次");
      }
    }
  };
  return (
    <div className="container page-background user-page">
      <form onSubmit={handleSubmit} className="inputs">
        <div className="switch-container">
          <div
            className={action === "登入" ? "switch gray" : "switch"}
            onClick={() => setAction("註冊")}
          >
            註冊
          </div>
          <div
            className={action === "註冊" ? "switch gray" : "switch"}
            onClick={() => setAction("登入")}
          >
            登入
          </div>
        </div>

        {action === "註冊" && (
          <>
            <label htmlFor="profile-input" className="profile-label">
              <IoIosCamera
                style={{
                  paddingLeft: "10px",
                  width: "34px",
                  height: "34px",
                }}
                className="camera-icon"
              />
              選擇個人圖片
              {profile.url && (
                <img
                  src={profile.url}
                  alt="Profile"
                  className="profile-url-img"
                />
              )}
            </label>
            <input
              type="file"
              id="profile-input"
              style={{ display: "none" }}
              onChange={handleProfile}
              name="profile"
            />

            <div className="input">
              <FaUser
                style={{
                  paddingLeft: "12px",
                  paddingRight: "6px",
                  width: "34px",
                  height: "32px",
                }}
                className="name-icon"
              />
              <input
                type="text"
                placeholder="用戶名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
              />
            </div>
          </>
        )}

        <div className="input">
          <IoIosMail
            style={{
              paddingLeft: "10px",
              width: "34px",
              height: "34px",
            }}
            className="email-icon"
          />
          <input
            type="text"
            placeholder="電子信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
        </div>
        <div className="input">
          <IoIosLock
            style={{
              paddingLeft: "10px",
              width: "34px",
              height: "34px",
            }}
            className="password-icon"
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          />
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div className="test-account">
          <div className="test">帳號：vvv@gmail.com</div>
          <div className="test">密碼：vvvvvv</div>
        </div>

        <div className="button-div">
          <button type="button" className="sign-in-google-btn">
            <FcGoogle className="sign-in-google-icon" />
            <div className="sign-in-google-btn-text">使用 Google 帳號登入</div>
          </button>
          <button type="submit" className="button-to-homepage">
            {action === "註冊" ? "開始註冊" : "登入 DiaryDate"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default User;
