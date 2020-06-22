import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
//import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
const utils = require("../utils.ts")
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = utils.createDynamoDbClient();
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updateData: UpdateTodoRequest = JSON.parse(event.body)
  const userId = utils.getUserId(event);

  console.log("Updating id  : " + todoId)
  var params = {
    TableName:todosTable,
    Key:{
        "userId": userId,
        "todoId": todoId
    },
    ExpressionAttributeNames: { "#myname": "name" },
    UpdateExpression: "set #myname = :taskname, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues:{
        ":taskname":updateData.name,
        ":dueDate":updateData.dueDate,
        ":done": updateData.done
    },
    ReturnValues:"UPDATED_NEW"
  };

  console.log("Updating the item...");
  const result = docClient.update(params).promise();
  console.log("Result is : " + JSON.stringify(result))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ""
  }

}
