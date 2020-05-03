import React from "react";
import PropTypes from "prop-types";
import DefinitionList from "reusable/lib/DefinitionList";
import {
  formatCurrency,
  nickNameWithLastFour,
  formatZip,
} from "reusable/lib/formattingUtils";
import DeliveryMethod from "../reusable/DeliveryMethod";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import frequencies from "../../utils/frequencies";
import styles from "./SummaryDetails.module.scss";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";

function SummaryDetails({ payment, accounts, forcedOneTime }) {
  const isAutoPay = payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY;

  function isFullAddressAvailable() {
    if (!payment.payee.hasOwnProperty("address")) return false;
    const requiredProperties = [
      "streetAddress",
      "locality",
      "region",
      "postalCode",
    ];
    return requiredProperties.every((r) =>
      Object.keys(payment.payee.address).includes(r)
    );
  }

  return (
    <React.Fragment key={payment.payee.id}>
      <DefinitionList
        key={payment.payee.id}
        items={[
          ...(payment.confirmationNumber
            ? [
                {
                  divClass: styles.confirmationNumber,
                  label: "Confirmation Number",
                  value: payment.confirmationNumber,
                },
              ]
            : []),
          {
            label: "Pay From",
            value: nickNameWithLastFour(
              accounts.find((a) => payment.payFrom === a.id)
            ),
          },
          {
            label: "Amount",
            value: isAutoPay
              ? `${
                  payment.amountType === "amountDue"
                    ? "Amount Due"
                    : "Minimum Payment Due"
                } ${
                  payment.amount ? `(${formatCurrency(payment.amount)})` : ""
                }`
              : formatCurrency(payment.amount),
          },
          ...(!forcedOneTime && !isAutoPay
            ? [{ label: "Frequency", value: frequencies[payment.frequency] }]
            : []),
          ...[
            {
              label:
                payment.frequency === FREQUENCY_TYPE.ONE_TIME || isAutoPay
                  ? "Deliver By"
                  : "Deliver First Payment By",
              value: isAutoPay
                ? payment.paymentDate === "ON_DUE_DATE"
                  ? "Due Date"
                  : "Date eBill Arrives"
                : formatDateStringToMDY(payment.deliverByDate),
            },
          ],
          ...(payment.frequency !== FREQUENCY_TYPE.ONE_TIME &&
          !forcedOneTime &&
          !isAutoPay
            ? [
                {
                  label: "Ends",
                  value:
                    payment.noOfPayments === ""
                      ? "Until I cancel"
                      : `After ${payment.noOfPayments} Payments`,
                },
              ]
            : []),

          {
            label: "Delivery Method",
            value: (
              <DeliveryMethod
                displayLongName
                method={payment.payee.deliveryMethod}
              />
            ),
          },
          ...(payment.payee.deliveryMethod !== "STANDARD_ELECTRONIC" &&
          isFullAddressAvailable()
            ? [
                {
                  label: "Address",
                  value: (
                    <>
                      {payment.payee.address.streetAddress}{" "}
                      {payment.payee.address.extendedAddress && <br />}
                      {payment.payee.address.extendedAddress}
                      <br />
                      {payment.payee.address.locality},{" "}
                      {payment.payee.address.region}{" "}
                      {formatZip(payment.payee.address.postalCode)}
                    </>
                  ),
                },
              ]
            : []),
          ...(payment.note !== "" &&
          payment.frequency === FREQUENCY_TYPE.ONE_TIME &&
          !forcedOneTime
            ? [{ label: "Note", value: payment.note }]
            : []),
          ...(payment.memo !== ""
            ? [{ label: "Memo", value: payment.memo }]
            : []),
        ]}
      />
    </React.Fragment>
  );
}

SummaryDetails.propTypes = {
  accounts: PropTypes.array.isRequired,
  payment: PropTypes.object.isRequired,
  forcedOneTime: PropTypes.bool.isRequired,
};

export default SummaryDetails;
