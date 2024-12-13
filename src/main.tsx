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
    const [refresh, setRefresh] = useState(0);
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? "anon";
    });

    const [webviewVisible, setWebviewVisible] = useState(false);

    const { data: tutorialCompleted, loading: tutorialCompletedLoading } =
      useAsync(
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

    const { data: dailyId, loading: dailyIdLoading } = useAsync<string | null>(
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
          return postInfo.title.split(" ")[1]?.toLowerCase();
        }
        return null;
      },
      { depends: [postInfo] }
    );

    const { data: encodedPuzzle, loading: loadingEncodedPuzzle } = useAsync<
      string | null
    >(
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
      { depends: [difficulty, dailyId, username, refresh] }
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
      { depends: [dailyId, difficulty, refresh] }
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
          setRefresh((prev) => prev + 1);
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
          averageSolveTime: averageSolveTime,
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

    // const isVisible =
    //   !loading &&
    //   !dailyIdLoading &&
    //   !loadingEncodedPuzzle &&
    //   !tutorialCompletedLoading;

    // Render the custom post type
    if (
      loading ||
      dailyIdLoading ||
      loadingEncodedPuzzle ||
      tutorialCompletedLoading
    ) {
      return (
        <vstack grow padding="small" backgroundColor="#fcf7e9">
          <vstack height={"100%"} alignment="middle center">
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
            <vstack alignment="start middle">
              <text size="medium" color="#6e6d6a" weight="bold">
                Loading app...
              </text>
            </vstack>
          </vstack>
        </vstack>
      );
    }

    return (
      <vstack
        grow
        padding="small"
        backgroundColor={solveTime ? "#248571f0 " : "#fcf7e9"}
      >
        <vstack
          alignment="center middle"
          grow={!webviewVisible}
          height={webviewVisible ? "0%" : "100%"}
        >
          {!solveTime && (
            <vstack alignment="top center">
              <spacer />
              <spacer />
              <vstack alignment="start">
                <image
                  url="logo.png"
                  imageWidth={100}
                  imageHeight={100}
                  description="logo"
                />
              </vstack>

              <text
                size="xlarge"
                weight="bold"
                color={solveTime ? "white" : "#6e6d6a"}
              >
                ELEMENTAL SYNERGY
              </text>
              <spacer />
              <spacer />
              <spacer />
              <spacer />
            </vstack>
          )}
          {solveTime && (
            <vstack alignment="start middle">
              <spacer />
              {/* <text size="xxlarge" weight="bold" color="white">
                  SOLVED
                </text> */}
              <image
                imageWidth={"335px"}
                imageHeight={"66px"}
                url={`data:image/svg+xml,
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="335" height="66" viewBox="0 0 335 66">
  <defs>
    <style>
      .cls-1 {
        fill: #fff;
        fill-rule: evenodd;
        filter: url(#filter);
      }
    </style>
    <filter id="filter" x="0.031" y="0.531" width="334.969" height="64.469" filterUnits="userSpaceOnUse">
      <feOffset result="offset" dx="3.464" dy="2" in="SourceAlpha"/>
      <feGaussianBlur result="blur"/>
      <feFlood result="flood" flood-color="#f9bb00"/>
      <feComposite result="composite" operator="in" in2="blur"/>
      <feBlend result="blend" in="SourceGraphic"/>
    </filter>
  </defs>
  <path id="SOLVED_" data-name="SOLVED " class="cls-1" d="M23.593,62.352a26.047,26.047,0,0,0,11.782-2.494,18.376,18.376,0,0,0,7.611-6.708,17.384,17.384,0,0,0,2.623-9.374,14.05,14.05,0,0,0-2.666-8.858,18.11,18.11,0,0,0-6.321-5.246,79.789,79.789,0,0,0-9.5-3.784,44.98,44.98,0,0,1-8.6-3.526A5.06,5.06,0,0,1,15.767,17.8,5.118,5.118,0,0,1,17.4,13.719,6.322,6.322,0,0,1,21.7,12.3a7.576,7.576,0,0,1,5.074,1.677,6.229,6.229,0,0,1,2.15,4.6h15.91Q44.4,10.064,38.3,5.291T22.217,0.518q-9.8,0-15.91,4.773T0.2,18.492a14.853,14.853,0,0,0,2.666,9.2,17.617,17.617,0,0,0,6.364,5.332,67.8,67.8,0,0,0,9.546,3.612,59.853,59.853,0,0,1,6.235,2.15,12.172,12.172,0,0,1,3.7,2.408,4.943,4.943,0,0,1,1.5,3.7,5.034,5.034,0,0,1-1.892,4.171,8.069,8.069,0,0,1-5.16,1.505A7.46,7.46,0,0,1,18,48.807a7.584,7.584,0,0,1-2.322-5.117H0.029A17.375,17.375,0,0,0,3.34,53.838,19.329,19.329,0,0,0,11.725,60.2a31.04,31.04,0,0,0,11.868,2.15h0Zm60.457,0A31.266,31.266,0,0,0,99.616,58.4,29.352,29.352,0,0,0,110.8,47.345a31.134,31.134,0,0,0,4.128-15.953,31.173,31.173,0,0,0-4.085-15.91A29.058,29.058,0,0,0,99.659,4.474a32.772,32.772,0,0,0-31.218,0A29.673,29.673,0,0,0,57.175,15.482,30.652,30.652,0,0,0,53,31.392a30.876,30.876,0,0,0,4.171,15.953A29.563,29.563,0,0,0,68.441,58.4,31.5,31.5,0,0,0,84.05,62.352h0Zm0-13.416q-7.311,0-11.653-4.773T68.054,31.392q0-8.083,4.343-12.814t11.653-4.73a14.881,14.881,0,0,1,11.567,4.773q4.342,4.773,4.343,12.771,0,7.913-4.343,12.728A14.813,14.813,0,0,1,84.05,48.936h0ZM138.659,1.378H123.953V61.75h33.97V50.4H138.659V1.378Zm68.284,0-15.05,45.58L176.929,1.378H161.277L182.691,61.75h18.4L222.509,1.378H206.943ZM266.454,13.16V1.378h-36.98V61.75h36.98V49.968H244.18V36.724h19.694V25.372H244.18V13.16h22.274ZM299.477,1.378H276.859V61.75h22.618a35.174,35.174,0,0,0,16.641-3.784A26.9,26.9,0,0,0,327.212,47.3a31.274,31.274,0,0,0,3.913-15.738,31.214,31.214,0,0,0-3.913-15.781A27.052,27.052,0,0,0,316.161,5.162a35.125,35.125,0,0,0-16.684-3.784h0Zm-0.946,47.644h-6.966V13.934h6.966q8.34,0,12.986,4.644t4.644,12.986q0,8.343-4.644,12.9t-12.986,4.558h0Z"/>
</svg>

                  `}
              />
              <spacer />
              <spacer />
              <spacer />
              <spacer />
              <spacer />
              <spacer />
            </vstack>
          )}
          {solveTime && (
            <vstack alignment="center middle" width={"100%"}>
              <vstack
                alignment="center middle"
                minWidth={"200px"}
                backgroundColor="#fcf7e9"
                cornerRadius="small"
                padding="xsmall"
              >
                <text size="xlarge" weight="bold" color="#6e6d6a">
                  YOUR TIME: {solveTime ?? "Not solved yet"}
                </text>
              </vstack>
            </vstack>
          )}
          {solveTime && averageSolveTime && <spacer />}
          {solveTime && averageSolveTime && (
            <vstack alignment="center middle" width={"100%"}>
              <vstack
                alignment="center middle"
                minWidth={"180px"}
                backgroundColor="#fcf7e9"
                cornerRadius="small"
                padding="xsmall"
              >
                <text size="xlarge" weight="bold" color="#6e6d6a">
                  AVG TIME: {averageSolveTime ?? "Not solved yet"}
                </text>
              </vstack>
            </vstack>
          )}

          {dailyId && !averageSolveTime && (
            <vstack alignment="start middle">
              <text size="medium" color="#6e6d6a" weight="bold">
                Be the first to solve todays puzzle!
              </text>
              <spacer />
            </vstack>
          )}
          {dailyId && !solveTime && averageSolveTime && (
            <vstack alignment="start middle">
              <text size="medium" color="#6e6d6a" weight="bold">
                AVG TIME: {averageSolveTime}
              </text>
              <spacer />
            </vstack>
          )}
          {dailyId && !solveTime && (
            <vstack
              alignment="center middle"
              width="50%"
              minWidth={"200px"}
              maxWidth={"200px"}
              padding="small"
              backgroundColor="#1a282d"
              cornerRadius="large"
              onPress={onShowWebviewClick}
            >
              <text size="large" weight="bold" color="#fcf7e9">
                SOLVE
              </text>
            </vstack>
          )}

          {!dailyId && (
            <vstack alignment="center middle" width={"100%"}>
              <text size="medium" color="#6e6d6a" weight="bold">
                Pick a difficulty level to start
              </text>
              <spacer />
              <vstack
                alignment="center middle"
                width="50%"
                minWidth={"200px"}
                maxWidth={"275px"}
                padding="small"
                backgroundColor="#1a282d"
                cornerRadius="large"
                onPress={onShowWebviewEasyClick}
              >
                <text size="large" weight="bold" color="#fcf7e9">
                  Warm-Up
                </text>
              </vstack>

              <spacer />
              <vstack
                alignment="center middle"
                width="50%"
                minWidth={"200px"}
                maxWidth={"275px"}
                padding="small"
                backgroundColor="#1a282d"
                cornerRadius="large"
                onPress={onShowWebviewMediumClick}
              >
                <text size="large" weight="bold" color="#fcf7e9">
                  Challenger
                </text>
              </vstack>

              <spacer />
              <vstack
                alignment="center middle"
                width="50%"
                minWidth={"200px"}
                maxWidth={"275px"}
                padding="small"
                backgroundColor="#1a282d"
                cornerRadius="large"
                onPress={onShowWebviewHardClick}
              >
                <text size="large" weight="bold" color="#fcf7e9">
                  Master
                </text>
              </vstack>
            </vstack>
          )}
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? "100%" : "0%"}>
          <vstack height={webviewVisible ? "100%" : "0%"}>
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
