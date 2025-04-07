import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(request.token, request.userAlias, request.selectedAlias);
    return {
        success: true,
        message: null,
        isFollower: isFollower
    };
}