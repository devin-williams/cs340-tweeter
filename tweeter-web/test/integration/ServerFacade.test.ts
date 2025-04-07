import { ServerFacade } from "../../src/model/net/ServerFacade";
import { AuthToken, User } from "tweeter-shared";
import "isomorphic-fetch"

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  let authToken: AuthToken;
  let testUser: User;

  beforeAll(async () => {
    // Register a test user
    const [user, token] = await serverFacade.register({
      firstName: "Test",
      lastName: "User",
      alias: "@testuser",
      password: "password123",
      userImageBytes: "",
      imageFileExtension: "png",
    });

    testUser = user;
    authToken = token;
  });

  afterAll(async () => {
    // Logout the test user
    await serverFacade.logout({ token: authToken.token });
  });

  test("Register a new user", async () => {
    const [user, token] = await serverFacade.register({
      firstName: "John",
      lastName: "Doe",
      alias: "@allen",
      password: "password123",
      userImageBytes: "",
      imageFileExtension: "jpg",
    });

    expect(user.alias).toBe("@allen");
    expect(token.token).toBeDefined();
  });

  test("Get followers", async () => {
    const [followers, hasMore] = await serverFacade.getMoreFollowers({
      token: authToken.token,
      userAlias: testUser.alias,
      pageSize: 10,
      lastItem: null,
    });

    expect(Array.isArray(followers)).toBe(true);
    expect(typeof hasMore).toBe("boolean");
  });

  test("Get following count", async () => {
    const followeeCount = await serverFacade.getFolloweeCount({
      token: authToken.token,
      userAlias: testUser.alias,
    });

    expect(typeof followeeCount).toBe("number");
  });

  test("Get followers count", async () => {
    const followerCount = await serverFacade.getFollowerCount({
      token: authToken.token,
      userAlias: testUser.alias,
    });

    expect(typeof followerCount).toBe("number");
  });
});