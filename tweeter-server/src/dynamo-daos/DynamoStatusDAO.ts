import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../dao-interface/IStatusDAO";
import { ISessionDAO } from "../dao-interface/ISessionDAO";
import { DAOFactory } from "../DAOFactory/DAOFactory";

const STORY_TABLE = "story";
const FEED_TABLE = "feed";
const FANOUT_QUEUE_URL =
  "https://sqs.us-west-2.amazonaws.com/061039782038/FanOutBatchQueue";

export class DynamoStatusDAO implements IStatusDAO {
  private docClient: DynamoDBDocumentClient;
  private sessionDAO: ISessionDAO;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.sessionDAO = DAOFactory.getSessionDAO();
  }

  async loadMoreStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: STORY_TABLE,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: {
          ":alias": alias,
        },
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: lastItem
          ? { alias, timestamp: lastItem.timestamp }
          : undefined,
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
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: FEED_TABLE,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: {
          ":alias": alias,
        },
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: lastItem
          ? { alias, timestamp: lastItem.timestamp }
          : undefined,
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

  async postStatus(alias: string, newStatus: StatusDto): Promise<void> {

    console.log("Posting status:", newStatus);

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

    // 2. Push a single fan-out message to the first SQS queue
    const sqsClient = new SQSClient({});
    const message = {
      authorAlias: alias,
      timestamp,
      post: newStatus.post,
      user: newStatus.user,
      segments: newStatus.segments,
    };

    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: FANOUT_QUEUE_URL,
        MessageBody: JSON.stringify(message),
      })
    );

    // const followDAO = DAOFactory.getFollowDAO();
    // const [followers] = await followDAO.loadMoreFollowers(token, alias, 10000, null);

    // const BATCH_SIZE = 500;
    // const batches = chunk(followers, BATCH_SIZE);
    // const sqsClient = new SQSClient({});

    // for (const batch of batches) {
    //   const message = {
    //     authorAlias: alias,
    //     timestamp,
    //     post: newStatus.post,
    //     user: newStatus.user,
    //     segments: newStatus.segments,
    //     followerBatch: batch.map((f) => f.alias),
    //   };

    //   await sqsClient.send(
    //     new SendMessageCommand({
    //       QueueUrl: FANOUT_QUEUE_URL,
    //       MessageBody: JSON.stringify(message),
    //     })
    //   );

    // const writeRequests = followers.map((follower) => ({
    //   PutRequest: {
    //     Item: {
    //       alias: follower.alias,
    //       timestamp,
    //       post: newStatus.post,
    //       user: newStatus.user,
    //       segments: newStatus.segments,
    //     },
    //   },
    // }));

    // const batches = chunk(writeRequests, 25);
    // for (const batch of batches) {
    //   await this.docClient.send(
    //     new BatchWriteCommand({
    //       RequestItems: {
    //         [FEED_TABLE]: batch,
    //       },
    //     })
    //   );
  }
}

// Helper to chunk arrays for batch writes
function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
