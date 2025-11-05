import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "tour-data.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading tour data:", error);
    return NextResponse.json(
      { error: "Failed to read tour data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = join(process.cwd(), "data", "tour-data.json");
    
    // Write the updated data to the file
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    
    return NextResponse.json({ success: true, message: "Tour data updated successfully" });
  } catch (error) {
    console.error("Error saving tour data:", error);
    return NextResponse.json(
      { error: "Failed to save tour data" },
      { status: 500 }
    );
  }
}

