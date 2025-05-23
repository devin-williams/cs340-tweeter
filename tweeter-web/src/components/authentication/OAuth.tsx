import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useToastListener from "../toaster/ToastListenerHook";

interface Props {
  oAuthHeading: string;
}

const OAuth = (props: Props) => {
  const { displayInfoMessage } = useToastListener();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  return (
    <>
      <h1 className="h4 mb-3 fw-normal">Or</h1>
      <h1 className="h5 mb-3 fw-normal">{props.oAuthHeading}</h1>

      <div className="text-center mb-3">
        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Google registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="googleTooltip">Google</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "google"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Facebook registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="facebookTooltip">Facebook</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "facebook"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Twitter registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="twitterTooltip">Twitter</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "twitter"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "LinkedIn registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="linkedInTooltip">LinkedIn</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "linkedin"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Github registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="githubTooltip">GitHub</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "github"]} />
          </OverlayTrigger>
        </button>
      </div>
    </>
  );
};

export default OAuth;