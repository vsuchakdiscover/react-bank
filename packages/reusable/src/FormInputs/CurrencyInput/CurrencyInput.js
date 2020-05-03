import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createNumberMask } from "../../utils/masking";
import MaskedTextInput from "../MaskedTextInput";

const numberMask = createNumberMask({
  prefix: "$",
  allowDecimal: true,
});

const CurrencyInput = (props) => {
  const [value, setValue] = useState(props.value || "");

  // Update the value if the value passed in on props changes
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleOnChange = (event) => {
    setValue(event.target.value);
    if (props.onChange) props.onChange(event);
  };

  const handleOnBlur = (event) => {
    event.persist();
    const maskedValue = event.target.value;
    const indexOfDecimal = maskedValue.indexOf(".");
    const decimalValue = maskedValue.split(".")[1];

    // Conditionally format value
    if (maskedValue === "") {
      setValue(maskedValue);
    } else if (maskedValue !== "" && decimalValue === undefined) {
      setValue(maskedValue.concat(".00"));
    } else if (indexOfDecimal !== -1 && decimalValue.length === 0) {
      setValue(maskedValue.concat("00"));
    } else if (decimalValue.length === 1) {
      setValue(maskedValue.concat("0"));
    }

    // Catch when user attempts to enter 0 and $ gets added to input
    if (maskedValue === "$") {
      setValue("");
    }
    // Must use setTimeout to delay otherwise formatted value will not be applied in time
    setTimeout(function () {
      if (props.onBlur) props.onBlur(event);
    }, 0);
  };

  // Must convert value to string since maskedTextInput requires it.
  return (
    <MaskedTextInput
      {...props}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      value={value.toString()}
    />
  );
};

CurrencyInput.propTypes = {
  /** Optional aria-label to apply to the input */
  "aria-label": PropTypes.string,

  /** CSS class applied to input wrapper div */
  containerClass: PropTypes.string,

  /** Set error state and display an error message below the input */
  error: PropTypes.string,

  /** When guide is true, mask will always show both placeholder characters and non-placeholder mask characters. */
  guide: PropTypes.bool,

  /** HTML ID */
  id: PropTypes.string.isRequired,

  /** CSS class applied to input */
  inputClass: PropTypes.string,

  /** Input label */
  label: PropTypes.string.isRequired,

  /** CSS class applied to input label*/
  labelClass: PropTypes.string,

  /** Mask applied to input */
  mask: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.bool])
    .isRequired,

  /** Input name */
  name: PropTypes.string.isRequired,

  /** Function called upon blur of the input. This is called in addition to the native onBlur. */
  onBlur: PropTypes.func,

  /** Function called when the input's value changes. This is called in addition to the native onChange. */
  onChange: PropTypes.func.isRequired,

  /** Function called upon focus of the input */
  onFocus: PropTypes.func,

  /** The placeholder character represents the fillable spot in the mask. */
  placeholderChar: PropTypes.string,

  /** Set to true to hide the word "(optional)" in label */
  required: PropTypes.bool,

  /** Tooltip Contents */
  tooltipContent: PropTypes.element,

  /** Tooltip Trigger copy (can be empty) */
  tooltipTrigger: PropTypes.element,

  /** Input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

CurrencyInput.defaultProps = {
  guide: false,
  mask: numberMask,
};

export default CurrencyInput;
