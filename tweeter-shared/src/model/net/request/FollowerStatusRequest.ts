import { TweeterRequest } from "./TweeterRequest";

export interface FollowerStatusRequest extends TweeterRequest{
    readonly token: string;
    readonly userAlias: string;
    readonly selectedAlias: string;
}