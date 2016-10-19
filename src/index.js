import AWS from 'aws-sdk';
const s3bucket = new AWS.S3({ params: { Bucket: aws.s3.bucket } });

export function imageHandler (event, context, callback) {
  const { Records } = event;

  Records.forEach(item => {

  });

  callback(null, { ok: 'did stuff', event });
}
