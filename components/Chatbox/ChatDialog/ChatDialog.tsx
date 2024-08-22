import "./ChatDialog.scss";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import upload from "@/firebase/storage/uploadProfile.js";
import { FaUser } from "react-icons/fa6";
import { IoIosImage } from "react-icons/io";
import { IoIosHappy } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import Image from "next/image";

const ChatDialog = () => {
  return (
    <div className="chat-dialog">
      <div className="top">
        <div className="friend">
          <FaUser className="user-profile" />
          <div className="texts">
            <span>Friend name</span>
          </div>
        </div>
      </div>

      <div className="center">
        <div className="message">
          <div className="texts">
            <IoIosImage className="msg-img" />
            <p>message.text</p>
            <span>message.time</span>
          </div>
        </div>

        <div className="message own">
          <div className="texts">
            <IoIosImage className="msg-img" />
            <p>message.text</p>
            <span>message.time</span>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <IoIosImage className="img-icon" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} />
        </div>

        <input type="text" placeholder="輸入訊息..." className="msg-input" />
        <div className="emoji">
          <IoIosHappy className="happy-icon" />
          <div className="emoji-picker-wrapper">
            <EmojiPicker className="emoji-picker" />
          </div>
        </div>

        <button className="sendButton">
          <IoIosSend className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatDialog;
