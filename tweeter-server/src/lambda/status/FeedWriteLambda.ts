import { SQSEvent } from "aws-lambda";
import { DynamoDBClient, WriteRequest } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const FEED_TABLE = "feed";

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const { followers, status } = JSON.parse(record.body);

    const writeRequests: WriteRequest[] = followers.map((followerAlias: string) => ({
      PutRequest: {
        Item: {
          alias: followerAlias,
          timestamp: status.timestamp,
          post: status.post,
          user: status.user,
          segments: status.segments,
        },
      },
    }));

    const batches: WriteRequest[][] = chunk(writeRequests, 25);
    for (const batch of batches) {
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [FEED_TABLE]: batch,
          },
        })
      );
    }

    console.log(`Wrote feed entries for ${followers.length} followers`);
  }
};

function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
