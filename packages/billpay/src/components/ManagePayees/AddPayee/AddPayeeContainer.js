import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";
import { payeesApi } from "../../../api";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import AddPayee from "./AddPayee";
import { isValidPhone } from "reusable/lib/validators";
import { parseErrors } from "../../../api/apiUtils";
import { formatZip } from "reusable/lib/formattingUtils";
import { EBILL_STATUS } from "../../Ebills/Ebills";
import ErrorBoundary from "../../../ErrorBoundary";
import { useLocation, useHistory } from "react-router-dom";
import { clickTrack } from "reusable/lib/tracking";

// Lazy load since it's a dev tool that's only used in development anyway. This keeps it out of the main prod bundle.
// It will only be called in JSX below when in dev environment.
const AddPayeeScenarioSelector = React.lazy(() =>
  import(/* webpackChunkName: "devtools" */ "./AddPayeeScenarioSelector")
);

const verified = {
  name: "",
  nickName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  zip: "",
  ebillStatus: "",
  verified: true,
};

const unverified = {
  name: "",
  nickName: "",
  phoneNumber: "",
  accountNumber: "",
  streetAddress: "",
  extendedAddress: "",
  locality: "",
  region: "",
  zip: "",
  ebillStatus: "",
  verified: false,
};

const AddPayeeContainer = ({ setPayees, payees, ...props }) => {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const getStatus = () => {
    let status = false;

    if (location.state) {
      if (location.state.hasOwnProperty("verified")) {
        status = location.state.verified;
      } else if (location.state.name !== "") {
        status = true;
      }
    }
    return status;
  };

  const [isVerified, setIsVerified] = useState(getStatus());
  const isEdit = Boolean(location.state && location.state.edit);

  const defaultPayee = isVerified
    ? { ...verified, ...location.state }
    : { ...unverified, ...location.state };

  if (isVerified && defaultPayee.nickName === "") {
    defaultPayee.nickName = defaultPayee.name;
  }

  if (isEdit && isVerified) {
    defaultPayee.confirmAccountNumber = defaultPayee.accountNumber;
  }

  if (isEdit) {
    defaultPayee.zip = formatZip(defaultPayee.zip);
  }

  const [payee, setPayee] = useState(defaultPayee);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [warning, setWarning] = useState();
  const [ebillsCallout, setEbillsCallout] = useState();

  // AddPayee uses this to determine when the form has been re-submitted
  const [formSubmitCount, setFormSubmitCount] = useState(0);
  const [lastValue, setLastValue] = useState("");

  function onChange({ target }) {
    setPayee({
      ...payee,
      [target.name]: target.value,
    });
    setLastValue(target.value);
  }

  function isValid() {
    const _errors = {};
    const fields = isVerified
      ? ["nickName", "accountNumber", "confirmAccountNumber"]
      : [
          "name",
          "nickName",
          "accountNumber",
          "phoneNumber",
          "streetAddress",
          "extendedAddress",
          "locality",
          "region",
          "zip",
          "deliverByDate",
        ];

    if (payee.zipRequired) {
      fields.push("zip");
    }

    fields.forEach((field) => {
      // Create an object that mimics the browser event since validate expects an event.
      const fakeEvent = {
        target: {
          name: field,
          value: payee[field],
          checked: payee[field],
        },
      };
      const error = validate(fakeEvent);
      if (error) _errors[field] = error;
    });

    return Object.keys(_errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    return activeStep === 1 ? submitStep1() : submitStep2();
  }

  function submitStep1() {
    clickTrack(
      isVerified
        ? "MANAGE_PAYEE_KNOWN_ADD_DETAILS_CONTINUE_BTN"
        : "MANAGE_PAYEE_UNKNOWN_ADD_DETAILS_MANUAL_ENTRY_CONTINUE_BTN"
    );
    let valuesChanged = false;
    window.scroll(0, 0);
    if (!isValid()) {
      setFormSubmitCount((count) => count + 1);
      return;
    }

    for (var key in payee) {
      if (payee[key] !== defaultPayee[key]) {
        valuesChanged = true;
      }
    }

    if (!valuesChanged) {
      setFormSubmitCount((count) => count + 1);
      setWarning("nothing_changed");
      return;
    }

    setFormSubmitCount(0); // reset submit counter since moving to new step
    setActiveStep(2);
    setWarning();
    setPayee(payee);
  }

  function buildPayeeRequest() {
    const payeeData = { ...payee, verified: isVerified };

    //we only want to send changes for edit
    if (isEdit) {
      for (var key in payeeData) {
        if (payeeData[key] === defaultPayee[key]) {
          delete payeeData[key];
        }
      }
    }

    if (!isVerified) {
      if (payeeData.phoneNumber) {
        payeeData.phoneNumber = {
          number: payeeData.phoneNumber.replace(/-/g, ""),
        };
      }

      if (
        payeeData.region ||
        payeeData.streetAddress ||
        payeeData.extendedAddress ||
        payeeData.locality ||
        payeeData.zip
      ) {
        payeeData.address = {
          streetAddress: payeeData.streetAddress || "",
          extendedAddress: payeeData.extendedAddress || "",
          locality: payeeData.locality || "",
          region: payeeData.region || "",
          postalCode: payeeData.zip ? payeeData.zip.replace(/-/g, "") : "",
        };
      }

      payeeData.verified = false;

      if (isEdit && payeeData.address) {
        for (var item in payeeData.address) {
          if (payeeData.address[item] === "") {
            delete payeeData.address[item];
          }
        }
      }

      delete payeeData.region;
      delete payeeData.streetAddress;
      delete payeeData.extendedAddress;
      delete payeeData.locality;
    } else {
      payeeData.verified = true;
      if (payeeData.zip) {
        payeeData.address = {
          postalCode: payeeData.zip.replace(/-/g, ""),
        };
      }
    }
    if (isEdit) {
      delete payeeData.edit;
    }

    delete payeeData.confirmAccountNumber;
    delete payeeData.id;
    delete payeeData.zip;
    delete payeeData.zipRequired;
    delete payeeData.ebillStatus;
    return payeeData;
  }

  async function submitStep2() {
    setLoading(true);
    clickTrack(
      isVerified
        ? "MANAGE_PAYEE_KNOWN_VERIFY_DETAILS_SUBMIT_BTN"
        : "MANAGE_PAYEE_UNKNOWN_VERIFY_DETAILS_SUBMIT_BTN"
    );
    const payeeData = buildPayeeRequest();

    try {
      const { data } = isEdit
        ? await payeesApi.editPayee(payeeData, payee.id)
        : await payeesApi.addPayee(payeeData);
      setEbillsCallout(data.ebillStatus === EBILL_STATUS.AVAILABLE);
      setLoading(false);
      setActiveStep(3);

      const {
        id,
        name,
        nickName,
        accountNumber,
        address,
        phoneNumber,
        verified,
        deliveryMethod,
      } = data;
      setPayee({
        id,
        name,
        nickName,
        phoneNumber: phoneNumber?.formatted ?? "",
        accountNumber: accountNumber ?? "",
        confirmAccountNumber: accountNumber ?? "",
        zip: address?.postalCode ?? "",
        streetAddress: address?.streetAddress ?? "",
        extendedAddress: address?.extendedAddress ?? "",
        locality: address?.locality ?? "",
        region: address?.region ?? "",
        verified,
        deliveryMethod,
      });
      const newPayees = payees.filter((p) => p.id !== data.id);
      setPayees(
        [...newPayees, data].sort((a, b) =>
          a.nickName.toLowerCase() > b.nickName.toLowerCase() ? 1 : -1
        )
      ); //send returned data up to the app level
      return;
    } catch (err) {
      const errors = parseErrors(err);
      const warningCodes = [
        "Payee.AccountNumber.Mismatch",
        "Payee.ZipCode.Mismatch",
        "Payee.Duplicate",
        "Payee.Address.Invalid",
        "Payee.NotFound",
      ];
      if (errors.length) {
        let serverErrors = {};
        const genError = errors.filter((error) => {
          return error.code === "General.TechnicalDifficulties";
        });
        if (genError.length) {
          setLoading(false);
          console.error("General.TechnicalDifficulties in AddPayeeContainer");
          return history.push("/tech-diff");
        }
        let warnings = errors.filter((error) => {
          return warningCodes.includes(error.code);
        });
        if (warnings.length) {
          setLoading(false);
          setWarning(warnings[0].code);
          setFormSubmitCount(0);
          setActiveStep(1);
          return;
        }
        errors.forEach((error) => {
          let name = error.name.includes("address.")
            ? error.name.replace("address.", "")
            : error.name;
          if (name.includes(".number")) {
            name = "phoneNumber";
          }
          serverErrors[name] = error.message;
        });
        setFormSubmitCount(1);
        setLoading(false);
        setErrors(serverErrors);
        setActiveStep(1);
      } else {
        setLoading(false);
        console.error("Unhandled error in AddPayeeContainer:" + err);
        history.push("/tech-diff");
      }
    }
  }

  function validate(event) {
    let error = null;
    const { value, name } = event.target;

    switch (name) {
      case "name":
        if (
          value !== "" &&
          /*value cannot be these special characters `<> / {}[]; */
          !value.match(/^[a-zA-Z0-9 ~!@#$%*()_\-,.?:|&^+=']+$/)
        ) {
          error = 'Special Characters (<>/{}[];") are not allowed in Name';
        } else if (!/^.{2,32}$/.test(value)) {
          error = "Enter a Name with 2-32 characters";
        }
        break;
      case "nickName":
        if (
          value !== "" &&
          /*value cannot be these special characters `<> / {}[]; */
          !value.match(/^[a-zA-Z0-9 ~!@#$%*()_\-,.?:|&^+=']+$/)
        ) {
          error = 'Special Characters (<>/{}[];") are not allowed in Nickname';
        } else if (!/^.{2,32}$/.test(value)) {
          error = "Enter a Nickname with 2-32 characters";
        }
        break;

      case "accountNumber":
        /*dash should not be allowed but removing from validation for now, because IE browsers have another bug related to this field and flagging error in error, low priority issue*/
        /*characters not allowed in account number ~`!#$%^&*+=\';,/{}|":<>? */
        if (/[~`!#$%^&+=[\]\\';,/{}|\\":<>?]/g.test(value)) {
          error = "Special Characters are not allowed in Account Number";
        } else if (
          (!/^.{2,25}$/.test(value) && isVerified) ||
          (!isVerified && value !== "" && !/^.{2,25}$/.test(value))
        ) {
          error = "Enter a valid Account Number with 2-25 characters";
        }
        break;

      case "confirmAccountNumber":
        /*characters not allowed in account number ~`!#$%^&*+=-\';,/{}|":<>? */
        if (/[~`!#$%^&+=\-[\]\\';,/{}|\\":<>?]/g.test(value)) {
          error = "Special Characters are not allowed in Account Number";
        } else if (value !== payee.accountNumber) {
          error = "Account Numbers must match";
        } else if (value === "") {
          error = "Confirm Account Number";
        }
        break;

      case "phoneNumber":
        if (!isValidPhone(value)) {
          error = "Enter a valid 10-digit Phone Number";
        }
        break;

      case "streetAddress":
        if (value.length < 2 || value.length > 32) {
          error = "Enter Street Address";
          /* only allow alphanumeric, dash, space, apostrophe,comma, pound sign*/
        } else if (!value.match(/^[A-Za-z\-\s\d.',#]+$/)) {
          error =
            "Please use letters, hyphens, spaces, commas, periods, apostrophes, and number sign only in Address Line 1";
        }
        break;

      case "extendedAddress":
        /* only allow alphanumeric, dash, space, apostrophe,comma, pound sign*/
        if (!value.match(/^[A-Za-z\-\s\d.',#]+$/) && value !== "") {
          error =
            "Please use letters, hyphens, spaces, commas, periods, apostrophes, and number sign only in Address Line 2";
        }
        break;

      case "locality":
        /* only allow alpha, period, space*/
        if (value !== "" && !value.match(/^[a-zA-Z. ]+$/)) {
          error = "Please use letters, spaces and periods only in City";
        } else if (!/^.{2,32}$/.test(value)) {
          error = "Enter a City";
        }
        break;

      case "region":
        if (value.length === 0) {
          error = "Select a State";
        }
        break;

      case "zip":
        if (
          /* XXXXX 5 digits OR XXXXX-XXXX 5 digits plus 4 digits*/
          !/^(?!.*(\d)\1{4}).*$/.test(value) ||
          (!/^\d{5}$/.test(value) && !/^\d{5}-\d{4}$/.test(value)) ||
          value === undefined
        ) {
          error = "Enter a 5-digit ZIP Code";
        }
        break;

      case "deliverByDate":
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

  return (
    <ErrorBoundary>
      <SpinnerWrapper isLoading={loading}>
        <AddPayee
          onSubmit={handleSubmit}
          onChange={onChange}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          validate={validate}
          errors={errors}
          payee={payee}
          isVerified={isVerified}
          formSubmitCount={formSubmitCount}
          warning={warning}
          setIsVerified={setIsVerified}
          setWarning={setWarning}
          setPayee={setPayee}
          isEdit={isEdit}
          ebillsCallout={ebillsCallout}
          setLastValue={setLastValue}
          lastValue={lastValue}
        />
      </SpinnerWrapper>

      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={<></>}>
          <AddPayeeScenarioSelector
            type={isVerified ? "verifiedPayee" : "managedPayee"}
          />
        </Suspense>
      )}
    </ErrorBoundary>
  );
};

AddPayeeContainer.propTypes = {
  location: PropTypes.object,
  payees: PropTypes.array.isRequired,
  setPayees: PropTypes.func.isRequired,
};

export default AddPayeeContainer;
