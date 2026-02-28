import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { improveText } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const improveSchema = z.object({
  text: z.string().min(1),
  action: z.enum([
    "improve",
    "formal",
    "casual",
    "professional",
    "expand",
    "shorten",
    "simplify",
  ]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { text, action } = improveSchema.parse(body);

    const improvedText = await improveText(text, action);

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: `improve_${action}`,
        tokensUsed: Math.ceil((text.length + improvedText.length) / 4),
      },
    });

    return NextResponse.json({ result: improvedText });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error improving text:", error);
    return NextResponse.json(
      { error: "Failed to improve text" },
      { status: 500 }
    );
  }
}
