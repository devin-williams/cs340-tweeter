import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
  const service = new UserService();
  const [ user, token] = await service.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
  return {
    success: true,
    message: null,
    user: user,
    token: token
  };
}