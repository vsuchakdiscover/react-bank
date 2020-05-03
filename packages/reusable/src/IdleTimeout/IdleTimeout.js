import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import PropTypes from "prop-types";
import ButtonGroup from "../ButtonGroup";
import Button, { BUTTON_TYPES } from "../Button";
import H2 from "../Headers/H2";
import URLS from "../utils/urls";
import useInterval from "../hooks/useInterval";

const secondsToMilliseconds = (seconds) => {
  return seconds * 1000;
};

const IdleTimeout = ({
  secondsBeforeAutomaticLogout,
  logoutUrl,
  secondsBeforeWarning,
}) => {
  let isRedirecting = false;
  const [showModal, setShowModal] = useState(false);
  const [logoutCounter, setLogoutCounter] = useState(
    secondsBeforeAutomaticLogout
  );
  const [isLogoutRunning, setIsLogoutRunning] = useState(false);

  useInterval(
    () => {
      if (logoutCounter <= 0) {
        logoutUser();
      } else {
        setLogoutCounter(logoutCounter - 1);
      }
    },
    isLogoutRunning ? 1000 : null
  );
  const stayLoggedIn = () => {
    setShowModal(false);
    setIsLogoutRunning(false);
    setLogoutCounter(secondsBeforeAutomaticLogout);
  };

  const logoutUser = () => {
    if (process.env.NODE_ENV === "development") {
      // Stay logged for development purposes + storybook viewing
      stayLoggedIn();
      return alert(`In prod this redirects to ${logoutUrl}`);
    }
    // Only call the redirect once
    if (!isRedirecting) {
      isRedirecting = true;
      window.location = logoutUrl;
    }
  };

  const warn = () => {
    setShowModal(true);
    setIsLogoutRunning(true);
  };

  useEffect(() => {
    let warningTimer;
    const setTimeouts = () => {
      warningTimer = setTimeout(
        warn,
        secondsToMilliseconds(secondsBeforeWarning)
      );
    };
    const clearTimeouts = () => {
      if (warningTimer) clearTimeout(warningTimer);
    };

    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    const resetTimeout = () => {
      clearTimeouts();
      setTimeouts();
    };

    setTimeouts();
    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }

    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
        clearTimeouts();
      }
    };
  }, [secondsBeforeWarning]);

  let minutes = String(Math.floor(logoutCounter / 60));
  let leftoverSeconds = logoutCounter % 60;
  let seconds = String(Math.ceil(leftoverSeconds));
  if (minutes.length === 1) minutes = "0" + minutes;
  if (seconds.length === 1) seconds = "0" + seconds;

  return (
    <>
      {showModal && (
        <Modal
          aria-label="Session timeout warning"
          noBodyDismiss={true}
          onClose={() => setShowModal(false)}
          showCloseX={false}
        >
          <div className="meta-normal">
            <H2>Need More Time?</H2>
            <p>
              Your session is about to expire. You will be automatically logged
              out in.
            </p>
            <p>
              {minutes}:{seconds}
            </p>
            <p>To continue your session, select &quot;Stay Logged In&quot;</p>
            <ButtonGroup>
              <Button onClick={stayLoggedIn}>Stay logged in</Button>
              <ButtonGroup.Link>
                <Button buttonStyle={BUTTON_TYPES.LINK} onClick={logoutUser}>
                  Log out
                </Button>
              </ButtonGroup.Link>
            </ButtonGroup>
          </div>
        </Modal>
      )}
    </>
  );
};

IdleTimeout.propTypes = {
  /** Redirect URL to force logout */
  logoutUrl: PropTypes.string,

  /** Time in seconds before automatic logout */
  secondsBeforeAutomaticLogout: PropTypes.number,

  /** Time in seconds before warning modal shows */
  secondsBeforeWarning: PropTypes.number,
};

IdleTimeout.defaultProps = {
  logoutUrl: URLS.LOGOUT,
  secondsBeforeAutomaticLogout: 180,
  secondsBeforeWarning: 90,
};

export default IdleTimeout;
