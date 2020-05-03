/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import cx from "classnames";
import styles from "./AddPayee.module.scss";
import SteppedForm from "reusable/lib/SteppedForm";
import TextInput from "reusable/lib/TextInput";
import BlueBox from "reusable/lib/BlueBox";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import ReadOnlyInput from "reusable/lib/ReadOnlyInput";
import DoNextLinks from "reusable/lib/DoNextLinks";
import SuccessIcon from "reusable/lib/SuccessIcon";
import EBillIcon from "reusable/lib/EBillIcon";
import PhoneInput from "reusable/lib/PhoneInput";
import SelectState from "reusable/lib/SelectState";
import ErrorSummary from "reusable/lib/ErrorSummary";
import Alert from "reusable/lib/Alert";
import ZipcodeInput from "reusable/lib/ZipcodeInput";
import AccountNumberMask from "reusable/lib/AccountNumberMask";
import AccountNumberInput from "reusable/lib/AccountNumberInput";
import DefinitionList from "reusable/lib/DefinitionList";
import { formatZip } from "reusable/lib/formattingUtils";
import { useHistory } from "react-router";
import DeliveryMethod from "../../reusable/DeliveryMethod";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import SmartLink from "reusable/lib/SmartLink";

const Warning = React.forwardRef(
  (
    {
      setIsVerified,
      warning,
      setWarning,
      errorType,
      setPayee,
      payee,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      setPayee({
        name: "",
        nickName: "",
        phoneNumber: "",
        accountNumber: "",
        streetAddress: "",
        extendedAddress: "",
        locality: "",
        region: "",
        zip: "",
        ...payee,
      });
      setIsVerified(false);
      setWarning();
    };

    function renderEnterPayeeLink() {
      return (
        <Button
          buttonStyle={BUTTON_TYPES.LINK}
          onClick={handleClick}
          className="text-underline"
          adobeEvent="MANAGE_PAYEE_KNOWN_ENTER_PAYEE_MANUALLY_LNK"
        >
          enter this payee manually.
        </Button>
      );
    }

    const renderWarning = (code) => {
      switch (code) {
        case "Payee.AccountNumber.Mismatch":
          return (
            <>
              <strong>
                We couldn&apos;t find your account number with this payee
              </strong>
              <br />
              Please re-enter the account number as it appears on your bill. If
              you&apos;ve entered the correct account number and we still
              can&apos;t find it with this payee, you&apos;ll need to{" "}
              {renderEnterPayeeLink()}
            </>
          );
        case "Payee.Duplicate":
          return (
            <>
              <strong>This payee already exists.</strong>
              <br />
              You can schedule payments to this payee on the{" "}
              <Link to="/make-payment">Make a Payment</Link> page or make edits
              on the <Link to="/manage-payees">Manage Payees</Link> page.
            </>
          );
        case "Payee.ZipCode.Mismatch":
          return (
            <>
              <strong>We couldn&apos;t find your payee in that ZIP Code</strong>
              <br />
              Please double check the ZIP Code entered below matches the ZIP
              Code on your bill. If it&apos;s correct, you&apos;ll need to{" "}
              {renderEnterPayeeLink()}
            </>
          );
        case "Payee.Address.Invalid":
          return (
            <>
              <strong>We couldn&apos;t find this payee address</strong>
              <br />
              Please make sure the information entered below is correct. If we
              can&apos;t verify this payee address, we can&apos;t send payments
              to this payee.
            </>
          );
        case "Payee.NotFound":
          return (
            <>
              <strong>We couldn&apos;t add this payee</strong>
              <br />
              Please double check the information entered below matches the
              information on your bill. If it&apos;s correct, you&apos;ll need
              to {renderEnterPayeeLink()}
            </>
          );
        case "nothing_changed":
          return (
            <>
              <strong>Please make edits to your payee before continuing</strong>
              <br />
              If you no longer want to edit your payee, you can return to{" "}
              <Link to="/manage-payees" className="text-underline">
                Manage Payees.
              </Link>
            </>
          );
        default:
          return (
            <>
              <strong>
                We couldn&apos;t find your account number with this payee
              </strong>
              <br />
              Please double check the account number entered below. If it&apos;s
              correct, you&apos;ll need to {renderEnterPayeeLink()}
            </>
          );
      }
    };

    return (
      <Alert
        closable={false}
        type="warning"
        tabIndex="-1"
        ref={ref}
        className={styles.warningBox}
      >
        <p>{renderWarning(warning)}</p>
      </Alert>
    );
  }
);

Warning.displayName = "Warning";

