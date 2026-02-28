import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { extractActionItems } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const actionsSchema = z.object({
  text: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { text } = actionsSchema.parse(body);

    const actionItems = await extractActionItems(text);

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: "extract_actions",
        tokensUsed: Math.ceil(text.length / 4),
      },
    });

    return NextResponse.json({ actions: actionItems });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error extracting action items:", error);
    return NextResponse.json(
      { error: "Failed to extract action items" },
      { status: 500 }
    );
  }
}
