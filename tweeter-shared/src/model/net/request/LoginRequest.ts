import { TweeterRequest } from "./TweeterRequest";

export interface LoginRequest extends TweeterRequest {
  alias: string;
  password: string;
}