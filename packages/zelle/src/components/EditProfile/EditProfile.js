/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OOB from "../OOB";
import Redirect from "../Redirect";
import { profileApi } from "../../api";
import { isValidPhone } from "reusable/lib/validators";
import Checkbox from "reusable/lib/Checkbox";
import TextInput from "reusable/lib/TextInput";
import PhoneInput from "reusable/lib/PhoneInput";
import HR from "reusable/lib/HR";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import Spinner from "reusable/lib/Spinner";
import Modal from "reusable/lib/Modal";
import H2 from "reusable/lib/H2";
import URLS from "reusable/lib/urls";
import { clickTrack } from "reusable/lib/tracking";
import styles from "./EditProfile.module.scss";

const VIEW = {
  OOB: "OOB",
  EDIT_PROFILE: "EDIT_PROFILE",
  REDIRECT_TO_LOGOUT: "REDIRECT_TO_LOGOUT",
};

const EditProfile = (props) => {
  const [view, setView] = useState(VIEW.EDIT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    email: "",
    confirmEmail: "",
    homePhone: "",
    homePhoneIsMobile: false,
    workPhone: "",
    workPhoneExt: "",
    workPhoneIsMobile: false,
    otherPhone: "",
    otherPhoneIsMobile: false,
  });

  // Initialize form state with profile passed in via props.
  useEffect(() => {
    if (!props.profile) return;
    const { email, phoneNumbers } = props.profile;
    // Only populated fields are returned from the server, so only add existing properties to the copy of the profile for local state.
    const initialProfile = {};
    if (email) {
      initialProfile.email = email;
      initialProfile.confirmEmail = email;
    }

    if (phoneNumbers.home) {
      initialProfile.homePhone = phoneNumbers.home.formatted;
      initialProfile.homePhoneIsMobile = phoneNumbers.home.cell === true;
    }

    if (phoneNumbers.work) {
      initialProfile.workPhone = phoneNumbers.work.formatted.split(" ")[0]; // Since ext may be included, but shown in separate fields.
      initialProfile.workPhoneExt = phoneNumbers.work.ext;
      initialProfile.workPhoneIsMobile = phoneNumbers.work.cell === true;
    }

    if (phoneNumbers.mobile) {
      // These 2 lines aren't typos. Per Joel, the mobile phone returned from API should be labeled as other in the UI.
      initialProfile.otherPhone = phoneNumbers.mobile.formatted;
      initialProfile.otherPhoneIsMobile = phoneNumbers.mobile.cell === true;
    }
    setProfile(initialProfile);
  }, [props.profile]);

  function onChange({ target }) {
    const isCheckbox = target.hasOwnProperty("checked");
    setProfile({
      ...profile,
      [target.name]: isCheckbox ? !profile[target.name] : target.value,
    });
  }

  function onCheckboxChange(event) {
    validate(event);
    onChange(event);
  }

  function isValid() {
    const _errors = {};
    const fields = [
      "email",
      "confirmEmail",
      "homePhone",
      "homePhoneIsMobile",
      "workPhone",
      "workPhoneIsMobile",
      "workPhoneExt",
      "otherPhone",
      "otherPhoneIsMobile",
    ];

    fields.forEach((field) => {
      // Create an object that mimics the browser event since validate expects an event.
      const fakeEvent = {
        target: {
          name: field,
          value: profile[field],
          checked: profile[field],
        },
      };
      const error = validate(fakeEvent);
      if (error) _errors[field] = error;
    });

    return Object.keys(_errors).length === 0;
  }

  function stripPhoneFormatting(phone) {
    return phone.replace(/[{\-() ]/g, "");
  }

  // Copy data from local state into the profile data structure passed in on props
  function getUpdatedProfile() {
    const updatedProfile = {
      ...props.profile,
      phoneNumbers: {},
    };
    if (props.profile.email) updatedProfile.email = profile.email;
    if (props.profile.phoneNumbers.home) {
      // countryCode is always 1 for now, per Joel
      updatedProfile.phoneNumbers.home = {
        category: "home",
        countryCode: "1",
        number: stripPhoneFormatting(profile.homePhone),
        cell: profile.homePhoneIsMobile,
      };
    }

    if (props.profile.phoneNumbers.work) {
      updatedProfile.phoneNumbers.work = {
        category: "work",
        countryCode: "1",
        number: stripPhoneFormatting(profile.workPhone),
        ext: profile.workPhoneExt,
        cell: profile.workPhoneIsMobile,
      };
    }

    if (props.profile.phoneNumbers.mobile) {
      // Other is returned as mobile, per Joel
      updatedProfile.phoneNumbers.mobile = {
        category: "mobile",
        countryCode: "1",
        number: stripPhoneFormatting(profile.otherPhone),
        cell: profile.otherPhoneIsMobile,
      };
    }

    return updatedProfile;
  }

  async function handleSubmit(event) {
    if (event) event.preventDefault();
    window.scroll(0, 0);
    if (!isValid()) return;

    const updatedProfile = getUpdatedProfile();

    try {
      setLoading(true);
      const resp = await profileApi.saveProfile(props.tmxId, updatedProfile);
      return props.onEditProfileComplete(resp.data);
    } catch (error) {
      // The call above may fail because OOB is required before saving.
      // Or, it may fail because the user's session has timed out.
      setView(
        error.response.data.errors &&
          error.response.data.errors[0].code === "General.AccessDenied.BankSA"
          ? VIEW.OOB
          : VIEW.REDIRECT_TO_LOGOUT
      );
    } finally {
      setLoading(false);
    }
  }

  function validate(event) {
    let error = null;

    const { value, name, checked } = event.target;

    // Note: Checking profile sent in on props to determine what fields should be required.
    // Only fields that exist on the profile sent in via props should be validated.
    switch (name) {
      case "email":
        if (
          props.profile.email &&
          (!value.includes("@") || !value.includes("."))
        ) {
          error = "Enter a valid email address (e.g., email@domain.com)";
        }
        break;

      case "confirmEmail":
        if (props.profile.email && profile.email !== value) {
          error = "Email Addresses must match.";
        }
        break;

      case "homePhone":
        if (props.profile.phoneNumbers.home && !isValidPhone(value)) {
          error = "Enter a 10-digit Home Phone number.";
        }
        break;

      case "homePhoneIsMobile":
        if (
          props.profile.phoneNumbers.home &&
          checked &&
          !isValidPhone(profile.homePhone)
        ) {
          error = "Enter a 10-digit Home Phone number.";
        }
        break;

      case "workPhone":
        if (props.profile.phoneNumbers.work && !isValidPhone(value)) {
          error = "Enter a 10-digit Work Phone number.";
        }
        break;

      case "workPhoneIsMobile":
        if (
          props.profile.phoneNumbers.work &&
          checked &&
          !isValidPhone(profile.workPhone)
        ) {
          error = "Enter a 10-digit Work Phone number.";
        }
        break;

      case "workPhoneExt":
        // Nothing to validate - Just here to avoid throwing an error for an unhandled field.
        break;

      case "otherPhone":
        if (props.profile.phoneNumbers.mobile && !isValidPhone(value)) {
          error = "Enter a 10-digit Other Phone number.";
        }
        break;

      case "otherPhoneIsMobile":
        if (
          props.profile.phoneNumbers.mobile &&
          checked &&
          !isValidPhone(profile.otherPhone)
        ) {
          error = "Enter a 10-digit Other Phone number.";
        }
        break;

      default:
        throw new Error("Unhandled field: " + name);
    }

    if (error) {
      setErrors((errors) => ({
        ...errors,
        [name]: error,
      }));
    } else {
      setErrors((errors) => {
        const errorsCopy = { ...errors };
        delete errorsCopy[name]; // remove any previous error since validation passed.
        return errorsCopy;
      });
    }
    return error;
  }

  function renderOob() {
    return (
      <Modal
        aria-label="For Your Added Security"
        onClose={() => setView(VIEW.CONTACT)}
      >
        <OOB onCancel={() => setView(VIEW.CONTACT)} onComplete={handleSubmit} />
      </Modal>
    );
  }

  function renderEditProfile() {
    return (
      <form onSubmit={handleSubmit}>
        <H2 className="mt-25">Edit Discover Deposit Account Profile</H2>
        <HR />
        <p>Any changes you make here will be saved to your profile.</p>

        {/* Only show fields below if they have a value returned from the server.
      That's why props is being used to determine if each field should display below.
      Per reqs, fields should be hidden if not currently populated.
      This way, user can only edit existing info. 
      More on why here: https://github.com/mcdpartners/react-bank/issues/116
      */}
        {props.profile.email && (
          <>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <TextInput
                  label="Email Address"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={onChange}
                  type="email"
                  error={errors.email}
                  onBlur={validate}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-6">
                <TextInput
                  label="Confirm Email Address"
                  id="confirmEmail"
                  name="confirmEmail"
                  value={profile.confirmEmail}
                  onChange={onChange}
                  error={errors.confirmEmail}
                  onBlur={validate}
                  type="email"
                />
              </div>
            </div>
          </>
        )}

        {props.profile.phoneNumbers.home && (
          <>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <PhoneInput
                  id="homePhone"
                  name="homePhone"
                  label="Home Phone"
                  value={profile.homePhone}
                  onChange={onChange}
                  onBlur={validate}
                  error={errors.homePhone || errors.homePhoneIsMobile}
                  type="tel"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <Checkbox
                  id="homePhoneIsMobile"
                  name="homePhoneIsMobile"
                  checked={profile.homePhoneIsMobile}
                  onChange={onCheckboxChange}
                >
                  This is a Mobile Number
                </Checkbox>
              </div>
            </div>
          </>
        )}

        {props.profile.phoneNumbers.work && (
          <>
            {" "}
            <div className="row">
              <div className="col-12 col-md-6">
                <PhoneInput
                  id="workPhone"
                  name="workPhone"
                  label="Work Phone"
                  value={profile.workPhone}
                  onChange={onChange}
                  error={errors.workPhone || errors.workPhoneIsMobile}
                  onBlur={validate}
                  type="tel"
                />
              </div>

              <div className="col-12 col-md-4">
                <TextInput
                  id="ext"
                  name="workPhoneExt"
                  label="Ext."
                  maxLength={5}
                  value={profile.workPhoneExt}
                  onChange={onChange}
                  onBlur={validate}
                  type="tel"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <Checkbox
                  id="workPhoneIsMobile"
                  name="workPhoneIsMobile"
                  checked={profile.workPhoneIsMobile}
                  onChange={onCheckboxChange}
                >
                  This is a Mobile Number
                </Checkbox>
              </div>
            </div>
          </>
        )}

        {/* yes, need to say mobile here since it's sent down as mobile from the UI and into the component on props, but labeled as other in the UI */}
        {props.profile.phoneNumbers.mobile && (
          <>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <PhoneInput
                  id="otherPhone"
                  name="otherPhone"
                  label="Other Phone"
                  value={profile.otherPhone}
                  onChange={onChange}
                  error={errors.otherPhone || errors.otherPhoneIsMobile}
                  onBlur={validate}
                  type="tel"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <Checkbox
                  id="otherPhoneIsMobile"
                  checked={profile.otherPhoneIsMobile}
                  name="otherPhoneIsMobile"
                  onChange={onCheckboxChange}
                >
                  This is a Mobile Number
                </Checkbox>
              </div>
            </div>
          </>
        )}

        <p className={styles.terms}>
          Do you agree Discover Bank, its affiliates, and agents may call you,
          including text, about any current or future accounts or applications,
          with respect to all products you have with Discover at any phone
          number you provide, and in addition you agree Discover may contact you
          using an automatic dialer or pre-recorded voice message, even if you
          phone provider may charge you for calls or texts?
        </p>

        <ButtonGroup>
          <Button
            type="submit"
            onClick={() =>
              clickTrack(
                "BANKAC_ZELLE_LANDING_EDIT_INFO_OVERLAY_SAVE_CHANGES_BTN"
              )
            }
          >
            Agree & Save Changes
          </Button>
          <ButtonGroup.Link>
            <Button
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={() => {
                clickTrack("BANKAC_ZELLE_LANDING_EDIT_INFO_OVERLAY_CANCEL_LNK");
                props.onClickCancel();
              }}
            >
              Cancel
            </Button>
          </ButtonGroup.Link>
        </ButtonGroup>
      </form>
    );
  }

  if (loading)
    return (
      <div className={styles.spinnerWrapper}>
        <Spinner center={false} />
      </div>
    );
  if (view === VIEW.REDIRECT_TO_LOGOUT) return <Redirect to={URLS.LOGOUT} />;
  if (view === VIEW.OOB) return renderOob();
  return renderEditProfile();
};

EditProfile.propTypes = {
  onClickCancel: PropTypes.func.isRequired,
  onEditProfileComplete: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

export default EditProfile;
