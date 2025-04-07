import { TweeterResponse } from "./TweeterResponse";

export interface FollowResponse extends TweeterResponse {
    followerCount: number;
    followeeCount: number;
}
    