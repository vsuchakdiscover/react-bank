import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import Modal from "reusable/lib/Modal";
import { ALERT_TYPES } from "reusable/lib/Alert";
import { clickTrack, pageTrack } from "reusable/lib/tracking";
import styles from "./ContactInfo.module.scss";
import xIcon from "../../images/x.svg";
import checkIcon from "../../images/check.svg";
import EditProfile from "../EditProfile";

// Discrete list of view statuses for this component
const VIEW = {
  CONTACT: "CONTACT",
  PROFILE: "PROFILE",
};

const ContactInfo = ({ profile, tmxId, setProfile, showAlert }) => {
  const [view, setView] = useState(VIEW.CONTACT);

  // Since contact info may be empty, only add to array if a value exists.
  // This way we don't show a label next to an empty value in the UI.
  function getPopulatedPhoneNumbersAndEmail() {
    const ret = [];
    if (profile.phoneNumbers.home) {
      ret.push({
        type: "Home Phone",
        value: profile.phoneNumbers.home.formatted,
        isMobile: profile.phoneNumbers.home.cell === true,
      });
    }

    if (profile.phoneNumbers.work) {
      ret.push({
        type: "Work Phone",
        value: profile.phoneNumbers.work.formatted,
        isMobile: profile.phoneNumbers.work.cell === true,
      });
    }

    if (profile.phoneNumbers.mobile) {
      ret.push({
        type: "Other Phone",
        value: profile.phoneNumbers.mobile.formatted,
        isMobile: profile.phoneNumbers.mobile.cell === true,
      });
    }

    if (profile.email) {
      ret.push({
        type: "Email",
        value: profile.email,
        isMobile: null,
      });
    }

    return ret;
  }

  function handleEditProfileComplete(profile) {
    setProfile(profile);
    setView(VIEW.CONTACT);
    showAlert(
      "Your Discover deposit account profile information has been updated.",
      ALERT_TYPES.SUCCESS
    );
  }

  return (
    <section className="container-fluid">
      <div className="row">
        <div className="col-sm">
          <h2 className={cx("meta-web-bold", styles.confirmTitle)}>
            To get started, verify your U.S. mobile phone number and email
            address
          </h2>
          <p className={cx("meta-web-normal", styles.confirmSubtitle)}>
            Here’s the information you have saved in your Discover deposit
            account profile. You&apos;ll use this information to enroll with{" "}
            <em>Zelle</em> on the next step.
          </p>
        </div>
      </div>
      <div className={styles.infoBox}>
        <div className={styles.contactInfoContainer}>
          <div className="row">
            <div className="col-4 offset-8">
              <p className={cx("meta-web-bold", "text-center")}>Mobile</p>
            </div>
          </div>
        </div>
        {getPopulatedPhoneNumbersAndEmail().map(({ type, value, isMobile }) => (
          <div className="row" key={type}>
            <div className={"col-8 " + styles.contactItem}>
              <strong>{type}</strong>:{" "}
              <div className={styles.contactItemValue}>{value}</div>
            </div>
            {type !== "Email" && (
              <div className="col-4">
                <img
                  className={styles.mobileIcon}
                  src={isMobile ? checkIcon : xIcon}
                  alt={isMobile ? "Check Icon" : "X Icon"}
                />
              </div>
            )}
          </div>
        ))}
        <div className="row">
          <div className="col-12">
            <p className={cx("meta-web-normal", styles.reviewCta)}>
              Do you want other <em>Zelle</em> users to be able to find you via
              your phone number? Make sure your information above correctly
              identifies your U.S. mobile number.
            </p>

            <Button
              className={styles.editBtn}
              onClick={() => {
                clickTrack("BANKAC_ZELLE_LANDING_EDIT_INFO_BTN");
                pageTrack("bankac/zelle-landing/edit-info-overlay");
                setView(VIEW.PROFILE);
              }}
              buttonStyle={BUTTON_TYPES.GHOST}
            >
              Edit Profile Information
            </Button>

            {view === VIEW.PROFILE && (
              <Modal
                aria-label="Edit Profile Modal"
                onClose={() => setView(VIEW.CONTACT)}
              >
                <EditProfile
                  onClickCancel={() => setView(VIEW.CONTACT)}
                  tmxId={tmxId}
                  onEditProfileComplete={handleEditProfileComplete}
                  setProfile={setProfile}
                  profile={profile}
                />
              </Modal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

ContactInfo.propTypes = {
  profile: PropTypes.object.isRequired,
  tmxId: PropTypes.string.isRequired,
  setProfile: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default ContactInfo;
