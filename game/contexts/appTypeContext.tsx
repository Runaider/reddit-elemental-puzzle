"use client";
import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import BordLoader from "../components/basic/BordLoader";
import Tutorial from "../components/compound/Tutoralia";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  encodedPuzzle: string | null;
  difficulty: string | null;
  isDaily: boolean;
  finishTutorial: () => void;
};

const AppTypeContextContext = createContext<ContextValues>({} as ContextValues);

const useAppTypeContext = () => useContext(AppTypeContextContext);

function AppTypeContextProvider({ children }: Props) {
  const [isDaily, setIsDaily] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);
  const [encodedPuzzle, setEncodedPuzzle] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const finishTutorial = useCallback(() => {
    setIsTutorial(false);
    window.parent.postMessage({ type: "tutorialCompleted" }, "*");
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
        }
      }
    };
    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [finishTutorial]);

  const contextValue = useMemo(
    () => ({
      isDaily,
      encodedPuzzle,
      difficulty: difficulty,
      finishTutorial,
      setEncodedPuzzle,
    }),
    [encodedPuzzle, difficulty]
  );

  return (
    <AppTypeContextContext.Provider value={contextValue}>
      <Tutorial />

      {/* {loading ? (
        <div>
          <div className="h-10" />
          <BordLoader />
        </div>
      ) : isTutorial ? (
        <Tutorial />
      ) : (
        children
      )} */}
    </AppTypeContextContext.Provider>
  );
}
export { useAppTypeContext, AppTypeContextProvider };
