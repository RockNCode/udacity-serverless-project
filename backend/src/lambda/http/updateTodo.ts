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

  console.log("Updating id  : " + todoId)
  var params = {
    TableName:todosTable,
    Key:{
        "userId": "mgarcia",
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
//   , function(err, data) {
//     if (err) {
//         console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
//     }
// }
}
