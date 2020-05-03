import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Checkbox from "reusable/lib/Checkbox";
import Accordion from "reusable/lib/Accordion";
import Card from "reusable/lib/Card";
import EBillLinkIcon from "reusable/lib/EBillLinkIcon";
import styles from "./PayeeCard.module.scss";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import InnerPayeeCard from "./InnerPayeeCard";
import RadioFieldset from "reusable/lib/RadioFieldset";
import RadioButton, { RadioSubField } from "reusable/lib/RadioButton";
import { useHistory } from "react-router";
import cx from "classnames";
import queryString from "query-string";
import Tooltip from "reusable/lib/Tooltip";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import { EBILL_STATUS } from "../Ebills/Ebills";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";

const PayeeCard = ({
  accounts,
  onBlur,
  dispatch,
  onCheckPayee,
  payment,
  scheduledPayments,
  errors,
  editPaymentId,
  forcedOneTime,
  onViewPaymentsClick,
}) => {
  const location = useLocation();
  const autoOpenRef = useRef(null);
  const selectedPayeeId = queryString.parse(location.search).open;
  // Scroll smoothly to selectedPayeeId on load if specified in URL

  const history = useHistory();
  useEffect(() => {
    if (autoOpenRef.current) {
      setTimeout(() => {
        window.scrollTo({
          top: autoOpenRef.current.getBoundingClientRect().top - 30,
          behavior: "smooth",
        });
      }, 200);
    }
  }, []);

  function handleChange({ target }) {
    dispatch([
      "changePayment",
      {
        name: target.name,
        value: target.value,
        payment,
      },
    ]);
  }

  function renderInnerPayee({ autoPay, oneTimeOnly, repeatingOnly }) {
    return (
      <InnerPayeeCard
        accounts={accounts}
        onBlur={onBlur}
        onChange={handleChange}
        oneTimeOnly={oneTimeOnly}
        autoPay={autoPay}
        dispatch={dispatch}
        payee={payee}
        payment={payment}
        repeatingOnly={repeatingOnly}
        scheduledPayments={scheduledPayments}
        errors={errors}
        editPaymentId={editPaymentId}
        forcedOneTime={forcedOneTime}
        showAutoPayBanner={showAutoPayBanner}
        onViewPaymentsClick={onViewPaymentsClick}
        autoEnrolled={autoEnrolled}
        repeatingPaymentId={repeatingPaymentId}
      />
    );
  }

  const payee = payment.payee;

  const ebillEnrolled = payee.ebillStatus === EBILL_STATUS.ACTIVE;
  const autoEnrolled =
    ebillEnrolled && payee.hasOwnProperty("automaticPayment");
  const useEbillLayout =
    (payee.hasOwnProperty("cardPaymentInfo") &&
      payee.ebillStatus !== EBILL_STATUS.ACTIVE &&
      !payee.hasOwnProperty("repeatingPayment")) ||
    (ebillEnrolled &&
      !payee.hasOwnProperty("repeatingPayment") &&
      !autoEnrolled);

  const showAutoPayBanner =
    payee.hasOwnProperty("repeatingPayment") &&
    ebillEnrolled &&
    !payment.autoPay &&
    !autoEnrolled &&
    !editPaymentId &&
    !payment.autoPayBannerDismissed;

  const repeatingPaymentId = //get payees first repeating payment id in case it's needed for edit
    scheduledPayments.length &&
    scheduledPayments.find((s) => s.type === "REPEATING")
      ? scheduledPayments.find((s) => s.type === "REPEATING").paymentId
      : "";

  return (
    <Card className={styles.root}>
      {!editPaymentId && (
        <div
          className={styles.headerWrapper}
          ref={payee.id === selectedPayeeId ? autoOpenRef : null}
        >
          <Checkbox
            name="selected"
            id={payee.id + "-selected"}
            aria-label={
              (payment.selected ? "Deselect" : "Select") +
              " " +
              nickNameWithLastFour(payee)
            }
            onChange={onCheckPayee}
            checked={payment.selected}
            value={payee.id}
          >
            <div>
              <strong className={styles.payeeName}>
                {nickNameWithLastFour(payee)}
              </strong>{" "}
              {((payee.ebill &&
                payee.ebillStatus === EBILL_STATUS.PENDING_ACTIVATION) ||
                (!payee.ebill &&
                  payee.ebillStatus === EBILL_STATUS.ACTIVE)) && (
                <span className={cx(styles.ebillLink, "dark-gray")}>
                  <EBillLinkIcon />
                  eBill Enrolled
                </span>
              )}
              {payee.ebill && payee.ebillStatus === EBILL_STATUS.ACTIVE && (
                <>
                  <a
                    href={payee.ebill.paymentURIDetails}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ebillLink}
                    aria-label="Opens a new browser window"
                  >
                    <EBillLinkIcon />
                    View Bill
                  </a>
                  {payment.autoPayBannerDismissed && (
                    <Button
                      buttonStyle={BUTTON_TYPES.LINK}
                      className={styles.separator}
                      onClick={() => {
                        history.push(
                          `/edit-payment/${payment.payee.id}?${
                            autoEnrolled
                              ? "autoPayEdit"
                              : "onetime&autoPaySwitch"
                          }`
                        );
                      }}
                    >
                      {autoEnrolled ? "Edit" : "Switch to"} eBill AutoPay
                    </Button>
                  )}
                </>
              )}
            </div>
          </Checkbox>
        </div>
      )}
      <Accordion
        isOpen={payment.selected}
        data-testid={nickNameWithLastFour(payee) + " fieldset"}
      >
        <div
          className={cx(
            styles.accordionContent,
            editPaymentId ? styles.accordionFlush : ""
          )}
        >
          {" "}
          {useEbillLayout && !editPaymentId ? (
            <RadioFieldset
              className="mt-10"
              legend="Select Payment Frequency"
              hideLegend
              radioClass={styles.payeeRadioOptions}
            >
              <RadioButton
                id={payee.id + "-one-time-payment-radio"}
                label="One Time Payment"
                name="frequencyType"
                value={FREQUENCY_TYPE.ONE_TIME}
                checked={payment.frequencyType === FREQUENCY_TYPE.ONE_TIME}
                onChange={handleChange}
              >
                <RadioSubField className={styles.radioSubfield}>
                  {renderInnerPayee({
                    oneTimeOnly: true,
                  })}
                </RadioSubField>
              </RadioButton>
              <RadioButton
                id={payee.id + "-repeating-payment-radio"}
                label="Repeating Payment"
                value={FREQUENCY_TYPE.REPEATING}
                checked={payment.frequencyType === FREQUENCY_TYPE.REPEATING}
                onChange={handleChange}
                name="frequencyType"
              >
                <RadioSubField className={styles.radioSubfield}>
                  {renderInnerPayee({
                    repeatingOnly: true,
                  })}
                </RadioSubField>
              </RadioButton>
              {ebillEnrolled && !process.env.REACT_APP_HIDE_AUTOPAY && (
                <RadioButton
                  id={payee.id + "-autopay-radio"}
                  label="eBill AutoPay"
                  value={FREQUENCY_TYPE.EBILL_AUTOPAY}
                  checked={
                    payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY
                  }
                  onChange={handleChange}
                  name="frequencyType"
                  className={styles.autoPayRadio}
                  tooltip={
                    <Tooltip
                      ariaLabel="Additional information about eBill AutoPay."
                      width="500"
                    >
                      <p className={styles.tooltipHeader}>eBill AutoPay</p>
                      <p className="mb-0">
                        Automatically pay the minimum payment or full balance of
                        your eBill on the due date or date of arrival.
                      </p>
                    </Tooltip>
                  }
                >
                  <RadioSubField
                    className={cx(styles.radioSubfield, styles.autoPay)}
                  >
                    {renderInnerPayee({
                      autoPay: true,
                    })}
                  </RadioSubField>
                </RadioButton>
              )}
            </RadioFieldset>
          ) : (
            <>
              {renderInnerPayee({
                showAutoPayBanner,
                autoPay: payment.autoPay,
                oneTimeOnly: autoEnrolled,
              })}
            </>
          )}
        </div>
      </Accordion>
    </Card>
  );
};

PayeeCard.displayName = "PayeeCard";
PayeeCard.defaultProps = {
  autoPay: false,
};

PayeeCard.propTypes = {
  accounts: PropTypes.array.isRequired,
  autoPay: PropTypes.bool,
  errors: PropTypes.object.isRequired,
  onCheckPayee: PropTypes.func.isRequired,
  onViewPaymentsClick: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  editPaymentId: PropTypes.string,
  oneTimeOnly: PropTypes.string,
  repeatingOnly: PropTypes.string,
  payment: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  scheduledPayments: PropTypes.array.isRequired,
  forcedOneTime: PropTypes.bool.isRequired,
};

export default PayeeCard;
