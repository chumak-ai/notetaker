import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { suggestTags } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const tagsSchema = z.object({
  text: z.string().min(1),
  noteId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { text, noteId } = tagsSchema.parse(body);

    const tags = await suggestTags(text);

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: "auto_tag",
        tokensUsed: Math.ceil(text.length / 4),
      },
    });

    // Optionally update the note with suggested tags
    if (noteId) {
      await prisma.note.update({
        where: { id: noteId },
        data: { tags },
      });
    }

    return NextResponse.json({ tags });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error suggesting tags:", error);
    return NextResponse.json(
      { error: "Failed to suggest tags" },
      { status: 500 }
    );
  }
}
