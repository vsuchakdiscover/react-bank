import { isNumber, last4DigitsOfSsnOrTaxId } from "./validations";

/**
 * A case-by-case field prop overrides.
 *
 * Keys are constructed in two ways:
 *    a) {formatType}__{tokenName}
 *    b) {tokenListName}__{formatType}__{tokenName}
 */
const FIELD_PROP_OVERRIDES = {
  "OTHER__Last 4 of SSN": {
    validate: [last4DigitsOfSsnOrTaxId, isNumber],
  },
};

/**
 * Get a case-by-case field overrides and merge them into default props.
 */
export function overridePropsForToken(token, tokenListName, props) {
  const propOverrides =
    // Field can be overridden based on tokenList name (usually is payee name), formatType and field name.
    FIELD_PROP_OVERRIDES[
      `${tokenListName}__${token.formatType}__${token.name.trim()}`
    ] ||
    // Field can be overridden based on formatType and field name.
    FIELD_PROP_OVERRIDES[`${token.formatType}__${token.name.trim()}`] ||
    {};
  return { ...props, ...propOverrides };
}
