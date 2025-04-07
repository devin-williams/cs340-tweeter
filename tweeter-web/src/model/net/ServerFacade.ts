import {
  AuthToken,
  FollowerStatusRequest,
    FollowerStatusResponse,
    FollowRequest,
    FollowResponse,
    GetUserRequest,
    GetUserResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    PagedStatusItemRequest,
    PagedStatusItemResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    RegisterRequest,
    RegisterResponse,
    Status,
    TweeterRequest,
    TweeterResponse,
    UnfollowRequest,
    UnfollowResponse,
    User,
    UserCountRequest,
    UserCountResponse,
    UserDto,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://num8atl2fk.execute-api.us-west-2.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async getMoreFollowers(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/follower/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followers found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async getIsFollowerStatus(
      request: FollowerStatusRequest
    ): Promise<boolean> {
      const response = await this.clientCommunicator.doPost<
        FollowerStatusRequest,
        FollowerStatusResponse
      >(request, "/follower/status");
  
      // Handle errors    
      if (response.success) {
        return response.isFollower;
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async getFollowerCount(
      request: UserCountRequest
    ): Promise<number> {
      const response = await this.clientCommunicator.doPost<
        UserCountRequest,
        UserCountResponse
      >(request, "/follower/count");
  
      // Handle errors    
      if (response.success) {
        return response.count;
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async getFolloweeCount(
      request: UserCountRequest
    ): Promise<number> {
      const response = await this.clientCommunicator.doPost<
        UserCountRequest,
        UserCountResponse
      >(request, "/followee/count");
  
      // Handle errors    
      if (response.success) {
        return response.count;
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async follow(
      request: FollowRequest
    ): Promise<[number, number]> {
      const response = await this.clientCommunicator.doPost<
        FollowRequest,
        FollowResponse
      >(request, "/follow");
  
      // Handle errors    
      if (response.success) {
        return [response.followerCount, response.followeeCount];
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async unfollow(
      request: UnfollowRequest
    ): Promise<[number, number]> {
      const response = await this.clientCommunicator.doPost<
        UnfollowRequest,
        UnfollowResponse
      >(request, "/unfollow");
  
      // Handle errors    
      if (response.success) {
        return [response.followerCount, response.followeeCount];
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async getUser(
      request: GetUserRequest
    ): Promise<User> {
      const response = await this.clientCommunicator.doPost<
        GetUserRequest,
        GetUserResponse
      >(request, "/user/get_user");
  
      // Handle errors    
      if (response.success) {
        if (response.user == null) {
          throw new Error(`User not found`);
        }
        // Convert the UserDto returned by ClientCommunicator to a User
        const userDto: UserDto = response.user;
        // Convert the UserDto to a User
        // and return it
        return User.fromDto(userDto) as User;
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async login(
      request: LoginRequest
    ): Promise<[User, AuthToken]> {
      const response = await this.clientCommunicator.doPost<
        LoginRequest,
        LoginResponse
      >(request, "/user/login");
  
      // Handle errors    
      if (response.success) {
        if (response.user == null) {
          throw new Error(`User not found`);
        }
        // Convert the UserDto returned by ClientCommunicator to a User
        const userDto: UserDto = response.user;
        
        const auth: AuthToken = new AuthToken(response.token, 0);

        return [ User.fromDto(userDto) as User, auth];  
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async register(
      request: RegisterRequest
    ): Promise<[User, AuthToken]> {
      const response = await this.clientCommunicator.doPost<
        RegisterRequest,
        RegisterResponse
      >(request, "/user/register");
  
      // Handle errors    
      if (response.success) {
        if (response.user == null) {
          throw new Error(`User not found`);
        }
        // Convert the UserDto returned by ClientCommunicator to a User
        const userDto: UserDto = response.user;

        const auth: AuthToken = new AuthToken(response.token, 0);
        return [ User.fromDto(userDto) as User, auth];  
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async logout(
      request: LogoutRequest
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        LogoutRequest,
        TweeterResponse
      >(request, "/user/logout");
  
      // Handle errors    
      if (response.success) {
        return;
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async loadMoreStoryItems(
      request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedStatusItemRequest,
        PagedStatusItemResponse
      >(request, "/status/story");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: Status[] | null =
        response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No story items found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async loadMoreFeedItems(
      request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedStatusItemRequest,
        PagedStatusItemResponse
      >(request, "/status/feed");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: Status[] | null =
        response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No feed items found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async postStatus(
      request: PostStatusRequest
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        PostStatusRequest,
        TweeterResponse
      >(request, "/status/post_status");
  
      // Handle errors    
      if (response.success) {
        return;
      } else {
        console.error(response);
        throw new Error(response.message ?? "Unknown error");
      }
    }
  }