import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function uploadToCloudinary(filePath: any) {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);
    return result;
  } catch (error: any) {
    console.log(error.message);
  }
}
