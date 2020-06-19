import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const utils = require("../utils.ts")

const docClient = utils.createDynamoDbClient();
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("Deleting id  : " + todoId)
  var params = {
  TableName:todosTable,
    Key : {
        "userId": "mgarcia",
        "todoId": todoId
    }
  };

  console.log("Attempting a conditional delete...");
  const result = await docClient.delete(params).promise()
  console.log(JSON.stringify(result))
  if (result.ConsumedCapacity == undefined) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ""
    }
  }
  // Item doesn't exist
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: 'Todo does not exist '
    })
  }

}
