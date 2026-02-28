import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { continueWriting } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const continueSchema = z.object({
  text: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { text } = continueSchema.parse(body);

    const continuation = await continueWriting(text);

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: "continue_writing",
        tokensUsed: Math.ceil((text.length + continuation.length) / 4),
      },
    });

    return NextResponse.json({ result: continuation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error continuing text:", error);
    return NextResponse.json(
      { error: "Failed to continue text" },
      { status: 500 }
    );
  }
}
