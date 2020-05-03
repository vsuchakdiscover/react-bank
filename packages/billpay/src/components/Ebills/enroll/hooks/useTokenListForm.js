import useFormHandlers from "reusable/lib/useFormHandlers";
import { isNotEmptyWithMessage } from "../utils/validations";

import { overridePropsForToken } from "../utils/tokenProps";
import { FORMAT_TYPES_AND_PROPS } from "../utils/formatTypes";

/**
 * A hook that takes a tokenList payload and returns a list of fields with all necessary
 * validations and value bindings applied.
 * @param tokenList
 * @param tokenListName
 * @param defaultValues
 */
export default function useTokenListForm({
  tokenList = [],
  tokenListName,
  defaultValues,
}) {
  // Build form schema from tokenList.
  const schema = tokenList.reduce(buildSchemaFromToken(tokenListName), []);

  // Get validation rules out of schema.
  const validationRules = schema.reduce(gatherValidationRules, {});

  // Get form values, errors and handlers.
  const {
    values,
    setValues,
    errors,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormHandlers({
    defaultValues,
    validationRules,
  });

  return {
    errors,
    handleChange,
    handleBlur,
    schema,
    setValues,
    values,
    validateForm,
  };
}

const convertFormatType = (formatType) => {
  switch (formatType) {
    case "TandCCheckbox":
    case "CheckBox":
      return "CHECKBOX";
    case "PassWord":
      return "PASSWORD";
    default:
      return formatType;
  }
};

/**
 * Builds a simple form schema based on tokenList.
 *
 * We then use that schema to generate form automatically.
 */
const buildSchemaFromToken = (tokenListName) => (schema, token) => {
  const { formatType, tokenID: name, label, valueRequired } = token;
  const convertedFormatType = convertFormatType(formatType);
  const { Component, ...rest } = FORMAT_TYPES_AND_PROPS[convertedFormatType];

  // Fields can override default props supplied by a formatType on a case-by-case basis
  // this is where we pull those overrides in.
  const props = overridePropsForToken(token, tokenListName, rest);

  // When value is required, we want to have a nice, inline validation message.
  if (valueRequired && convertedFormatType !== "CHECKBOX") {
    props.validate = [
      ...(props.validate || []),
      isNotEmptyWithMessage(`Enter ${label}`),
    ];
  }

  const updatedSchema = [
    ...schema,
    {
      Component,
      token,
      required: valueRequired,
      label,
      name,
      id: name,
      ...props,
    },
  ];

  // When formatType is PASSWORD we have to manually add the password confirmation.
  if (convertedFormatType === "PASSWORD") {
    // We're setting naming convention for password confirmation input name and id to {name}___CONFIRMATION___.
    const confirmationName = `${name}___CONFIRMATION___`;
    const { Component, ...props } = FORMAT_TYPES_AND_PROPS[
      "PASSWORD___CONFIRMATION___"
    ];
    updatedSchema.push({
      Component,
      token,
      required: valueRequired,
      label: `Confirm ${label}`,
      name: confirmationName,
      id: confirmationName,
      ...props,
    });
  }

  return updatedSchema;
};

/**
 * Pulls validation rules from the field schema and converts them into
 * validationRules array compatible with useForm and useFormValidation hooks.
 */
const gatherValidationRules = (validationRules, token) => {
  const { name, validate, skipValidation } = token;
  return skipValidation || !validate
    ? validationRules
    : { ...validationRules, [name]: validate };
};
