import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse {
  user: UserDto;
  token: string;
}