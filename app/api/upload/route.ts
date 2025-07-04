import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { uploadToCloudinary } from "@/lib/helpers/cloudinary.helper";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({
        status: false,
        statusCode: 400,
        message: "No file uploaded",
        data: null,
      });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({
        status: false,
        statusCode: 400,
        message: "Only PDF files are allowed",
        data: null,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    // let extractedText: string;
    // try {
    //   extractedText = await extractFormattedText(buffer);
    // } catch (error) {
    //   console.error("Text extraction failed:", error);
    //   return NextResponse.json({
    //     status: false,
    //     statusCode: 500,
    //     message: "Failed to extract text from PDF",
    //     data: null,
    //   });
    // }

    // Upload to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(buffer);
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return NextResponse.json({
        status: false,
        statusCode: 500,
        message: "Failed to upload file to Cloudinary",
        data: null,
      });
    }

    if (!cloudinaryResult) {
      return NextResponse.json({
        status: false,
        statusCode: 500,
        message: "Failed to upload file to Cloudinary",
        data: null,
      });
    }

    const data = {
      url: cloudinaryResult.secure_url,
      // extractedText: extractedText,
      fileName: file.name,
    };

    return NextResponse.json({
      status: true,
      statusCode: 200,
      message: "File uploaded successfully",
      data: data,
    });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json({
      status: false,
      statusCode: 500,
      message: error.message || "Upload failed",
      data: null,
    });
  }
}
