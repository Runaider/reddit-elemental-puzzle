"use client";
import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import LeaderboardPage from "../components/pages/Leaderboard";
import Tutorial from "../components/compound/Tutoralia";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  encodedPuzzle: string | null;
  difficulty: string | null;
  isDaily: boolean;
  averageSolveTime: string | null;
  leaderboard: { score: number; member: string }[];
  closeWebview: () => void;
  finishTutorial: () => void;
};

const AppTypeContextContext = createContext<ContextValues>({} as ContextValues);

const useAppTypeContext = () => useContext(AppTypeContextContext);

function AppTypeContextProvider({ children }: Props) {
  const [isDaily, setIsDaily] = useState(false);
  const [averageSolveTime, setAverageSolveTime] = useState<string | null>(null);
  const [isTutorial, setIsTutorial] = useState(false);
  const [encodedPuzzle, setEncodedPuzzle] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [leaderboard, setLeaderboard] = useState<
    { score: number; member: string }[]
  >([]);

  const finishTutorial = useCallback(() => {
    setIsTutorial(false);
    window.parent.postMessage({ type: "tutorialCompleted" }, "*");
  }, []);

  const closeWebview = useCallback(() => {
    window.parent.postMessage({ type: "close" }, "*");
    setIsVisible(false);
    setIsLeaderboard(false);
  }, []);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data.type === "devvit-message") {
        const { data } = event.data;
        if (data.message?.type === "initialData") {
          setEncodedPuzzle(data.message?.data.encodedPuzzle);
          setDifficulty(data.message?.data.difficulty);
          setLoading(false);
          setIsTutorial(!data.message?.data.tutorialCompleted);
          setIsDaily(data.message?.data.isDaily);
          setAverageSolveTime(data.message?.data.averageSolveTime);
          setIsVisible(data.message?.data.isVisible);
          setLeaderboard(data.message?.data.leaderboard);
          setIsLeaderboard(data.message?.data.isLeaderboard);
        }
      }
    };
    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  const content = useMemo(() => {
    if (!isVisible) {
      return <></>;
    }
    if (isLeaderboard) {
      return <LeaderboardPage />;
    }
    if (isTutorial) {
      return <Tutorial />;
    }
    return children;
  }, [isLeaderboard, isVisible, isTutorial]);

  const contextValue = useMemo(
    () => ({
      isDaily,
      encodedPuzzle,
      difficulty: difficulty,
      averageSolveTime,
      leaderboard,
      closeWebview,
      finishTutorial,
      setEncodedPuzzle,
    }),
    [encodedPuzzle, difficulty]
  );

  return (
    <AppTypeContextContext.Provider value={contextValue}>
      {loading ? (
        <div>
          <div className="h-10" />
        </div>
      ) : (
        content
      )}
    </AppTypeContextContext.Provider>
  );
}
export { useAppTypeContext, AppTypeContextProvider };
