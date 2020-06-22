import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const utils = require("../utils.ts")
const docClient = utils.createDynamoDbClient();

const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event', event)
  const userId = utils.getUserId(event);
  const result = await docClient.query({
      TableName : todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({items : result.Items})
  }

}
