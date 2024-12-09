"use client";
import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
} from "react";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  encodedPuzzle: string | null;
  encodedPuzzleDifficulty: string | null;
};

const AppTypeContextContext = createContext<ContextValues>({} as ContextValues);

const useAppTypeContext = () => useContext(AppTypeContextContext);

function AppTypeContextProvider({ children }: Props) {
  const [encodedPuzzle, setEncodedPuzzle] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      //   console.log("Received from Devvit Event:", event);
      if (event.data.type === "devvit-message") {
        const { data } = event.data;
        if (data.message?.type === "initialData") {
          console.log("WEB: Received initial data event:", data.message?.data);
          setEncodedPuzzle(data.message?.data.encodedPuzzle);
          setDifficulty(data.message?.data.difficulty);
          setLoading(false);
        } else {
          console.log("Not met");
        }
        // debugger;
        console.log("WEB: Received from Devvit:", event);
        // postMessage({ type: "devvit-message", message: "Hello from the game" });
      }
    };
    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
      console.log("Removed event listener");
    };
  }, []);

  const contextValue = useMemo(
    () => ({ encodedPuzzle, encodedPuzzleDifficulty: difficulty }),
    [encodedPuzzle]
  );

  return (
    <AppTypeContextContext.Provider value={contextValue}>
      {loading ? <div>Loading...</div> : children}
    </AppTypeContextContext.Provider>
  );
}
export { useAppTypeContext, AppTypeContextProvider };
