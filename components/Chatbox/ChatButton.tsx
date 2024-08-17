import Link from "next/link";
import "./ChatButton.css";
import { BsChatDots } from "react-icons/bs";

export default function Chatbox() {
  return (
    <Link href="/diary-share/chatroom" className="chatbox-link">
      <div className="chatbox-btn">
        <BsChatDots className="chatbox-icon" />
      </div>
    </Link>
  );
}
