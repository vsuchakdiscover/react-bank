import React from "react";
import PropTypes from "prop-types";
import { STATUS } from "./schedulePaymentReducer";
import {
  formatCurrency,
  nickNameWithLastFour,
  stripCurrencyFormatting,
} from "reusable/lib/formattingUtils";
import BlueBox from "reusable/lib/BlueBox";
import GraySummaryBox from "./GraySummaryBox";
import { parseErrors } from "../../api/apiUtils";
import SummaryDetails from "./SummaryDetails";
import styles from "./Step2.module.scss";
import { paymentsApi } from "../../api/";
import ButtonGroup from "reusable/lib/ButtonGroup";
import HR from "reusable/lib/HR";
import InnerCard from "./InnerCard";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";
import { useHistory } from "react-router-dom";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import { clickTrack } from "reusable/lib/tracking";

function Step2({
  dispatch,
  selectedPayments,
  accounts,
  editPaymentId,
  forcedOneTime,
}) {
  useTrackPageLoad(
    editPaymentId
      ? "bankac/billpay/makePayments/verifyeditrepeatpymt"
      : "bankac/billpay/verifyPayment"
  );
  const history = useHistory();
  function buildSavePaymentRequest(payment) {
    if (payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY) {
      const request = {
        payee: {
          id: payment.payee.id,
        },
        paymentMethod: {
          id: payment.payFrom,
        },
        automaticPayment: {
          amount:
            payment.amountType === "amountDue"
              ? "PAY_FULL_BALANCE"
              : "PAY_MINIMUM_BALANCE",
          paymentDate: payment.paymentDate,
        },
      };
      return request;
    } else {
      const request = {
        payee: {
          id: payment.payee.id,
        },
        amount: Number(stripCurrencyFormatting(payment.amount)),
        paymentMethod: {
          id: payment.payFrom,
        },
        deliverByDate: payment.deliverByDate,
        frequency: payment.frequency,
      };

      if (payment.frequency === FREQUENCY_TYPE.ONE_TIME) {
        request.note = payment.note;
      } else if (payment.hasOwnProperty("noOfPayments")) {
        request.noOfPayments = payment.noOfPayments;
      }
      if (payment.payee.deliveryMethod !== "STANDARD_ELECTRONIC") {
        request.memo = payment.memo;
      }
      if (payment.payee.hasOwnProperty("ebill")) {
        if (payment.payee.ebill.status === "UNPAID") {
          request.billId = payment.payee.ebill.id;
        }
      }
      return request;
    }
  }

  async function handleSubmitStep2(event) {
    event.preventDefault();
    dispatch(["status", STATUS.SUBMITTING]);
    clickTrack(
      editPaymentId
        ? "MAKE_BILL_PAYMENTS_VERIFY_EDIT_REPEAT_PYMT_SUBMIT_BTN"
        : "MAKE_BILL_PAYMENTS_VERIFY_SUBMIT_BTN"
    );
    const assignEndpoint = (payment) => {
      if (editPaymentId && payment.frequency === FREQUENCY_TYPE.ONE_TIME) {
        return paymentsApi.editScheduledPayment(
          buildSavePaymentRequest(payment),
          editPaymentId
        );
      }

      return payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY
        ? paymentsApi.automaticPayment(buildSavePaymentRequest(payment))
        : paymentsApi.schedulePayments(buildSavePaymentRequest(payment));
    };

    await Promise.all(
      selectedPayments.map(async (payment) => {
        try {
          const { data } = await assignEndpoint(payment);

          dispatch([
            "setPaymentStatus",
            {
              payment: data,
              success: true,
              errorMsg: "",
            },
          ]);
        } catch (err) {
          const errors = parseErrors(err);
          let errorMsg = "";
          if (errors.length === 0) {
            console.error(
              "Call failed, but no errors returned from service call in Step2.js"
            );
            return history.push("/tech-diff");
          }

          errorMsg = errors.find(
            (e) =>
              e.code === "Payment.Duplicate" ||
              e.code === "Payment.Exceeds.DailyLimit"
          );

          // Not a general tech diff, so mark this payment's status as failed.
          dispatch(["setPaymentStatus", { payment, success: false, errorMsg }]);
        }
      })
    );
    dispatch(["status", STATUS.STEP3]);
  }

  return (
    <InnerCard>
      <BlueBox className="mb-25" header="Payment Details">
        {selectedPayments.map((payment, index) => (
          <React.Fragment key={payment.payee.id}>
            {index > 0 && <HR />}
            <p className={styles.verifySubtitle}>
              <strong>
                {payment.amount && formatCurrency(payment.amount)}
              </strong>{" "}
              Payment to <strong>{nickNameWithLastFour(payment.payee)}</strong>
            </p>
            <SummaryDetails
              payment={payment}
              accounts={accounts}
              forcedOneTime={forcedOneTime}
            />
          </React.Fragment>
        ))}
      </BlueBox>
      {!editPaymentId && (
        <GraySummaryBox
          accounts={accounts}
          selectedPayments={selectedPayments}
        />
      )}
      <ButtonGroup>
        <Button type="submit" onClick={handleSubmitStep2}>
          Submit
        </Button>
        <ButtonGroup.Link>
          <Button
            adobeEvent={
              editPaymentId
                ? "MAKE_BILL_PAYMENTS_VERIFY_EDIT_REPEAT_PYMT_BACK_LNK"
                : "MAKE_BILL_PAYMENTS_VERIFY_RESET_LNK"
            }
            buttonStyle={BUTTON_TYPES.LINK}
            onClick={() => dispatch(["status", STATUS.STEP1])}
          >
            Back
          </Button>
        </ButtonGroup.Link>
      </ButtonGroup>
    </InnerCard>
  );
}

Step2.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedPayments: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  editPaymentId: PropTypes.string,
  forcedOneTime: PropTypes.bool.isRequired,
};

export default Step2;
