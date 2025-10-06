// test-openai-api.ts
// Run this file to test your OpenAI API connection
// Usage: npx tsx test-openai-api.ts

import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function testOpenAIAPI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log("🔍 Testing OpenAI API...\n");
  
  // Check if API key exists
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY not found in environment variables");
    console.log("   Add it to your .env file:");
    console.log("   OPENAI_API_KEY=sk-proj-...");
    console.log("\n   Get your API key at: https://platform.openai.com/api-keys\n");
    return;
  }
  
  console.log("✅ API Key found:", apiKey.substring(0, 20) + "...");
  
  const testPrompt = `Write a warm, personalized welcome message for a new user who just signed up for a stock market tracking app. The user is interested in technology stocks and has a moderate risk tolerance. Keep it under 100 words and make it friendly and encouraging.`;
  
  try {
    console.log("\n📡 Making request to OpenAI...");
    
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that writes personalized welcome emails for a stock market app called Signalist."
            },
            {
              role: "user",
              content: testPrompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      }
    );
    
    console.log("📊 Response Status:", response.status, response.statusText);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("\n❌ API Error:");
      console.error(JSON.stringify(data, null, 2));
      
      // Common error messages
      if (response.status === 401) {
        console.log("\n💡 401 Unauthorized - Your API key is invalid or expired.");
        console.log("   Get a new one at: https://platform.openai.com/api-keys");
      } else if (response.status === 429) {
        console.log("\n💡 429 Rate Limit - You've exceeded your quota or rate limit.");
        console.log("   Check your usage at: https://platform.openai.com/usage");
      } else if (response.status === 402) {
        console.log("\n💡 402 Payment Required - You need to add credits to your account.");
        console.log("   Add credits at: https://platform.openai.com/account/billing");
      } else if (data.error?.code === "insufficient_quota") {
        console.log("\n💡 Insufficient Quota - You need to add credits to your OpenAI account.");
        console.log("   Add credits at: https://platform.openai.com/account/billing");
      }
      return;
    }
    
    console.log("\n✅ Success! Generated text:");
    console.log("─".repeat(70));
    
    if (data.choices?.[0]?.message?.content) {
      const generatedText = data.choices[0].message.content.trim();
      console.log(generatedText);
      
      // Show token usage
      if (data.usage) {
        console.log("\n📊 Token Usage:");
        console.log(`   Prompt: ${data.usage.prompt_tokens} tokens`);
        console.log(`   Completion: ${data.usage.completion_tokens} tokens`);
        console.log(`   Total: ${data.usage.total_tokens} tokens`);
        
        // Estimate cost (gpt-3.5-turbo pricing)
        const inputCost = (data.usage.prompt_tokens / 1000) * 0.0015;
        const outputCost = (data.usage.completion_tokens / 1000) * 0.002;
        const totalCost = inputCost + outputCost;
        console.log(`   Estimated cost: $${totalCost.toFixed(6)}`);
      }
    } else {
      console.log("Unexpected response format:");
      console.log(JSON.stringify(data, null, 2));
    }
    
    console.log("─".repeat(70));
    console.log("\n🎉 Your OpenAI API is working correctly!");
    console.log("\n💡 Next steps:");
    console.log("   1. The generated text looks good!");
    console.log("   2. You can now use this in your Inngest function");
    console.log("   3. Remember: OpenAI charges per token used");
    
  } catch (error) {
    console.error("\n❌ Request failed:");
    if (error instanceof Error) {
      console.error("   Error:", error.message);
    } else {
      console.error("   Error:", error);
    }
    
    console.log("\n💡 Troubleshooting tips:");
    console.log("   1. Check your internet connection");
    console.log("   2. Verify your API key at https://platform.openai.com/api-keys");
    console.log("   3. Make sure you have credits in your OpenAI account");
    console.log("   4. Check if you're behind a firewall blocking OpenAI");
  }
}

// Run the test
testOpenAIAPI();