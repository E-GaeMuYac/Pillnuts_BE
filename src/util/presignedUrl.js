const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

const s3 = new AWS.S3();

function createUrl(fileName) {
  const url = s3.getSignedUrl('putObject', {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Expires: 60 * 5,
    ContentType: 'image/*',
  });
  return url;
}

module.exports = createUrl;
