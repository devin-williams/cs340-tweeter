import useToastListener from "../toaster/ToastListenerHook";
import useUser from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUser();

  const listener: UserNavigationView = {
    displayErrorMessage,
    setDisplayedUser,
    getCurrentUser: () => currentUser,
    getAuthToken: () => authToken
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    await presenter.navigateToUser(event);
  };

  return {
    navigateToUser,
  };
};

export default useUserNavigation;