import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const utils = require("../utils.ts");
const docClient = utils.createDynamoDbClient();

const todosTable = process.env.TODOS_TABLE
const bucket = process.env.IMAGES_S3_BUCKET
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
      item : newItem,
    })
  }
}

async function createTodo(todoId: string, event: any) {
  const newTodo = JSON.parse(event.body)
  console.log(event)
  const userId = utils.getUserId(event);
  const item = {
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    ...newTodo,
    attachmentUrl: 'http://'+bucket+'.s3.amazonaws.com/'+todoId
  }

  console.log('Storing new item: ', item)

  await docClient
    .put({
      TableName: todosTable,
      Item: item
    })
    .promise()
    console.log("ITEM TO RETURN : " + JSON.stringify(item))
  return item
}

