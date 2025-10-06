import { success } from "better-auth";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { getFormattedTodayDate } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    await step.run("send-welcome-email", async () => {
      const {
        data: {
          email,
          name,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      } = event;

      let introText = "";

      if (riskTolerance === "High") {
        introText = `<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
  Great to have you aboard! Since you're focused on <strong>${preferredIndustry}</strong> with a high-risk appetite, you'll enjoy discovering fast-moving opportunities aligned with your <strong>${investmentGoals}</strong>.</p>`;
      } else {
        introText = `<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
  Thanks for joining! Your interest in <strong>${preferredIndustry}</strong> and your <strong>${riskTolerance}</strong> approach make you perfectly suited to use our tools for smarter investing.</p>`;
      }

      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email process completed",
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
  },
  [
    { event: "app/send.daily.news" },
    { cron: "0 12 * * *" }, // Every  day at noon
  ],
  async ({ step }) => {
    //step1 get all users for news delivery
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);
    if (!users || users.length === 0)
      return { success: false, message: "No users found for news email" };

    //step2 fetch personalized news for each user
    const results = await step.run("fetch-user-news", async () => {
      const perUser = [];
      for (const user of users) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });

    //step3 summarize new via ai for each user
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

    for (const { user, articles } of results) {
      try {
        const newsContent = summarizeArticles(articles);
        userNewsSummaries.push({ user, newsContent });
      } catch (error) {
        console.error(
          "daily-news: error summarizing news for",
          user.email,
          error
        );
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    //step4 send email to each user
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;
          return await sendNewsSummaryEmail({
            email: user.email,
            date: getFormattedTodayDate(),
            newsContent,
          });
        })
      );
    });
    return { success: true, message: "Daily news summary process completed" };
  }
);

type Article = {
  headline: string;
  summary?: string;
  description?: string;
  url: string;
};

const summarizeArticles = (articles: Article[]) => {
  let html = `<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📊 Market Highlights</h3>`;

  for (const a of articles) {
    html += `
    <div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
      <h4 class="dark-text" style="font-size: 18px; font-weight: 600; color: #FDD458;">${
        a.headline
      }</h4>
      <p class="mobile-text dark-text-secondary" style="color: #CCDADC;">${
        a.summary || a.description || "No summary available."
      }</p>
      <div style="margin-top: 10px;"><a href="${
        a.url
      }" style="color: #FDD458; text-decoration: none;">Read Full Story →</a></div>
    </div>`;
  }
  return html;
};
