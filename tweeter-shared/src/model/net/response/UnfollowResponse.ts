import { TweeterResponse } from "./TweeterResponse";

export interface UnfollowResponse extends TweeterResponse {
    followerCount: number;
    followeeCount: number;
}