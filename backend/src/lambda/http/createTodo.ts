import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = createDynamoDbClient();

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  //JSON.parse(event.body)
  console.log(newTodo)
  // TODO: Implement creating a new TODO item
  //return undefined
  const newItem = await createTodo(todoId, event);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem: newItem,
    })
  }
}

async function createTodo(todoId: string, event: any) {
  const createdAt = new Date().toISOString()
  const newTodo = JSON.parse(event.body)
  console.log(event)
  const newItem = {
    todoId,
    createdAt,
    ...newTodo
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()

  return newItem
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