import { Devvit, JobContext } from "@devvit/public-api";
import { createPuzzle, encodePuzzle } from "../game/utils/gridUtils.js";

// #region loading template

// #endregion

const createAndSavePuzzle = async (
  context: JobContext,
  difficulty: "easy" | "medium" | "hard"
) => {
  const puzzle = createPuzzle(8, null, difficulty);
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
    title: `Daily ${`${difficulty[0].toUpperCase()}${difficulty.slice(
      1
    )}`} Puzzle - #${current}`,
    text: "Today's puzzle is ready!",
    preview: (
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
    ),
  });
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
      title: "Element Synergy - Practice your skills!",
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
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
      ),
    });
    ui.showToast({ text: "Created post!" });
    ui.navigateTo(post);
  },
});

Devvit.addMenuItem({
  label: "Create Daily Challenge Easy Post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { ui } = context;
    const difficulty = "easy";
    const { current: currentId } = await createAndSavePuzzle(
      context,
      difficulty
    );
    await submitDailyPuzzle(context, currentId, difficulty);
    ui.showToast({ text: "Created daily post!" });
  },
});

Devvit.addMenuItem({
  label: "Create Daily Challenge Medium Post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { ui } = context;
    const difficulty = "medium";
    const { current: currentId } = await createAndSavePuzzle(
      context,
      difficulty
    );
    await submitDailyPuzzle(context, currentId, difficulty);
    ui.showToast({ text: "Created daily post!" });
  },
});

Devvit.addMenuItem({
  label: "Create Daily Challenge Hard Post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { ui } = context;
    const difficulty = "hard";
    const { current: currentId } = await createAndSavePuzzle(
      context,
      difficulty
    );
    await submitDailyPuzzle(context, currentId, difficulty);
    ui.showToast({ text: "Created daily post!" });
  },
});

Devvit.addMenuItem({
  label: "Create Recurring Daily Challenge Easy Post",
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
        cron: "03 07 * * *", //"0 12 * * *",
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
  label: "Create Recurring Daily Challenge Medium Post",
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
        cron: "02 07 * * *", //"0 12 * * *",
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
  label: "Create Recurring Daily Challenge Hard Post",
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
        cron: "01 07 * * *", //"0 12 * * *",
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
