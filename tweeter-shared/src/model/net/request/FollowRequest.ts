import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest{
    token: string;
    userToFollowAlias: string;
}