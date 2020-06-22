import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const utils = require("../utils.ts")

const docClient = utils.createDynamoDbClient();
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("Deleting id  : " + todoId)
  const userId = utils.getUserId(event);

  var params = {
  TableName:todosTable,
    Key : {
        "userId": userId,
        "todoId": todoId
    }
  };

  console.log("Attempting a conditional delete...");
  const result = await docClient.delete(params,function(err, data) {
    if (err)
      console.log('delete error ', err)
    else
      console.log('delete ok : ' + JSON.stringify(data))
  }
  ).promise()
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