const DataList = ({ isEdit, payee }) => {
  const verified = payee.verified;
  const items = [
    { label: "Name", value: payee.name },
    { label: "Nickname", value: payee.nickName },
  ];

  if (verified) {
    items.push({
      label: "Account Number",
      value: <AccountNumberMask value={payee.accountNumber} />,
    });
    if (payee.zip && !isEdit) {
      items.push({ label: "ZIP Code", value: formatZip(payee.zip) });
    }
    items.push({
      label: "Delivery Method",
      value: (
        <DeliveryMethod
          displayLongName
          method={
            payee.deliveryMethod ? payee.deliveryMethod : "STANDARD_ELECTRONIC" //we can assign the deliveryMethod only after sucessful submit, otherwise it is inferred by the verified status
          }
        />
      ),
    });
  } else {
    items.push({ label: "Phone Number", value: payee.phoneNumber });
    if (payee.accountNumber) {
      items.push({
        label: "Account Number",
        value: <AccountNumberMask value={payee.accountNumber} />,
      });
    }
    items.push({
      label: "Address",
      value: (
        <>
          {payee.streetAddress} {payee.extendedAddress && <br />}
          {payee.extendedAddress}
          <br />
          {payee.locality}, {payee.region} {formatZip(payee.zip)}
        </>
      ),
    });
    items.push({
      label: "Delivery Method",
      value: (
        <DeliveryMethod
          displayLongName
          method={payee.deliveryMethod ? payee.deliveryMethod : "TRUST_CHECK"}
        />
      ),
    });
  }

  return <DefinitionList items={items} />;
};

