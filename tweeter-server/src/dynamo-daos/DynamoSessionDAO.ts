import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ISessionDAO } from "../dao-interface/ISessionDAO";

const TABLE_NAME = "session"; // Partition key: token

export class DynamoSessionDAO implements ISessionDAO {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async storeToken(token: string, alias: string): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          token,
          alias,
          createdAt: Date.now(), 
          expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours from now
        },
      })
    );
  }

  async isTokenValid(token: string): Promise<boolean> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    const isValid = !!result.Item && result.Item.expiresAt > Math.floor(Date.now() / 1000);

    if (!isValid) {
      throw new Error("[Bad Request] Invalid token.");
    }

    return !!result.Item;
  }

  async deleteToken(token: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }

  async getAliasForToken(token: string): Promise<string> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!result.Item) {
      throw new Error("Invalid or expired token.");
    }

    return result.Item.alias;
  }
}
