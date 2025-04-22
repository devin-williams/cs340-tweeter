import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import "isomorphic-fetch";

describe("StatusService Integration Tests", () => {
  const statusService = new StatusService();

  let authToken: AuthToken;
  const userAlias = "@daisy";

  beforeAll(async () => {
    // Simulate user login to get an auth token
    const [user, token] = await statusService["serverFacade"].login({
      alias: userAlias,
      password: "password",
    });
    authToken = token;
  });

  test("Successfully retrieve a user's story pages", async () => {
    const pageSize = 10;
    const lastItem: Status | null = null;

    // Call the loadMoreStoryItems method
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );

    // Verify the results
    expect(Array.isArray(storyItems)).toBe(true);
    expect(storyItems.length).toBeLessThanOrEqual(pageSize);
    expect(typeof hasMore).toBe("boolean");

    // Verify that each item in the storyItems array is a Status object
    storyItems.forEach((status) => {
      expect(status).toBeInstanceOf(Status);
      expect(status.post).toBeDefined(); 
      expect(status.user).toBeInstanceOf(User); 
      expect(status.timestamp).toBeDefined();
      expect(status.segments).toBeDefined();
    });
  });
});