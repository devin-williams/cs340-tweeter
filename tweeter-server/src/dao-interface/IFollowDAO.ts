import { UserDto } from "tweeter-shared";

export interface IFollowDAO {
    loadMoreFollowers(alias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
    loadMoreFollowees(alias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
    getIsFollowerStatus(alias: string, selectedUser: string): Promise<boolean>;
    follow(followerAlias: string, userToFollowAlias: string): Promise<[number, number]>;
    unfollow(followerAlias: string, userToUnfollowAlias: string): Promise<[number, number]>;
    getFollowerAliasesOnly(userAlias: string): Promise<string[]>;
}