import { NextRequest } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import { uploadToCloudinary } from "@/lib/helpers/cloudinary.helper";
import { extractRawText } from "@/lib/helpers/uploadFile.helper";

// Ensure Node.js runtime for compatibility
export const runtime = "nodejs";

// Disable Next.js's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const buffer = Buffer.from(await req.arrayBuffer());
    const tmpFilePath = `/tmp/uploaded-file`;
    fs.writeFileSync(tmpFilePath, buffer);

    const extractedText = await extractRawText({ buffer });

    const result = await uploadToCloudinary(tmpFilePath);

    fs.unlinkSync(tmpFilePath);

    return new Response(
      JSON.stringify({ url: result?.secure_url, extractedText: extractedText }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Upload failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
