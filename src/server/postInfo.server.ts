import { Context } from "@devvit/public-api";

export async function getPostInfo(postId: string, context: Context) {
  try {
    const post = await context.reddit.getPostById(postId);
    // console.log("Server post", post);
    return {
      title: post.title,
    };
  } catch (error) {
    console.error("Error fetching post info:", error);
    throw error;
  }
}
