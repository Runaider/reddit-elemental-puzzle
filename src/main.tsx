import "./createPost.js";

import { Devvit, useAsync, useState } from "@devvit/public-api";
import { getPostInfo } from "./server/postInfo.server.js";
// import { getPostInfo } from "./server/postInfo.server";
// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage = {
  type: "initialData" | "started" | "solved" | "tutorialCompleted" | "close";
  data: {
    username: string;
    encodedPuzzle?: string;
  };
};

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "Element Synergy",
  height: "tall",
  render: (context) => {
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? "anon";
    });

    const [webviewVisible, setWebviewVisible] = useState(false);

    const { data: tutorialCompleted } = useAsync(
      async () => {
        if (username) {
          try {
            const finishedTutorial = await context.redis.get(
              `${username}:finishedTutorial`
            );
            return finishedTutorial === "true";
          } catch (error) {
            console.error("Error fetching tutorial completion:", error);
            return false;
          }
        }
        return false;
      },
      { depends: [username] }
    );

    const {
      data: postInfo,
      loading,
      error: postError,
    } = useAsync(async () => {
      if (!context.postId) throw new Error("No post ID available");
      return await getPostInfo(context.postId, context);
    });

    const { data: dailyId } = useAsync<string | null>(
      async () => {
        if (postInfo) {
          if (postInfo.title.includes(" - #")) {
            return postInfo.title.split(" - #")[1];
          } else {
            return null;
          }
        }
        return null;
      },
      { depends: [postInfo] }
    );

    const { data: difficulty } = useAsync<string | null>(
      async () => {
        if (postInfo) {
          return postInfo.title.split(" ")[1];
        }
        return null;
      },
      { depends: [postInfo] }
    );

    const { data: encodedPuzzle } = useAsync<string | null>(
      async () => {
        if (dailyId) {
          try {
            const encodedPuzzle = await context.redis.get(
              `${difficulty}_puzzle:${dailyId}`
            );
            if (encodedPuzzle) {
              return encodedPuzzle;
            }
            return null;
          } catch (error) {
            console.error("Error fetching puzzle:", error);
            return null;
          }
        }
        return null;
      },
      { depends: [dailyId] }
    );

    const { data: solveTime } = useAsync<string | null>(
      async () => {
        if (dailyId && difficulty && username) {
          const solvingTime = await context.redis.get(
            `${difficulty}_puzzle:${dailyId}:${username}:solvingTime`
          );
          if (solvingTime) {
            // seconds to minutes:seconds format
            return new Date(Number(solvingTime) * 1000)
              .toISOString()
              .substr(14, 5);
          }
          return null;
        }
        return null;
      },
      { depends: [difficulty, dailyId, username] }
    );

    const { data: averageSolveTime } = useAsync<string | null>(
      async () => {
        if (dailyId && difficulty) {
          const leaderboard = await context.redis.zRange(
            `${difficulty}_puzzle:${dailyId}:leaderboard`,
            0,
            -1
          );
          if (leaderboard.length > 0) {
            const totalSolveTime = leaderboard.reduce(
              (acc, member) => acc + member.score,
              0
            );
            const averageSolveTime = totalSolveTime / leaderboard.length;
            return new Date(averageSolveTime * 1000)
              .toISOString()
              .substr(14, 5);
          }
          return null;
        }
        return null;
      },
      { depends: [dailyId, difficulty] }
    );

    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case "started":
          if (dailyId) {
            await context.redis.set(
              `${difficulty}_puzzle:${dailyId}:${username}:started`,
              new Date().toISOString()
            );
          }
          break;
        case "solved":
          if (dailyId) {
            const solveStartTime = await context.redis.get(
              `${difficulty}_puzzle:${dailyId}:${username}:started`
            );
            if (!solveStartTime) {
              console.error("User did not start the puzzle");
              return;
            }
            const solutionTime =
              new Date().getTime() - new Date(solveStartTime).getTime();

            const solvedInSeconds = solutionTime / 1000;
            await context.redis.set(
              `${difficulty}_puzzle:${dailyId}:${username}:solved`,
              new Date().toISOString()
            );
            await context.redis.set(
              `${difficulty}_puzzle:${dailyId}:${username}:solvingTime`,
              solvedInSeconds.toString()
            );
            context.redis.zAdd(`${difficulty}_puzzle:${dailyId}:leaderboard`, {
              member: username,
              score: solvedInSeconds,
            });
          }
          break;
        case "tutorialCompleted":
          await context.redis.set(`${username}:finishedTutorial`, "true");
          break;
        case "close":
          setWebviewVisible(false);
          break;
        default:
          console.log("Unknown message type:", msg);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          username: username,
          encodedPuzzle: encodedPuzzle,
          difficulty: difficulty,
          tutorialCompleted: tutorialCompleted,
          isDaily: dailyId ? true : false,
        },
      });
    };
    const onShowWebviewEasyClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          username: username,
          difficulty: "easy",
          tutorialCompleted: tutorialCompleted,
          isDaily: dailyId ? true : false,
        },
      });
    };
    const onShowWebviewMediumClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          username: username,
          difficulty: "medium",
          tutorialCompleted: tutorialCompleted,
          isDaily: dailyId ? true : false,
        },
      });
    };
    const onShowWebviewHardClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          username: username,
          difficulty: "hard",
          tutorialCompleted: tutorialCompleted,
          isDaily: dailyId ? true : false,
        },
      });
    };

    // Render the custom post type
    return (
      <vstack grow padding="small" backgroundColor="#fcf7e9">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? "0%" : "100%"}
          alignment="middle center"
        >
          <vstack alignment="start">
            <image
              url="logo.png"
              imageWidth={100}
              imageHeight={100}
              description="logo"
            />
          </vstack>

          <text size="xlarge" weight="bold" color="#6e6d6a">
            ELEMENTAL SYNERGY
          </text>
          <spacer />
          {dailyId && !averageSolveTime && (
            <vstack alignment="start middle">
              <text size="medium" color="#6e6d6a" weight="bold">
                Be the first to solve todays puzzle!
              </text>
            </vstack>
          )}

          {solveTime && (
            <vstack alignment="start middle">
              <spacer />

              <text size="xxlarge" weight="bold" color="#1D8E59">
                Completed!
              </text>
              <spacer />
              <spacer />
              <spacer />
            </vstack>
          )}
          {solveTime && (
            <vstack alignment="center middle" width={"100%"}>
              <hstack
                width={"80%"}
                maxWidth={"200px"}
                alignment="center middle"
              >
                <text size="large" color="#6e6d6a">
                  Your time:
                </text>
                <spacer grow />
                <text size="large" color="#6e6d6a" weight="bold">
                  {""}
                  {solveTime ?? "Not solved yet"}
                </text>
              </hstack>
            </vstack>
          )}
          {averageSolveTime && (
            <vstack alignment="center middle" width={"100%"}>
              <hstack
                width={"80%"}
                maxWidth={"200px"}
                alignment="center middle"
              >
                <text size="large" color="#6e6d6a">
                  Average time:
                </text>
                <spacer grow />
                <text size="large" color="#6e6d6a" weight="bold">
                  {""}
                  {averageSolveTime ?? "Not solved yet"}
                </text>
              </hstack>
            </vstack>
          )}

          <spacer />
          <spacer />
          <spacer />
          <spacer />

          {dailyId && !solveTime && (
            <button
              textColor="#fcf7e9"
              width="50%"
              minWidth={"100px"}
              maxWidth={"275px"}
              onPress={onShowWebviewClick}
            >
              Solve
            </button>
          )}

          {!dailyId && (
            <vstack alignment="center middle" width={"100%"}>
              <text size="medium" color="#6e6d6a" weight="bold">
                Pick a difficulty level to start
              </text>
              <spacer />
              <button
                textColor="#fcf7e9"
                width="50%"
                minWidth={"100px"}
                maxWidth={"275px"}
                onPress={onShowWebviewEasyClick}
              >
                Warm-Up
              </button>
              <spacer />
              <button
                textColor="#fcf7e9"
                width="50%"
                minWidth={"100px"}
                maxWidth={"275px"}
                onPress={onShowWebviewMediumClick}
              >
                Challenger
              </button>
              <spacer />

              <button
                textColor="#fcf7e9"
                width="50%"
                minWidth={"100px"}
                maxWidth={"275px"}
                onPress={onShowWebviewHardClick}
              >
                Master
              </button>
            </vstack>
          )}
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? "100%" : "0%"}>
          <vstack
            border="thick"
            borderColor="black"
            height={webviewVisible ? "100%" : "0%"}
          >
            <webview
              id="myWebView"
              url="index.html"
              onMessage={(msg) => {
                onMessage(msg as WebViewMessage);
              }}
              grow
              height={webviewVisible ? "100%" : "0%"}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
