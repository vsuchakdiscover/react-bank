/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import TextInput from "reusable/lib/TextInput";
import {
  fiveCharacters,
  isNotEmptyWithMessage,
  isNumber,
  maxLength11,
  mobilePhoneNumber,
  passwordsMatch,
  zipCode,
} from "./validations";
import SelectInput from "reusable/lib/SelectInput";
import React from "react";

const EbillTextInput = ({ label, ...props }) => {
  return (
    <TextInput
      labelAboveInput
      label={removeMarkupFromString(label)}
      {...props}
    />
  );
};

export const FORMAT_TYPES_AND_PROPS = {
  "First 11 Digits of the Pay FI Account Number": {
    Component: EbillTextInput,
    validate: [
      maxLength11,
      isNumber,
      isNotEmptyWithMessage("Enter your Loan Account Number"),
    ],
  },
  "Digits 12 to 16 of the Pay FI Account Number": {
    Component: EbillTextInput,
    validate: [
      fiveCharacters,
      isNumber,
      isNotEmptyWithMessage("Enter your Loan Note Number"),
    ],
  },
  TextBox: {
    Component: EbillTextInput,
  },
  PASSWORD: {
    Component: EbillTextInput,
    type: "password",
    validate: [isNotEmptyWithMessage("Enter your Password")],
  },
  // This formatType doesn't come from the API, we add it manually after every
  // PASSWORD formatType.
  PASSWORD___CONFIRMATION___: {
    Component: EbillTextInput,
    type: "password",
    validate: [passwordsMatch],
  },
  CHECKBOX: {
    Component: ({ label, value, ...props }) => {
      // Set value to false.
      if (!value) {
        value = false;
      }
      const checkBoxLabel = /^\s*(http|https):/.test(label) ? ( //if label is a url use generic pattern
        <>
          <p className="d-inline">
            By selecting &quot;Enroll&quot;, you acknowledge that you have
            received, are able to view and agree to the biller&apos;s
          </p>{" "}
          <a
            href={label}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View terms and conditions in new browser window"
            className="text-underline d-inline"
          >
            Terms & Conditions.
          </a>
        </>
      ) : (
        label
      );

      return <div className="mt-20 mw-630">{checkBoxLabel}</div>;
    },
  },
  OTHER: {
    Component: EbillTextInput,
    labelAboveInput: true,
  },
  ZIP: {
    Component: EbillTextInput,
    validate: [zipCode, isNumber],
  },
  PHONE: {
    Component: EbillTextInput,
    validate: [mobilePhoneNumber, isNumber],
  },
  "SITE KEY INSTRUCTIONAL TEXT Format Type": {
    Component: (props) => <p>{props.label}</p>,
    // This formatType is a mere help text, not an input which means we don't need to validate it.
    skipValidation: true,
  },

  "SECURITY QUESTION List Box Format Type": {
    Component: ({ token, ...props }) => {
      return (
        <SelectInput
          options={getOptionsFromString(token.name)}
          disableEmptyOptions
          setValue={() => {}}
          {...props}
        />
      );
    },
  },
  "SECURITY ANSWER TEXT Format Type": {
    Component: TextInput,
    labelAboveInput: true,
  },
  "HELP TEXT": {
    Component: (props) => <p className="mt-20 dark-gray">{props.label}</p>,
    // This formatType is a mere help text, not an input which means we don't need to validate it.
    skipValidation: true,
  },
};

const removeMarkupFromString = (str) => {
  return str.replace(/<\/?[^>]+(>|$)/g, " ");
};

/**
 * Gets formatted options from a delimited string.
 */
const getOptionsFromString = (text, delimiter = "|") => {
  return text.split(delimiter).map((chunk, index) => ({
    value: index,
    label: chunk,
  }));
};
