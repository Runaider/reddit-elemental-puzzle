import "./createPost.js";

import { Devvit, useAsync, useState } from "@devvit/public-api";
import { getPostInfo } from "./server/postInfo.server.js";
// import { getPostInfo } from "./server/postInfo.server";
// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage = {
  type: "initialData";
  data: {
    username: string;
    encodedPuzzle?: string;
  };
};

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "Webview Example",
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

    const { data: difficulty } = useAsync<string | null>(
      async () => {
        if (postInfo) {
          return postInfo.title.split(" ")[1];
        }
        return null;
      },
      { depends: [postInfo] }
    );

    const { data: dailyId } = useAsync<string | null>(
      async () => {
        if (postInfo) {
          return postInfo.title.split(" - #")[1];
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
            console.log(`No puzzle ${difficulty}_puzzle:${dailyId}:`);
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

    console.log("Username:", username);
    console.log("Post info:", postInfo);
    console.log("Daily ID:", dailyId);
    console.log("Difficulty:", difficulty);
    console.log("Encoded puzzle:", encodedPuzzle);

    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case "initialData":
          console.log("Received initial data devvit:", msg.data);
        default:
          console.log("Unknown message type:", msg);
        // throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = async () => {
      console.log("Encoded puzzle in blocks:", encodedPuzzle);
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

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? "0%" : "100%"}
          alignment="middle center"
        >
          <text size="xlarge" weight="bold">
            Example App
          </text>
          <spacer />
          <vstack alignment="start middle">
            <hstack>
              <text size="medium">Username:</text>
              <text size="medium" weight="bold">
                {" "}
                {username ?? ""}
              </text>
            </hstack>
          </vstack>
          <spacer />
          <button onPress={onShowWebviewClick}>Launch App</button>
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
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
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
