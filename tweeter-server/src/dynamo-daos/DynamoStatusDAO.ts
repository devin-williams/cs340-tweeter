import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../dao-interface/IStatusDAO";
import { ISessionDAO } from "../dao-interface/ISessionDAO";
import { DAOFactory } from "../DAOFactory/DAOFactory";

const STORY_TABLE = "story";
const FEED_TABLE = "feed";

export class DynamoStatusDAO implements IStatusDAO {
  private docClient: DynamoDBDocumentClient;
  private sessionDAO: ISessionDAO;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.sessionDAO = DAOFactory.getSessionDAO();
  }

  async loadMoreStoryItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const isValid = await this.sessionDAO.isTokenValid(token);
    if (!isValid) throw new Error("Invalid token.");

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: STORY_TABLE,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: {
          ":alias": alias,
        },
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: lastItem ? { alias, timestamp: lastItem.timestamp } : undefined,
      })
    );

    const items: StatusDto[] = (result.Items ?? []).map((item) => ({
      post: item.post,
      user: item.user,
      timestamp: item.timestamp,
      segments: item.segments,
    }));

    return [items, !!result.LastEvaluatedKey];
  }

  async loadMoreFeedItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const isValid = await this.sessionDAO.isTokenValid(token);
    if (!isValid) throw new Error("Invalid token.");

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: FEED_TABLE,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: {
          ":alias": alias,
        },
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: lastItem ? { alias, timestamp: lastItem.timestamp } : undefined,
      })
    );

    const items: StatusDto[] = (result.Items ?? []).map((item) => ({
      post: item.post,
      user: item.user,
      timestamp: item.timestamp,
      segments: item.segments,
    }));

    return [items, !!result.LastEvaluatedKey];
  }

  async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const isValid = await this.sessionDAO.isTokenValid(token);
    if (!isValid) throw new Error("Invalid token.");

    console.log("Posting status:", newStatus);

    const alias = await this.sessionDAO.getAliasForToken(token);
    const timestamp = Date.now();

    const storyItem = {
      alias,
      timestamp,
      post: newStatus.post,
      user: newStatus.user,
      segments: newStatus.segments,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: STORY_TABLE,
        Item: storyItem,
      })
    );

    const followDAO = DAOFactory.getFollowDAO();
    const [followers] = await followDAO.loadMoreFollowers(token, alias, 10000, null);

    const writeRequests = followers.map((follower) => ({
      PutRequest: {
        Item: {
          alias: follower.alias,
          timestamp,
          post: newStatus.post,
          user: newStatus.user,
          segments: newStatus.segments,
        },
      },
    }));

    const batches = chunk(writeRequests, 25);
    for (const batch of batches) {
      await this.docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [FEED_TABLE]: batch,
          },
        })
      );
    }
  }
}

// Helper to chunk arrays for batch writes
function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
