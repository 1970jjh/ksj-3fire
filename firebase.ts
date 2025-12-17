import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { SessionConfig } from "./types";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBdVLqqQUEzSOa6syWTdDSVYTy1nYzNUpg",
  authDomain: "ksj-3fire.firebaseapp.com",
  projectId: "ksj-3fire",
  storageBucket: "ksj-3fire.firebasestorage.app",
  messagingSenderId: "197715368052",
  appId: "1:197715368052:web:fa332c55255f95af249921"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 세션 문서 경로
const SESSION_DOC = "sessions/current";

// 기본 세션 설정
const DEFAULT_SESSION: SessionConfig = {
  groupName: '',
  totalTeams: 6,
  isSessionActive: false
};

// 세션 저장하기 (관리자가 방을 만들 때)
export const saveSession = async (config: SessionConfig): Promise<void> => {
  try {
    await setDoc(doc(db, "sessions", "current"), config);
    console.log("세션이 Firebase에 저장되었습니다!");
  } catch (error) {
    console.error("세션 저장 실패:", error);
    throw error;
  }
};

// 세션 실시간 구독 (학습자가 방 정보를 받을 때)
export const subscribeToSession = (
  callback: (config: SessionConfig) => void
): (() => void) => {
  const unsubscribe = onSnapshot(
    doc(db, "sessions", "current"),
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as SessionConfig;
        callback(data);
      } else {
        callback(DEFAULT_SESSION);
      }
    },
    (error) => {
      console.error("세션 구독 오류:", error);
      callback(DEFAULT_SESSION);
    }
  );

  return unsubscribe;
};

export { db, DEFAULT_SESSION };
