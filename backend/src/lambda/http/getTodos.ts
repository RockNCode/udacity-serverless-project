import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = createDynamoDbClient();

const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event', event)
  // Testing purposes, to be extracted from JWT token
  const userId = "mgarcia"
  const result = await docClient.query({
      TableName : todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()

  if (result.Count !== 0) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Items)
    }
  }

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}

function createDynamoDbClient(){
  if(process.env.IS_OFFLINE) {
    console.log("Creating a local dynamo db instance")
    return new AWS.DynamoDB.DocumentClient({
      region : 'localhost',
      endpoint : 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient();
}