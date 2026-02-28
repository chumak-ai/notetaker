import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function improveText(text: string, action: string): Promise<string> {
  const prompts: Record<string, string> = {
    improve: "Improve the following text by fixing grammar, spelling, and making it clearer:",
    formal: "Rewrite the following text in a formal tone:",
    casual: "Rewrite the following text in a casual, friendly tone:",
    professional: "Rewrite the following text in a professional business tone:",
    expand: "Expand on the following text with more detail and context:",
    shorten: "Make the following text more concise while keeping the key points:",
    simplify: "Simplify the following text to make it easier to understand:",
  };

  const prompt = prompts[action] || prompts.improve;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful writing assistant. Return only the improved text without any explanations or additional commentary.",
      },
      {
        role: "user",
        content: `${prompt}\n\n${text}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content || text;
}

export async function summarizeText(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that creates concise summaries. Create a brief summary (2-3 sentences) that captures the key points.",
      },
      {
        role: "user",
        content: `Summarize the following text:\n\n${text}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 200,
  });

  return response.choices[0].message.content || "";
}

export async function extractKeyPoints(text: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that extracts key points from text. Return ONLY a JSON array of strings, with each string being a key point. No other text or formatting.",
      },
      {
        role: "user",
        content: `Extract 3-5 key points from the following text:\n\n${text}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  const content = response.choices[0].message.content || "[]";
  try {
    return JSON.parse(content);
  } catch {
    // Fallback: split by newlines if not valid JSON
    return content.split("\n").filter((line) => line.trim().length > 0);
  }
}

export async function suggestTags(text: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that suggests relevant tags for text. Return ONLY a JSON array of 3-5 short, relevant tags (1-2 words each). No other text or formatting.",
      },
      {
        role: "user",
        content: `Suggest tags for the following text:\n\n${text}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 100,
  });

  const content = response.choices[0].message.content || "[]";
  try {
    return JSON.parse(content);
  } catch {
    // Fallback: extract words that might be tags
    return content
      .replace(/[\[\]"']/g, "")
      .split(/[,\n]/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, 5);
  }
}

export async function continueWriting(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a creative writing assistant. Continue the text in a natural way that maintains the same style and tone. Return only the continuation text without repeating what was already written.",
      },
      {
        role: "user",
        content: `Continue writing from here:\n\n${text}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return response.choices[0].message.content || "";
}

export async function extractActionItems(text: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that identifies action items and tasks from text. Return ONLY a JSON array of action items. No other text.",
      },
      {
        role: "user",
        content: `Extract action items from the following text:\n\n${text}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 300,
  });

  const content = response.choices[0].message.content || "[]";
  try {
    return JSON.parse(content);
  } catch {
    return content.split("\n").filter((line) => line.trim().length > 0);
  }
}
