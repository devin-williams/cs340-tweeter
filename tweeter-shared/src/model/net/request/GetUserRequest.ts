import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest{
  token: string;
  alias: string;
}