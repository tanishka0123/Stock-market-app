import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";

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
          preferredIndustry 
        } 
      } = event;
      
      // Smart template-based personalization
      const goalMessages = {
        Growth: "maximize long-term growth",
        Income: "generate steady income",
        Preservation: "preserve and protect your capital",
        Balanced: "balance growth with stability",
      };

      const riskMessages = {
        Low: "conservative approach",
        Medium: "balanced strategy",
        High: "growth-focused mindset",
      };

      const goal = goalMessages[investmentGoals as keyof typeof goalMessages] || "investment goals";
      const risk = riskMessages[riskTolerance as keyof typeof riskMessages] || "investment approach";

      const introText = `Welcome to Signalist! As an investor focused on ${preferredIndustry} with a ${risk} to ${goal}, you now have access to real-time market insights and smart investment tools. Track your watchlist, receive personalized alerts, and make confident decisions backed by data.`;
      
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