import { UserDto } from "tweeter-shared";

export interface IFollowDAO {
    loadMoreFollowers(token: string, alias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
    loadMoreFollowees(token: string, alias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
    getFollowerCount(token: string, alias: string): Promise<number>;
    getFolloweeCount(token: string, alias: string): Promise<number>;
    getIsFollowerStatus(token: string, alias: string, selectedUser: string): Promise<boolean>;
    follow(token: string, userToFollowAlias: string): Promise<[number, number]>;
    unfollow(token: string, userToUnfollowAlias: string): Promise<[number, number]>;
}