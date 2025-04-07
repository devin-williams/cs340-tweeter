import { LogoutRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  await new UserService().logout(request.token);
    return {
        success: true,
        message: null
    };
}