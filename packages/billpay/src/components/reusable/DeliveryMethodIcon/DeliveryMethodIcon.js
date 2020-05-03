import React from "react";
import PropTypes from "prop-types";

import MailIcon from "reusable/lib/MailIcon";
import ElectronicIcon from "reusable/lib/ElectronicIcon";

function DeliveryMethodIcon({ deliveryMethodKey }) {
  switch (deliveryMethodKey) {
    case "mail":
    case "DIRECT_CHECK":
    case "TRUST_CHECK":
      return <MailIcon />;
    case "electronic":
    case "STANDARD_ELECTRONIC":
      return <ElectronicIcon />;
    default:
      throw new Error("Unknown deliveryMethodKey: " + deliveryMethodKey);
  }
}

DeliveryMethodIcon.propTypes = {
  /** A delivery method key */
  deliveryMethodKey: PropTypes.string.isRequired,
};

export default DeliveryMethodIcon;
