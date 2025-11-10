import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET - Fetch all passwords
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("passwordManager");
    const passwords = await db.collection("passwords").find({}).toArray();

    return NextResponse.json(passwords);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch passwords" },
      { status: 500 }
    );
  }
}

// POST - Save new password
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("passwordManager");

    const result = await db.collection("passwords").insertOne(body);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save password" },
      { status: 500 }
    );
  }
}

// DELETE - Delete password
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db("passwordManager");

    const result = await db.collection("passwords").deleteOne({ id: id });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete password" },
      { status: 500 }
    );
  }
}
