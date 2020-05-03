import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { oobApi } from "../../api";
import OOBStep1 from "./OOBStep1";
import OOBIdCode from "../OOBIdCode";
import Redirect from "../Redirect";
import URLS from "reusable/lib/urls";
import Spinner from "reusable/lib/Spinner";
import styles from "./OOB.module.scss";

const OOB = ({ onCancel, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState(null);
  const [channels, setChannels] = useState([]);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    async function init() {
      let mounted = true;
      try {
        const resp = await oobApi.getStatus();
        if (!mounted) return;
        setLoading(false);
        setChannels(resp.data.channels);
      } catch (error) {
        setLoading(false);
        if (!error.response.data.errors)
          throw new Error("Unhandled error when getting OOB status.");
        handleError(error.response.data.errors[0]);
      }
    }
    init();
  }, []);

  function handleError(error) {
    const { code } = error;
    if (
      // Client change: lock responses and auth issues should redirect to logout per Joel.
      code === "Auth.OOB.ChallengeAnswer.Locked" ||
      code === "OOB.ChallengeRequest.Locked" ||
      code === "OOB.Unauthenticated"
    ) {
      return setRedirect(URLS.LOGOUT);
    }
    setError(error);
  }

  async function handlePostChallenge(channel, description, deliveryMethod) {
    setSelection(description);
    try {
      await oobApi.postChallenge(channel, deliveryMethod);
      // good. Challenge was created.
      // Now show step 2 so the user can enter the code that should
      // have just been sent to them out of band.
      window.scroll(0, 0);
      setStep(2);
    } catch (error) {
      if (!error.response.data.errors)
        throw new Error("Unhandled error when posting challenge to OOB.");
      handleError(error.response.data.errors[0]);
    }
  }

  async function handlePostIdCode(idCode) {
    try {
      await oobApi.postAnswer(idCode);
      return onComplete();
    } catch (error) {
      if (!error.response.data.errors)
        throw new Error("Unhandled error when posting ID code to OOB.");
      handleError(error.response.data.errors[0]);
    }
  }

  if (redirect) return <Redirect to={redirect} />;

  if (loading)
    return (
      <div className={styles.spinnerWrapper}>
        <Spinner center={false} />
      </div>
    );

  if (step === 1)
    return (
      <OOBStep1
        channels={channels}
        onCancel={onCancel}
        onSubmit={handlePostChallenge}
      />
    );

  if (step === 2)
    return (
      <OOBIdCode
        selection={selection}
        onSubmit={handlePostIdCode}
        oobError={error}
        clearError={() => setError(null)}
        onCancel={() => {
          setStep(1);
          setError(null);
          setSelection(null);
        }}
      />
    );
};

OOB.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default OOB;
