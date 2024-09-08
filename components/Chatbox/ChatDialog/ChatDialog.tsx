import "./ChatDialog.scss";
import { useEffect, useRef, useState, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import upload from "@/firebase/storage/uploadProfile.js";
import { FaUser } from "react-icons/fa6";
import { IoIosImage } from "react-icons/io";
import { IoIosHappy } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import Image from "next/image";
import { UseUserStore } from "@/lib/userStorage";
import { v4 as uuidv4 } from "uuid";

interface ChatFriend {
  id: string;
  displayName: string;
  lastMessage: string;
  profile: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  date: Date;
  img?: string;
}

interface ChatDialogProps {
  selectedFriend: ChatFriend | null;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ selectedFriend }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLDivElement>(null);

  const [messageId, setMessageId] = useState<string | null>(null);
  const { currentUser } = UseUserStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  // UUID
  useEffect(() => {
    setMessageId(uuidv4());
  }, []);

  useEffect(() => {
    if (!currentUser?.id || !selectedFriend?.id) {
      setMessages([]);
      return;
    }

    const chatId = [currentUser.id, selectedFriend.id].sort().join("_");

    const unsubscribe = onSnapshot(doc(db, "chats", chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.id, selectedFriend?.id]);

  // scroll to bottom for new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // sending message
  const handleSend = useCallback(async () => {
    if (!text && !img) return;
    if (!currentUser?.id || !selectedFriend?.id || !messageId) return;

    const chatId = [currentUser.id, selectedFriend.id].sort().join("_");

    let imageUrl = "";
    if (img) {
      imageUrl = await upload(img);
    }

    const messageRef = doc(db, "chats", chatId);
    const newMessage = {
      id: messageId,
      text,
      senderId: currentUser.id,
      date: new Date().toISOString(),
      img: imageUrl,
    };

    try {
      const docSnap = await getDoc(messageRef);

      if (docSnap.exists()) {
        await updateDoc(messageRef, {
          messages: arrayUnion(newMessage),
        });
      } else {
        await setDoc(messageRef, {
          messages: [newMessage],
        });
      }

      const updateData = {
        [chatId + ".lastMessage"]: { text },
        [chatId + ".date"]: serverTimestamp(),
      };

      await updateDoc(doc(db, "userchats", currentUser.id), updateData);
      await updateDoc(doc(db, "userchats", selectedFriend.id), updateData);

      setText("");
      setImg(null);
      setFileName("");
      setMessageId(uuidv4());
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }, [text, img, currentUser?.id, selectedFriend?.id, messageId]);

  // file input
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImg(file);
        setFileName(file.name); // Display file name in input bar
      }
    },
    []
  );

  // emoji click
  const handleEmojiClick = useCallback((emojiObject: { emoji: string }) => {
    setText((prev) => prev + emojiObject.emoji);
    setFileName((prev) => prev + emojiObject.emoji);
  }, []);

  // 點擊 emojiPicker 外部關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmoji &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  // Toggle emoji picker
  const toggleEmojiPicker = useCallback(() => {
    setShowEmoji((prev) => !prev);
  }, []);

  // Enter 發送訊息
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // updated text
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    setFileName(newText);
  };

  if (!selectedFriend) {
    return (
      <div className="chat-dialog no-chat">
        <p className="no-chat-p">開始和好友聊天吧！</p>
      </div>
    );
  }

  return (
    <div className="chat-dialog">
      <div className="top">
        <div className="friend">
          <Image
            className="user-profile"
            src={selectedFriend.profile}
            alt=""
            width={60}
            height={60}
          />
          <div className="texts">
            <span>{selectedFriend.displayName}</span>
          </div>
        </div>
      </div>

      <div className="center">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.senderId === currentUser?.id ? "own" : ""
            }`}
            ref={scrollRef}
          >
            <div className="texts">
              {message.img && (
                <Image
                  src={message.img}
                  alt=""
                  width={200}
                  height={200}
                  className="msg-img"
                />
              )}
              {/* prevent the empty <p></p> */}
              {message.text && <p>{message.text}</p>}
              <span>
                {new Date(message.date).toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <IoIosImage className="img-icon" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <input
          type="text"
          placeholder="輸入訊息..."
          className="msg-input"
          value={fileName}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown} // Enter 發送訊息
        />
        <div className="emoji" ref={emojiButtonRef}>
          <IoIosHappy className="happy-icon" onClick={toggleEmojiPicker} />
          {showEmoji && (
            <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button className="sendButton" onClick={handleSend}>
          <IoIosSend className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatDialog;
