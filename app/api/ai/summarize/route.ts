import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { summarizeText, extractKeyPoints } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const summarizeSchema = z.object({
  text: z.string().min(1),
  type: z.enum(["summary", "keypoints"]).default("summary"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { text, type } = summarizeSchema.parse(body);

    let result;
    if (type === "keypoints") {
      result = await extractKeyPoints(text);
    } else {
      result = await summarizeText(text);
    }

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: `summarize_${type}`,
        tokensUsed: Math.ceil(text.length / 4),
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error summarizing text:", error);
    return NextResponse.json(
      { error: "Failed to summarize text" },
      { status: 500 }
    );
  }
}
