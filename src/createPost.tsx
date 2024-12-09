import { Devvit, JobContext } from "@devvit/public-api";
import { createPuzzle, encodePuzzle } from "../game/utils/gridUtils.js";
import Constraint from "../game/models/constraint.js";

const createAndSavePuzzle = async (
  context: JobContext,
  difficulty: "easy" | "medium" | "hard"
) => {
  const puzzle = createPuzzle(
    8,
    [
      new Constraint({ row: 1, col: 0 }, { row: 1, col: 1 }),
      new Constraint({ row: 3, col: 5 }, { row: 4, col: 5 }),
      new Constraint({ row: 5, col: 3 }, { row: 5, col: 4 }),
    ],
    difficulty
  );
  console.log("Created puzzle:", puzzle);
  const encodedPuzzle = encodePuzzle(puzzle);

  // const today = new Date().toISOString().split("T")[0]; // Get today's date as a string
  const previousCount =
    (await context.redis.get(`${difficulty}_puzzle_count`)) || 0;
  const current = Number(previousCount) + 1;

  await context.redis.set(`${difficulty}_puzzle_count`, current.toString());
  await context.redis.set(`${difficulty}_puzzle:${current}`, encodedPuzzle);

  return { current };
};

const submitDailyPuzzle = async (
  context: JobContext,
  current: number,
  difficulty: "easy" | "medium" | "hard"
) => {
  const subreddit = await context.reddit.getCurrentSubreddit();
  const post = await context.reddit.submitPost({
    subredditName: subreddit.name,
    title: `Daily ${difficulty} Puzzle - #${current}`,
    text: "Today's puzzle is ready!",
    preview: (
      <vstack height="100%" width="100%" alignment="middle center">
        <text size="large">Loading ...</text>
      </vstack>
    ),
  });
  console.log("Posted daily puzzle:", post);
};
// Configure Devvit's plugins
Devvit.configure({
  redditAPI: true,
});

// #region Job Definitions
Devvit.addSchedulerJob({
  name: "daily_easy_puzzle",
  onRun: async (event, context) => {
    const difficulty = "easy";
    const { current: currentId } = await createAndSavePuzzle(
      context,
      difficulty
    );
    await submitDailyPuzzle(context, currentId, difficulty);
  },
});

Devvit.addSchedulerJob({
  name: "daily_medium_puzzle",
  onRun: async (event, context) => {
    const difficulty = "medium";
    const { current: currentId } = await createAndSavePuzzle(
      context,
      difficulty
    );
    await submitDailyPuzzle(context, currentId, difficulty);
  },
});

Devvit.addSchedulerJob({
  name: "daily_hard_puzzle",
  onRun: async (event, context) => {
    const difficulty = "medium";
    const { current: currentId } = await createAndSavePuzzle(
      context,
      difficulty
    );
    await submitDailyPuzzle(context, currentId, difficulty);
  },
});

// #endregion

// #region Menu Items
Devvit.addMenuItem({
  label: "Create Element Synergy Post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: "Webview Example",
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: "Created post!" });
    ui.navigateTo(post);
  },
});

Devvit.addMenuItem({
  label: "Create Recurring Easy Element Synergy Post",
  forUserType: "moderator",
  location: "subreddit",
  onPress: async (_, context) => {
    try {
      const savedJobId = await context.redis.get("easyPuzzleJobId");
      if (savedJobId) {
        context.ui.showToast({
          text: "Daily thread already scheduled, cancelling...",
        });
        await context.scheduler.cancelJob(savedJobId);
      }
      const jobId = await context.scheduler.runJob({
        // Run the job every day at 20:10
        cron: "0 25 11 * * *", //"0 12 * * *",
        name: "daily_easy_puzzle",
      });
      await context.redis.set("easyPuzzleJobId", jobId);
      context.ui.showToast({ text: "Scheduled daily thread!" });
    } catch (e) {
      console.log("error was not able to schedule:", e);
      throw e;
    }
  },
});

Devvit.addMenuItem({
  label: "Create Recurring Medium Element Synergy Post",
  forUserType: "moderator",
  location: "subreddit",
  onPress: async (_, context) => {
    try {
      const savedJobId = await context.redis.get("mediumPuzzleJobId");
      if (savedJobId) {
        context.ui.showToast({
          text: "Daily thread already scheduled, cancelling...",
        });
        await context.scheduler.cancelJob(savedJobId);
      }
      const jobId = await context.scheduler.runJob({
        // Run the job every day at 20:10
        cron: "0 59 09 * * *", //"0 12 * * *",
        name: "daily_medium_puzzle",
      });
      await context.redis.set("mediumPuzzleJobId", jobId);
      context.ui.showToast({ text: "Scheduled daily thread!" });
    } catch (e) {
      console.log("error was not able to schedule:", e);
      throw e;
    }
  },
});

Devvit.addMenuItem({
  label: "Create Recurring Hard Element Synergy Post",
  forUserType: "moderator",
  location: "subreddit",
  onPress: async (_, context) => {
    try {
      const savedJobId = await context.redis.get("hardPuzzleJobId");
      if (savedJobId) {
        context.ui.showToast({
          text: "Daily thread already scheduled, cancelling...",
        });
        await context.scheduler.cancelJob(savedJobId);
      }
      const jobId = await context.scheduler.runJob({
        // Run the job every day at 20:10
        cron: "0 59 09 * * *", //"0 12 * * *",
        name: "daily_hard_puzzle",
      });
      await context.redis.set("hardPuzzleJobId", jobId);
      context.ui.showToast({ text: "Scheduled daily thread!" });
    } catch (e) {
      console.log("error was not able to schedule:", e);
      throw e;
    }
  },
});

Devvit.addMenuItem({
  label: "Cancel All Cron Jobs",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (event, context) => {
    try {
      // Get all scheduled jobs
      const jobs = await context.scheduler.listJobs();

      // Filter for cron jobs
      const cronJobs = jobs.filter((job) => "cron" in job);

      if (cronJobs.length === 0) {
        context.ui.showToast("No cron jobs found to cancel.");
        return;
      }

      // Cancel each cron job
      for (const job of cronJobs) {
        await context.scheduler.cancelJob(job.id);
      }

      context.ui.showToast(`Cancelled ${cronJobs.length} cron job(s).`);
    } catch (error) {
      console.error("Error cancelling cron jobs:", error);
      context.ui.showToast("An error occurred while cancelling cron jobs.");
    }
  },
});

//

// #endregion
