import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
  BatchGetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { IFollowDAO } from "../dao-interface/IFollowDAO";
import { ISessionDAO } from "../dao-interface/ISessionDAO";
import { DAOFactory } from "../DAOFactory/DAOFactory";

const TABLE_NAME = "follow";
const USER_TABLE = "user";
const INDEX_NAME = "follow_index";

export class DynamoFollowDAO implements IFollowDAO {
  private docClient: DynamoDBDocumentClient;
  private sessionDAO: ISessionDAO;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.sessionDAO = DAOFactory.getSessionDAO();
  }

  public async loadMoreFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // Prepare the pagination key
    const exclusiveStartKey = lastItem?.alias
      ? {
          followee_handle: userAlias,
          follower_handle: lastItem.alias,
        }
      : undefined;

    
    console.log("loadMoreFollowers - ExclusiveStartKey:", exclusiveStartKey);

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        Limit: pageSize,
        ExclusiveStartKey: exclusiveStartKey
        // lastItem?.alias
        //   ? {
        //       followee_handle: userAlias,
        //       follower_handle: lastItem.alias,
        //     }
        //   : undefined,
      })
    );

    console.log("LastEvaluatedKey:", result.LastEvaluatedKey);

    const followerHandles = (result.Items ?? []).map(
      (item) => item.follower_handle
    );

    if (followerHandles.length === 0) return [[], false];

    const userResult = await this.docClient.send(
      new BatchGetCommand({
        RequestItems: {
          user: {
            Keys: followerHandles.map((alias) => ({ alias })),
          },
        },
      })
    );

    const users: UserDto[] =
      userResult.Responses?.user.map((item) => ({
        alias: item.alias,
        firstName: item.firstName,
        lastName: item.lastName,
        imageUrl: item.imageUrl,
      })) ?? [];

    return [users, !!result.LastEvaluatedKey];
  }

  public async loadMoreFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "follower_handle = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        Limit: pageSize,
        ExclusiveStartKey: lastItem
          ? {
              follower_handle: userAlias,
              followee_handle: lastItem.alias,
            }
          : undefined,
      })
    );

    const followeeHandles = (result.Items ?? []).map(
      (item) => item.followee_handle
    );

    if (followeeHandles.length === 0) return [[], false];

    const userResult = await this.docClient.send(
      new BatchGetCommand({
        RequestItems: {
          user: {
            Keys: followeeHandles.map((alias) => ({ alias })),
          },
        },
      })
    );

    const users: UserDto[] =
      userResult.Responses?.user.map((item) => ({
        alias: item.alias,
        firstName: item.firstName,
        lastName: item.lastName,
        imageUrl: item.imageUrl,
      })) ?? [];

    return [users, !!result.LastEvaluatedKey];
  }

  // public async getFollowerCount(token: string, alias: string): Promise<number> {
  //   const isValid = await this.sessionDAO.isTokenValid(token);
  //   if (!isValid) throw new Error("Invalid token.");

  //   const result = await this.docClient.send(
  //     new QueryCommand({
  //       TableName: TABLE_NAME,
  //       IndexName: INDEX_NAME,
  //       KeyConditionExpression: "followee_handle = :alias",
  //       ExpressionAttributeValues: {
  //         ":alias": alias,
  //       },
  //       Select: "COUNT",
  //     })
  //   );

  //   return result.Count ?? 0;
  // }

  public async getFollowerCount(alias: string): Promise<number> {

    const result = await this.docClient.send(
      new GetCommand({
        TableName: USER_TABLE,
        Key: { alias },
        ProjectionExpression: "followerCount",
      })
    );

    return result.Item?.followerCount ?? 0;
  }

  // public async getFolloweeCount(token: string, alias: string): Promise<number> {
  //   const isValid = await this.sessionDAO.isTokenValid(token);
  //   if (!isValid) throw new Error("Invalid token.");

  //   const result = await this.docClient.send(
  //     new QueryCommand({
  //       TableName: TABLE_NAME,
  //       KeyConditionExpression: "follower_handle = :alias",
  //       ExpressionAttributeValues: {
  //         ":alias": alias,
  //       },
  //       Select: "COUNT",
  //     })
  //   );

  //   return result.Count ?? 0;
  // }

  public async getFolloweeCount(alias: string): Promise<number> {

    const result = await this.docClient.send(
      new GetCommand({
        TableName: USER_TABLE,
        Key: { alias },
        ProjectionExpression: "followeeCount",
      })
    );

    return result.Item?.followeeCount ?? 0;
  }

  public async getIsFollowerStatus(
    alias: string,
    selectedUser: string
  ): Promise<boolean> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: alias,
          followee_handle: selectedUser,
        },
      })
    );

    return !!result.Item;
  }

  // public async follow(token: string, userToFollowAlias: string): Promise<[number, number]> {
  //   const isValid = await this.sessionDAO.isTokenValid(token);
  //   if (!isValid) throw new Error("Invalid or expired token.");

  //   const followerAlias = await this.sessionDAO.getAliasForToken(token);

  //   await this.docClient.send(
  //     new PutCommand({
  //       TableName: TABLE_NAME,
  //       Item: {
  //         follower_handle: followerAlias,
  //         followee_handle: userToFollowAlias,
  //       },
  //     })
  //   );

  //   const followerCount = await this.getFollowerCount(token, userToFollowAlias);
  //   const followeeCount = await this.getFolloweeCount(token, userToFollowAlias);

  //   return [followerCount, followeeCount];
  // }
  public async follow(
    followerAlias: string,
    userToFollowAlias: string
  ): Promise<[number, number]> {
    // Add the follow relationship
    await this.docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          follower_handle: followerAlias,
          followee_handle: userToFollowAlias,
        },
      })
    );

    // Increment followeeCount for the follower
    await this.docClient.send(
      new UpdateCommand({
        TableName: "user",
        Key: { alias: followerAlias },
        UpdateExpression: "ADD followeeCount :inc",
        ExpressionAttributeValues: { ":inc": 1 },
      })
    );

    // Increment followerCount for the followee
    const followeeUpdate = await this.docClient.send(
      new UpdateCommand({
        TableName: "user",
        Key: { alias: userToFollowAlias },
        UpdateExpression: "ADD followerCount :inc",
        ExpressionAttributeValues: { ":inc": 1 },
        ReturnValues: "UPDATED_NEW",
      })
    );

    const updatedFollowerCount = followeeUpdate.Attributes?.followerCount ?? 0;

    // Optionally: fetch updated followeeCount for follower
    const followerResult = await this.docClient.send(
      new GetCommand({
        TableName: "user",
        Key: { alias: followerAlias },
        ProjectionExpression: "followeeCount",
      })
    );
    const updatedFolloweeCount = followerResult.Item?.followeeCount ?? 0;

    return [updatedFollowerCount, updatedFolloweeCount];
  }

  // public async unfollow(token: string, userToUnfollowAlias: string): Promise<[number, number]> {
  //   const isValid = await this.sessionDAO.isTokenValid(token);
  //   if (!isValid) throw new Error("Invalid or expired token.");

  //   const followerAlias = await this.sessionDAO.getAliasForToken(token);

  //   await this.docClient.send(
  //     new DeleteCommand({
  //       TableName: TABLE_NAME,
  //       Key: {
  //         follower_handle: followerAlias,
  //         followee_handle: userToUnfollowAlias,
  //       },
  //     })
  //   );

  //   const followerCount = await this.getFollowerCount(token, userToUnfollowAlias);
  //   const followeeCount = await this.getFolloweeCount(token, userToUnfollowAlias);

  //   return [followerCount, followeeCount];
  // }

  public async unfollow(
    followerAlias: string,
    userToUnfollowAlias: string
  ): Promise<[number, number]> {

    // Remove the follow relationship
    await this.docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: userToUnfollowAlias,
        },
      })
    );

    // Decrement followeeCount for the follower
    await this.docClient.send(
      new UpdateCommand({
        TableName: "user",
        Key: { alias: followerAlias },
        UpdateExpression: "ADD followeeCount :dec",
        ExpressionAttributeValues: { ":dec": -1 },
      })
    );

    // Decrement followerCount for the followee
    const followeeUpdate = await this.docClient.send(
      new UpdateCommand({
        TableName: "user",
        Key: { alias: userToUnfollowAlias },
        UpdateExpression: "ADD followerCount :dec",
        ExpressionAttributeValues: { ":dec": -1 },
        ReturnValues: "UPDATED_NEW",
      })
    );

    const updatedFollowerCount = followeeUpdate.Attributes?.followerCount ?? 0;

    // Optionally: fetch updated followeeCount for follower
    const followerResult = await this.docClient.send(
      new GetCommand({
        TableName: "user",
        Key: { alias: followerAlias },
        ProjectionExpression: "followeeCount",
      })
    );
    const updatedFolloweeCount = followerResult.Item?.followeeCount ?? 0;

    return [updatedFollowerCount, updatedFolloweeCount];
  }

  public async getFollowerAliasesOnly(userAlias: string): Promise<string[]> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        ProjectionExpression: "follower_handle",
      })
    );
  
    const aliases = (result.Items ?? []).map((item) => item.follower_handle);
    return aliases;
  }
  
}
