/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Button from "reusable/lib/Button";
import Checkbox from "reusable/lib/Checkbox";
import ButtonGroup from "reusable/lib/ButtonGroup";
import URLS from "reusable/lib/urls";
import { clickTrack } from "reusable/lib/tracking";
import styles from "./EnrollSection.module.scss";
import Terms from "../Terms";
import ContactInfo from "../ContactInfo";

const TermsForm = (props) => {
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const ref = React.createRef();

  const handleChange = (event) => {
    setChecked(!checked);
    validate(event.target.checked);
  };

  const handleBlur = () => validate(checked);

  const validate = (_checked) => {
    setError(!_checked ? "Accepting terms & conditions is required." : null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validate(checked);
    if (!checked) {
      ref.current.focus();
      return;
    }
    props.enroll();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          id="acceptTermsAndConditions"
          name="acceptTermsAndConditions"
          onChange={handleChange}
          onBlur={handleBlur}
          checked={checked}
          error={error}
          ref={ref}
          aria-describedby="acceptTermsAndConditionsError"
        >
          I accept these terms and conditions
        </Checkbox>
      </div>
      <ButtonGroup>
        <Button
          type="submit"
          onClick={() => clickTrack("BANKAC_ZELLE_LANDING_CONTINUE_BTN")}
        >
          Continue
        </Button>
        <ButtonGroup.Link>
          <a
            href={URLS.ACCOUNT_CENTER_HOME_PAGE}
            onClick={() => clickTrack("BANKAC_ZELLE_LANDING_CANCEL_LNK")}
          >
            Cancel
          </a>
        </ButtonGroup.Link>
      </ButtonGroup>
    </form>
  );
};

const TermsAndConditions = (props) => (
  <div className="container-fluid pl-0 pr-0 mt-30">
    <div className="row mb-30">
      <div className="col-sm">
        <Terms />
      </div>
    </div>
    <div className="row">
      <div className="col-sm">
        <TermsForm enroll={props.enroll} />
      </div>
    </div>
  </div>
);

const EnrollSection = (props) => {
  return (
    <>
      <ContactInfo
        profile={props.profile}
        tmxId={props.tmxId}
        setProfile={props.setProfile}
        showAlert={props.showAlert}
      />
      <TermsAndConditions enroll={props.enroll} />
    </>
  );
};

export default EnrollSection;
