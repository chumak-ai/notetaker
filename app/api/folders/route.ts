import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { z } from "zod";

const createFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

// Helper function to build folder hierarchy
function buildFolderTree(folders: any[]): any[] {
  const folderMap = new Map();
  const rootFolders: any[] = [];

  // First pass: create a map of all folders
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // Second pass: build the tree
  folders.forEach((folder) => {
    const folderNode = folderMap.get(folder.id);
    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(folderNode);
      }
    } else {
      rootFolders.push(folderNode);
    }
  });

  return rootFolders;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        parentId: true,
        color: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Build hierarchical structure
    const folderTree = buildFolderTree(folders);

    return NextResponse.json(folderTree);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { name, parentId, color } = createFolderSchema.parse(body);

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: user.id,
        parentId: parentId || null,
        color: color || null,
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
