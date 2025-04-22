import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import "isomorphic-fetch";

describe("StatusService Integration Tests", () => {
  const statusService = new StatusService();

  let authToken: AuthToken;
  const userAlias = "@daisy"; 
  const password = "password";    
  let user: User;

  beforeAll(async () => {
    const [loggedInUser, token] = await statusService["serverFacade"].login({
      alias: userAlias,
      password,
    });
    user = loggedInUser;
    authToken = token;
  });

  test("Post a status and verify it is appended to the user's story", async () => {

    const newStatus = new Status(
        "This is a test status!",
        user,
        Date.now(),
      );
      

    const postResponse = await statusService.postStatus(authToken, newStatus);

    expect(postResponse).toBe("Status Posted!");

    const pageSize = 10;
    const lastItem: Status | null = null;
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );

    const postedStatus = storyItems.find(
      (status) =>
        status.post === newStatus.post &&
        status.user.alias === newStatus.user.alias
    );

    expect(postedStatus).toBeDefined();
    expect(postedStatus?.post).toBe(newStatus.post);
    expect(postedStatus?.user.alias).toBe(newStatus.user.alias);
    expect(postedStatus?.segments).toEqual(newStatus.segments);
  });
});
