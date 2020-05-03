import React from "react";
import PropTypes from "prop-types";
import DeliveryMethodIcon from "../DeliveryMethodIcon";
import styles from "./DeliveryMethod.module.scss";
import cx from "classnames";
import { getDeliveryMethod } from "../../../utils/deliveryMethod";

const DeliveryMethod = ({
  allowByTextClass,
  displayLongName,
  iconClass,
  isBold,
  method,
  showAllowByText,
  textClass,
}) => {
  const assets = getDeliveryMethod(method);
  return (
    <>
      {assets.icon && (
        <DeliveryMethodIcon
          className={cx(iconClass, styles.icon)}
          deliveryMethodKey={assets.icon}
        />
      )}{" "}
      <span className={cx(textClass, isBold ? "meta-web-bold" : "")}>
        {displayLongName ? assets.name : assets.shortName}
      </span>
      {showAllowByText && (
        <>
          {" "}
          <span className={cx(allowByTextClass, isBold ? "meta-web-bold" : "")}>
            {assets.allowByText}
          </span>
        </>
      )}
    </>
  );
};

DeliveryMethod.propTypes = {
  /** class to apply to allowByText span tag */
  allowByTextClass: PropTypes.string,

  /** display the longer delivery method description */
  displayLongName: PropTypes.bool,

  /** class to apply to icon */
  iconClass: PropTypes.string,

  /** is text Bold */
  isBold: PropTypes.bool,

  /** specify method type for lookup */
  method: PropTypes.oneOf([
    "DIRECT_CHECK",
    "STANDARD_ELECTRONIC",
    "TRUST_CHECK",
  ]).isRequired,

  /** show the allow by text (ie "Allow 2-3 days" or "Allow 5-7 days") */
  showAllowByText: PropTypes.bool,

  /** class to apply to text */
  textClass: PropTypes.string,
};

DeliveryMethod.defaultProps = {
  displayLongName: false,
  isBold: false,
  showAllowByText: false,
};

export default DeliveryMethod;
