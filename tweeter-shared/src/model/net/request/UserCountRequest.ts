import { TweeterRequest } from "./TweeterRequest";

export interface UserCountRequest extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
}