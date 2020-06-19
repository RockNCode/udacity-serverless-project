import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const utils = require("../utils.ts");
const docClient = utils.createDynamoDbClient();

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  console.log(newTodo)
  // TODO: Implement creating a new TODO item
  const newItem = await createTodo(todoId, event);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem,
    })
  }
}

async function createTodo(todoId: string, event: any) {
  const newTodo = JSON.parse(event.body)
  console.log(event)
  const userId = "mgarcia" // temporary
  const item = {
    todoId,
    userId,
    ...newTodo
  }
  console.log('Storing new item: ', item)

  await docClient
    .put({
      TableName: todosTable,
      Item: item
    })
    .promise()

  return { item }
}

