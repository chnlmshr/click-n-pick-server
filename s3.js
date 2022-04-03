require("dotenv").config();

const aws = require("aws-sdk"),
  region = "ap-south-1",
  bucketName = "clickpick-poducts",
  accessKeyId = process.env.ACCESS_KEY_ID,
  secretAccessKey = process.env.SECRET_ACCESS_KEY,
  crypto = require("crypto"),
  { promisify } = require("util");

const randomBytes = promisify(crypto.randomBytes);

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

module.exports = {
  generateUploadURL: async () => {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString("hex");
    const params = { Bucket: bucketName, Key: imageName, Expires: 300 };
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    return uploadUrl;
  },
};
