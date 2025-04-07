import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowRequest extends TweeterRequest {
    token: string;
    userToUnfollowAlias: string;
}