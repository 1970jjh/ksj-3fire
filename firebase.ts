import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, deleteDoc, getDocs } from "firebase/firestore";
import { SessionConfig, Step } from "./types";

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

// 기본 세션 설정
const DEFAULT_SESSION: SessionConfig = {
  groupName: '',
  totalTeams: 6,
  isSessionActive: false
};

// 학습자 정보 타입
export interface LearnerData {
visitorId: string;
  name: string;
  teamId: number;
  teamName: string;
  currentStep: Step;
  joinedAt: string;
  lastActiveAt: string;
}

// 세션 저장하기 (관리자가 방을 만들 때)
export const saveSession = async (config: SessionConfig): Promise<void> => {
  try {
    await setDoc(doc(db, "sessions", "current"), config);

    // 새 세션 시작 시 이전 학습자 데이터 삭제
    if (config.isSessionActive) {
      const learnersRef = collection(db, "learners");
      const snapshot = await getDocs(learnersRef);
      const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    }

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

// 학습자 등록/업데이트
export const registerLearner = async (
visitorId: string,
  name: string,
  teamId: number,
  teamName: string,
  currentStep: Step
): Promise<void> => {
  try {
    const learnerData: LearnerData = {
visitorId,
      name,
      teamId,
      teamName,
      currentStep,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    await setDoc(doc(db, "learners", visitorId), learnerData);
  } catch (error) {
    console.error("학습자 등록 실패:", error);
  }
};

// 학습자 진행 상태 업데이트
export const updateLearnerStep = async (visitorId: string, currentStep: Step): Promise<void> => {
  try {
    await setDoc(doc(db, "learners", visitorId), {
      currentStep,
      lastActiveAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("학습자 상태 업데이트 실패:", error);
  }
};

// 학습자 목록 실시간 구독 (관리자 대시보드용)
export const subscribeToLearners = (
  callback: (learners: LearnerData[]) => void
): (() => void) => {
  const unsubscribe = onSnapshot(
    collection(db, "learners"),
    (snapshot) => {
      const learners: LearnerData[] = [];
      snapshot.forEach((docSnap) => {
        learners.push(docSnap.data() as LearnerData);
      });
      // 팀 ID로 정렬
      learners.sort((a, b) => a.teamId - b.teamId);
      callback(learners);
    },
    (error) => {
      console.error("학습자 목록 구독 오류:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export { db, DEFAULT_SESSION };
