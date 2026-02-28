import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().default(""),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");
    const isFavorite = searchParams.get("isFavorite");
    const search = searchParams.get("search");

    const where: any = {
      userId: user.id,
      isArchived: false,
    };

    if (folderId) {
      where.folderId = folderId;
    }

    if (isFavorite === "true") {
      where.isFavorite = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        isFavorite: true,
        isPinned: true,
        folderId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { title, content, folderId, tags } = createNoteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: user.id,
        folderId: folderId || null,
        tags: tags || [],
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
