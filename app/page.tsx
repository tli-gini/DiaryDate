import Image from "next/image";
import Link from "next/link";
import Chatbox from "@/components/Chatbox/ChatButton";
import Diarybox from "@/components/NewDiarybox/DiaryButton";
import "./page.css";

export default function Home() {
  return (
    <div className="container home-container">
      <Chatbox />
      <Diarybox />
      <div className="welcome">
        <Image src="/img/welcome.png" alt="Welcome" width={1908} height={608} />
      </div>
      <div className="welcome-text">
        <span className="up-span">Share Your Diary, </span>
        <span className="down-span">Meet Your Date ; )</span>
      </div>
      <div className="homepage-content">
        <div className="start-btn-div">
          <Link href="/my-diary/new-diary">
            <button className="start-btn">開始寫日記吧！</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
