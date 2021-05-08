const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dxfdoreiy",
  api_key: "971192348998976",
  api_secret: "OZdvJrl0_f5iAM8iZ6DdXmd8oZM",
});

function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}
exports.uploadToCloudinary = uploadToCloudinary;