const AddPayee = ({
  activeStep,
  payee,
  setActiveStep,
  onSubmit,
  onChange,
  errors,
  validate,
  isVerified,
  formSubmitCount,
  warning,
  setIsVerified,
  setWarning,
  setPayee,
  isEdit,
  ebillsCallout,
  lastValue,
  setLastValue,
}) => {
  const warningRef = useRef(null);
  const nameRef = useRef(null);
  const history = useHistory();

  const [page, vars] = getPageLoadTrackingConfig();
  useTrackPageLoad(page, vars);

  function getPageLoadTrackingConfig() {
    switch (activeStep) {
      case 1:
        return isVerified
          ? ["bankac/billpay/addKnownpayee"]
          : ["bankac/billpay/AddUnKnownPayee"];

      case 2:
        return isVerified
          ? ["bankac/billpay/AddKnownPayeeVerify"]
          : ["bankac/billpay/AddUnKnownPayeeVerify"];

      case 3:
        return isVerified
          ? ["bankac/billpay/KnownPayeeAdded", { list1: payee.nickName }]
          : ["bankac/billpay/UnKnownPayeeAdded"];

      default:
        console.error("Unhandled activeStep:" + activeStep);
    }
  }

  useEffect(() => {
    if (warning) warningRef.current.focus();
  }, [warning]);

  return (
    <>
      {warning && (
        <Warning
          warning={warning}
          ref={warningRef}
          setIsVerified={setIsVerified}
          setWarning={setWarning}
          setPayee={setPayee}
          payee={payee}
        />
      )}
      <ErrorSummary
        adobeEvent={{
          prop1: isVerified
            ? "MANAGE_PAYEE_KNOWN_ADD_DETAILS_CONTINUE_BTN"
            : "MANAGE_PAYEE_UNKNOWN_ADD_DETAILS_MANUAL_ENTRY_CONTINUE_BTN",
          prop10Label: isVerified
            ? "AddKnownPayeeError"
            : "AddUnknownPayeeError",
          list1Label: isVerified
            ? "AddKnownPayeeError"
            : "AddUnknownPayeeError",
        }}
        errors={errors}
        formSubmitCount={formSubmitCount}
      />
      <SteppedForm activeStep={activeStep}>
        <SteppedForm.Step
          header={
            <h2>
              <span className="sr-only">Step 1:</span>{" "}
              {isEdit ? "Edit a Payee" : "Enter Payee Details"}
            </h2>
          }
        >
          <form onSubmit={onSubmit} className="mw-630">
            {isVerified && !isEdit ? (
              <p className="mb-0">
                Since we are able to verify this payee, we only need the account
                number {payee.zipRequired || !isVerified ? "and ZIP Code " : ""}
                that appear{!payee.zipRequired && isVerified ? "s" : ""} on your
                bill.
              </p>
            ) : (
              ""
            )}

            {isVerified && isEdit && payee.zip ? (
              <p className="mb-0">
                You can edit the Nickname and the Account Number of this payee.
                If you need to update the ZIP Code, you must delete this payee
                and add it again with the new ZIP Code.
              </p>
            ) : (
              ""
            )}

            <div className={styles.innerForm}>
              {isVerified ? (
                <ReadOnlyInput
                  label="Name"
                  name="name"
                  id="payee-name"
                  value={payee.name}
                  containerClass={styles.readonlyPayee}
                />
              ) : (
                <TextInput
                  error={errors.name}
                  id="name"
                  label="Name"
                  name="name"
                  onChange={onChange}
                  required
                  value={payee.name}
                  onBlur={validate}
                  nameRef={nameRef}
                  maxLength={32}
                />
              )}

              <TextInput
                error={errors.nickName}
                id="nickName"
                label="Nickname"
                name="nickName"
                onChange={onChange}
                required
                value={payee.nickName}
                onBlur={validate}
                maxLength={32}
              />

              {!isVerified && (
                <PhoneInput
                  error={errors.phoneNumber}
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={onChange}
                  required
                  value={payee.phoneNumber}
                  onBlur={validate}
                />
              )}

              {isVerified ? (
                payee.ebillStatus === "ACTIVE" ? (
                  <ReadOnlyInput
                    name="accountNumber"
                    label="Account Number"
                    id="accountNumber"
                    value={payee.accountNumber}
                    containerClass={styles.readonlyPayee}
                  />
                ) : (
                  <>
                    <AccountNumberInput
                      error={errors.accountNumber}
                      id="accountNumber"
                      label="Account Number"
                      name="accountNumber"
                      onFocus={(e) =>
                        setPayee({
                          ...payee,
                          [e.target.name]: "",
                        })
                      }
                      onChange={onChange}
                      required
                      value={payee.accountNumber}
                      onBlur={validate}
                      lastValue={lastValue}
                      setValue={(e) =>
                        setPayee({
                          ...payee,
                          accountNumber: lastValue,
                        })
                      }
                      setLastValue={setLastValue}
                      instructionalText="Enter numbers and/or letters only"
                      maxLength={25}
                    />
                    <AccountNumberInput
                      error={errors.confirmAccountNumber}
                      id="confirmAccountNumber"
                      label="Confirm Account Number"
                      name="confirmAccountNumber"
                      onFocus={(e) =>
                        setPayee({
                          ...payee,
                          [e.target.name]: "",
                        })
                      }
                      onChange={onChange}
                      required
                      value={payee.confirmAccountNumber}
                      onBlur={validate}
                      lastValue={lastValue}
                      setValue={() =>
                        setPayee({
                          ...payee,
                          confirmAccountNumber: lastValue,
                        })
                      }
                      setLastValue={setLastValue}
                      maxLength={25}
                    />
                  </>
                )
              ) : (
                <AccountNumberInput
                  error={errors.accountNumber}
                  id="accountNumber"
                  label="Account Number"
                  name="accountNumber"
                  onFocus={(e) =>
                    setPayee({
                      ...payee,
                      [e.target.name]: "",
                    })
                  }
                  onChange={onChange}
                  value={payee.accountNumber || ""}
                  onBlur={validate}
                  lastValue={lastValue}
                  setValue={(e) =>
                    setPayee({
                      ...payee,
                      accountNumber: e.target.value,
                    })
                  }
                  setLastValue={setLastValue}
                  instructionalText="Enter numbers and/or letters only"
                  maxLength={25}
                />
              )}

              {!isVerified && (
                <>
                  <TextInput
                    error={errors.streetAddress}
                    id="streetAddress"
                    label="Street Address"
                    name="streetAddress"
                    onChange={onChange}
                    required
                    value={payee.streetAddress}
                    onBlur={validate}
                    maxLength={32}
                  />
                  <TextInput
                    error={errors.extendedAddress}
                    id="extendedAddress"
                    label="Apt/Suite/Floor"
                    name="extendedAddress"
                    onChange={onChange}
                    value={payee.extendedAddress || ""}
                    onBlur={validate}
                    maxLength={32}
                  />
                  <TextInput
                    error={errors.locality}
                    id="locality"
                    label="City"
                    name="locality"
                    required
                    onChange={onChange}
                    value={payee.locality}
                    onBlur={validate}
                    maxLength={32}
                  />
                  <SelectState
                    error={errors.region}
                    id="region"
                    label="State"
                    name="region"
                    required
                    onChange={(e) => {
                      onChange(e);
                      validate(e);
                    }}
                    setValue={(value) =>
                      setPayee({
                        ...payee,
                        region: value,
                      })
                    }
                    value={payee.region}
                  />
                </>
              )}

              {(payee.zipRequired || !isVerified) && (
                <ZipcodeInput
                  error={errors.zip}
                  id="zip"
                  label="ZIP Code"
                  name="zip"
                  onChange={onChange}
                  required
                  value={payee.zip}
                  onBlur={validate}
                />
              )}

              <ButtonGroup className="mt-25 mb-25">
                {/* The onMouseDown below is necessary to assure the form is submitted when someone clicks submit while focused on an empty required field.
                The onClick fails to fire because it fires onMouseUp. But since the onBlur fires first, the error displays which moves the submit button, causing the mouse up to occur over whitespace.
                Another solution is to design a form where displaying an error doesn't move the submit button.
                Simplified Codesandbox that shows the issue: https://codesandbox.io/s/nervous-sammet-il5is
                See this thread for more info: https://twitter.com/housecor/status/1170521013936893958 */}
                <Button
                  type="submit"
                  onMouseDown={onSubmit}
                  className={styles.buttonMax}
                >
                  Continue
                </Button>
                <ButtonGroup.Link>
                  <SmartLink
                    adobeEvent={
                      isVerified
                        ? "MANAGE_PAYEE_KNOWN_ADD_DETAILS_CANCEL_LNK"
                        : "MANAGE_PAYEE_UNKNOWN_ADD_DETAILS_MANUAL_ENTRY_CANCEL_LNK"
                    }
                    to="/manage-payees"
                  >
                    Cancel
                  </SmartLink>
                </ButtonGroup.Link>
              </ButtonGroup>
            </div>
          </form>
        </SteppedForm.Step>

        <SteppedForm.Step
          header={
            <h3>
              <span className="sr-only">Step 2:</span> Verify Payee Details
            </h3>
          }
        >
          <form onSubmit={onSubmit}>
            <div className={styles.innerForm}>
              <BlueBox className="mt-25 mb-25" header="Payee Details">
                <DataList payee={payee} isEdit={isEdit} />
              </BlueBox>
              <ButtonGroup>
                <Button type="submit">Submit</Button>
                <ButtonGroup.Link>
                  <Button
                    adobeEvent={
                      isVerified
                        ? "MANAGE_PAYEE_KNOWN_VERIFY_DETAILS_BACK_LNK"
                        : "MANAGE_PAYEE_UNKNOWN_VERIFY_DETAILS_BACK_LNK"
                    }
                    buttonStyle={BUTTON_TYPES.LINK}
                    onClick={() => setActiveStep(1)}
                  >
                    Back
                  </Button>
                </ButtonGroup.Link>
                <ButtonGroup.Link>
                  <SmartLink
                    adobeEvent={
                      isVerified
                        ? "MANAGE_PAYEE_KNOWN_VERIFY_DETAILS_CANCEL_LNK"
                        : "MANAGE_PAYEE_UNKNOWN_VERIFY_DETAILS_CANCEL_LNK"
                    }
                    to="/manage-payees"
                  >
                    Cancel
                  </SmartLink>
                </ButtonGroup.Link>
              </ButtonGroup>
            </div>
          </form>
        </SteppedForm.Step>

        <SteppedForm.Step
          header={
            <h3>
              <span className="sr-only">Step 3:</span> Payee{" "}
              {isEdit ? "Updated" : "Added"}
            </h3>
          }
        >
          <div className={styles.innerForm}>
            <BlueBox className="mt-25" header="Payee Details">
              <div className={styles.successBanner}>
                <SuccessIcon />{" "}
                {isEdit
                  ? "Your payee details have been updated"
                  : "Your payee has been added"}
              </div>
              <DataList activeStep={activeStep} isEdit={isEdit} payee={payee} />
              {ebillsCallout && (
                <div className={cx(styles.ebillCallout, "mt-20 bg-gray")}>
                  <EBillIcon className={styles.ebillsIcon} />{" "}
                  <b>This payee is eligible for eBills.</b>{" "}
                  <Button
                    buttonStyle={BUTTON_TYPES.LINK}
                    onClick={() => {
                      history.push({
                        pathname: "/manage-ebills/enroll",
                        state: { payeeId: payee.id },
                      });
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              )}
            </BlueBox>

            <DoNextLinks className="mt-35">
              <SmartLink
                adobeEvent={
                  isVerified
                    ? "MANAGE_PAYEE_KNOWN_CONFIRM_DETAILS_MAKE_A_BILL_PAYMENT_LNK"
                    : "MANAGE_PAYEE_UNKNOWN_CONFIRM_DETAILS_MAKE_A_BILL_PAYMENT_LNK"
                }
                to="/"
              >
                Make a Bill Payment
              </SmartLink>
              <SmartLink to="/review-payments">Review Payments</SmartLink>
              <SmartLink to="/manage-ebills">Manage eBills</SmartLink>
            </DoNextLinks>
          </div>
        </SteppedForm.Step>
      </SteppedForm>
    </>
  );
};

AddPayee.propTypes = {
  activeStep: PropTypes.number.isRequired,
  formSubmitCount: PropTypes.number.isRequired,
  payee: PropTypes.object.isRequired,
  setActiveStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  validate: PropTypes.func.isRequired,
};

DataList.propTypes = {
  /** determines visiblity of zip code field */
  isEdit: PropTypes.bool,

  /** data passed in to display */
  payee: PropTypes.object.isRequired,
};

export default AddPayee;
