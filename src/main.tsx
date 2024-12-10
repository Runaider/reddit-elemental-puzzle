import "./createPost.js";

import { Devvit, useAsync, useState } from "@devvit/public-api";
import { getPostInfo } from "./server/postInfo.server.js";
// import { getPostInfo } from "./server/postInfo.server";
// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage = {
  type: "initialData" | "started" | "solved" | "close";
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
            // console.log(`No puzzle ${difficulty}_puzzle:${dailyId}:`);
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
          // console.log("Fetching solve time");

          const solvingTime = await context.redis.get(
            `${difficulty}_puzzle:${dailyId}:${username}:solvingTime`
          );
          // console.log("Solving time:", solvingTime);
          if (solvingTime) {
            // seconds to minutes:seconds format
            return new Date(Number(solvingTime) * 1000)
              .toISOString()
              .substr(14, 5);
          }
          return null;
        } else {
          // console.log("No dailyId, difficulty or username");
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

    // console.log("Username:", username);
    // console.log("Post info:", postInfo);
    // console.log("Daily ID:", dailyId);
    // console.log("Difficulty:", difficulty);
    // console.log("Encoded puzzle:", encodedPuzzle);
    // console.log("solveTime:", solveTime);

    const onMessage = async (msg: WebViewMessage) => {
      console.log("Received message from webview:", msg);
      switch (msg.type) {
        case "initialData":
        // console.log("Received initial data devvit:", msg.data);
        case "started":
          // console.log("Started");
          if (dailyId) {
            await context.redis.set(
              `${difficulty}_puzzle:${dailyId}:${username}:started`,
              new Date().toISOString()
            );
          }
          break;
        case "solved":
          // console.log("Solved");
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
            // seconds taken to solve the puzzle
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
        case "close":
          console.log("Close");
          setWebviewVisible(false);
          break;
        default:
          console.log("Unknown message type:", msg);
        // throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = async () => {
      // console.log("Encoded puzzle in blocks:", encodedPuzzle);
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          username: username,
          encodedPuzzle: encodedPuzzle,
          difficulty: difficulty,
        },
      });
    };
    const onShowWebviewEasyClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          difficulty: "easy",
        },
      });
    };
    const onShowWebviewMediumClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          difficulty: "medium",
        },
      });
    };
    const onShowWebviewHardClick = async () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("myWebView", {
        type: "initialData",
        data: {
          difficulty: "hard",
        },
      });
    };

    console.log("Webview visible:", webviewVisible);

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
                CONGRATULATIONS!
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
                // console.log("Received message from webview:", msg);
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
