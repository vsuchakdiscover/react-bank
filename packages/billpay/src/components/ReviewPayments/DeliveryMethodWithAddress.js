import React from "react";
import PropTypes from "prop-types";
import DeliveryMethod from "../reusable/DeliveryMethod";
import { formatZip } from "reusable/lib/formattingUtils";

function DeliveryMethodWithAddress({ address, method, ...props }) {
  return (
    <>
      <DeliveryMethod iconSize={20} method={method} {...props} />
      {(method === "TRUST_CHECK" || "DIRECT_CHECK") && address && (
        <address>
          {address.streetAddress}
          <br />
          {address.extendedAddress && (
            <>
              {address.extendedAddress}
              <br />
            </>
          )}
          {address.locality}, {address.region} {formatZip(address.postalCode)}
        </address>
      )}
    </>
  );
}

DeliveryMethodWithAddress.propTypes = {
  method: PropTypes.string,
  address: PropTypes.shape({
    streetAddress: PropTypes.string.isRequired,
    extendedAddress: PropTypes.string,
    locality: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
  }),
};

export default DeliveryMethodWithAddress;
