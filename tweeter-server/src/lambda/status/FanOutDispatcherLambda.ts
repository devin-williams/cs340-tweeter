import { SQSEvent } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DAOFactory } from "../../DAOFactory/DAOFactory";

const sqsClient = new SQSClient({});
const FEED_WRITE_QUEUE_URL = "https://sqs.us-west-2.amazonaws.com/061039782038/FeedWriteQueue";
const BATCH_SIZE = 500;

export const handler = async (event: SQSEvent): Promise<void> => {
  const followDao = DAOFactory.getFollowDAO();

  for (const record of event.Records) {
    console.log("Processing record:", record);
    const message = JSON.parse(record.body);
    const { authorAlias, timestamp, post, user, segments } = message;

    console.log("Message content:", message);
    console.log("Author alias:", authorAlias);
    
    const followerAliases = (await followDao.getFollowerAliasesOnly(authorAlias))
    .filter(alias => alias !== authorAlias);
  

    console.log('Follower aliases:', followerAliases);
    if (followerAliases.length === 0) {
      console.log(`No followers for ${authorAlias}`);
      continue;
    }
    for (let i = 0; i < followerAliases.length; i += BATCH_SIZE) {
      const chunk = followerAliases.slice(i, i + BATCH_SIZE);

      const feedUpdateMessage = {
        followers: chunk,
        status: {
          authorAlias,
          timestamp,
          post,
          user,
          segments,
        },
      };

      console.log("Queue URL:", FEED_WRITE_QUEUE_URL);
      console.log("Feed update message:", feedUpdateMessage);

      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: FEED_WRITE_QUEUE_URL,
          MessageBody: JSON.stringify(feedUpdateMessage),
        })
      );
    }

    console.log(`Dispatched ${followerAliases.length} followers for ${authorAlias}`);
  }
};
