import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { IUserDAO } from "../dao-interface/IUserDAO";
import { UserDto } from "tweeter-shared";
import bcrypt from "bcryptjs";
import { IS3DAO } from "../dao-interface/IS3DAO";
import { v4 as uuidv4 } from "uuid";
import { ISessionDAO } from "../dao-interface/ISessionDAO";
import { DAOFactory } from "../DAOFactory/DAOFactory";

const TABLE_NAME = "user";

export class DynamoUserDAO implements IUserDAO {
  private docClient: DynamoDBDocumentClient;
  private s3DAO: IS3DAO;
  private sessionDAO: ISessionDAO;

  constructor(s3DAO: IS3DAO) {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.s3DAO = s3DAO;
    this.sessionDAO = DAOFactory.getSessionDAO();
  }

  async getUser(alias: string): Promise<UserDto | null> {
    
    alias = this.extractAlias(alias);

    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!result.Item) return null;

    return {
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      alias: result.Item.alias,
      imageUrl: result.Item.imageUrl,
    };
  }

  async login(alias: string, password: string): Promise<[UserDto, string]> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!result.Item) {
      // 👇 Regex expects "[Bad Request]" at the beginning
      throw new Error("[Bad Request] Invalid alias or password.");
    }
  
    const isPasswordValid = await bcrypt.compare(password, result.Item.password);
    if (!isPasswordValid) {
      throw new Error("[Bad Request] Invalid alias or password.");
    }

    const user: UserDto = {
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      alias: result.Item.alias,
      imageUrl: result.Item.imageUrl,
    };

    const token = uuidv4();
    await this.sessionDAO.storeToken(token, alias);

    return [user, token];
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    const existing = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );
    if (existing.Item) {
      throw new Error("[Bad Request] Alias already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageBuffer = Buffer.from(userImageBytes, "base64");
    // const imageUrl = await this.s3DAO.uploadProfileImage(alias, imageBuffer, imageFileExtension);
    const fileName = `${alias}_profile_pic${imageFileExtension}`;
    const imageUrl = await this.s3DAO.putImage(fileName, userImageBytes);

    const followerCount = 0;
    const followeeCount = 0;

    const newItem = {
      alias,
      firstName,
      lastName,
      password: hashedPassword,
      imageUrl,
      followerCount,
      followeeCount,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newItem,
      })
    );

    const userDto: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl,
    };

    const token = uuidv4();
    await this.sessionDAO.storeToken(token, alias);

    return [userDto, token];
  }

  async logout(token: string): Promise<void> {
    const isValid = await this.sessionDAO.isTokenValid(token);
    if (!isValid) {
      throw new Error("[Bad Request] Invalid token.");
    }

    await this.sessionDAO.deleteToken(token);
  }

  private extractAlias(possibleAlias: string): string {
    if (possibleAlias.includes("/")) {
      const parts = possibleAlias.split("/");
      return parts[parts.length - 1]; // take the last segment
    }
    return possibleAlias;
  }
  
}
