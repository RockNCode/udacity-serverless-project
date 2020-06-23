import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


export const s3 = new AWS.S3({signatureVersion: 'v4'})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const signedUrlExpireSeconds = 60 * 5;

  const s3Url = s3.getSignedUrl('putObject', {
    Bucket: process.env.IMAGES_S3_BUCKET,
    Key: todoId,
    Expires: signedUrlExpireSeconds,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({uploadUrl : s3Url})
  }
}
