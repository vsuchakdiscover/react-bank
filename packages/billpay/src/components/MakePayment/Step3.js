import React, { useRef } from "react";
import PropTypes from "prop-types";
import SuccessIcon from "reusable/lib/SuccessIcon";
import ErrorIcon from "reusable/lib/ErrorIcon";
import WarningIcon from "reusable/lib/WarningIcon";
import BlueBox from "reusable/lib/BlueBox";
import {
  formatCurrency,
  nickNameWithLastFour,
} from "reusable/lib/formattingUtils";
import styles from "./Step3.module.scss";
import PrintButton from "reusable/lib/PrintButton";
import HR from "reusable/lib/HR";
import GraySummaryBox from "./GraySummaryBox";
import DoNextLinks from "reusable/lib/DoNextLinks";
import SummaryDetails from "./SummaryDetails";
import { Link, useLocation } from "react-router-dom";
import InnerCard from "./InnerCard";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import { getFrequencyLabel } from "../../utils/frequencies";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";

function Step3({ selectedPayments, accounts, editPaymentId, forcedOneTime }) {
  const printRef = useRef();
  const location = useLocation();
  const getFrequencyText = (payment) => {
    if (payment.frequencyType === FREQUENCY_TYPE.EBILL_AUTOPAY) {
      return "eBill AutoPay";
    }
    if (payment.frequency !== FREQUENCY_TYPE.ONE_TIME) {
      return "repeating";
    }
  };

  useTrackPageLoad(
    editPaymentId
      ? "bankac/billpay/editPaymentConfirmation"
      : "bankac/billpay/paymentConfirmation",
    {
      prop42: `BillPay:No of Payees:${selectedPayments.length}`,
      events: "event19,event52",
      products: `s.products="${selectedPayments.map(
        (p) =>
          `BillPay;<OTP/Repeating>:Frequency:${getFrequencyLabel(
            p.frequency
          )};;;event19=${p.amount}`
      )}"`,
    }
  );

  return (
    <InnerCard>
      <BlueBox ref={printRef} className="mb-25" header="Payment Details">
        {selectedPayments.map((payment, index) => {
          const nick = nickNameWithLastFour(payment.payee);
          return (
            <React.Fragment key={index}>
              {index > 0 && <HR />}
              <>
                {payment.success ? (
                  <div className={styles.confirmSubtitle}>
                    <div
                      className={styles.statusBanner}
                      data-testid={nick + " success"}
                    >
                      <SuccessIcon />{" "}
                      <span>
                        Congratulations! Your {getFrequencyText(payment)}{" "}
                        payment to <strong>{nick}</strong> has been{" "}
                        {editPaymentId ? "updated" : "scheduled"}.
                      </span>
                    </div>
                    <PrintButton ref={printRef} />
                  </div>
                ) : (
                  <>
                    {payment.errorMsg?.code === "Payment.Duplicate" ? (
                      <>
                        <div className={styles.confirmSubtitle}>
                          <div
                            className={styles.statusBanner}
                            data-testid={nick + " error"}
                          >
                            <WarningIcon />{" "}
                            <span>
                              Looks like you&apos;ve already scheduled a payment
                              to <strong>{nick}</strong> for{" "}
                              <strong>{formatCurrency(payment.amount)}</strong>{" "}
                              from{" "}
                              <strong>
                                {nickNameWithLastFour(
                                  accounts.find((a) => payment.payFrom === a.id)
                                )}
                              </strong>{" "}
                              by{" "}
                              <strong>
                                {formatDateStringToMDY(payment.deliverByDate)}
                              </strong>
                              .
                            </span>
                          </div>
                          <PrintButton ref={printRef} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.confirmSubtitle}>
                          <div
                            className={styles.statusBanner}
                            data-testid={nick + " error"}
                          >
                            <ErrorIcon />{" "}
                            <span>
                              Your payment to <strong>{nick}</strong> could not
                              be completed. {payment.errorMsg?.message} Please
                              try again.
                            </span>
                          </div>
                          <PrintButton />
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
              <SummaryDetails
                payment={payment}
                accounts={accounts}
                forcedOneTime={forcedOneTime}
              />
            </React.Fragment>
          );
        })}
      </BlueBox>
      {!editPaymentId && (
        <GraySummaryBox
          // Pass only successfully saved payments to summary since error'd payments shouldn't be displayed in the summary.
          accounts={accounts}
          selectedPayments={selectedPayments.filter((s) => s.success)}
        />
      )}
      <DoNextLinks data-testid="do-next-links">
        <Link
          to={{
            path: "/",
            // If user clicks on this link, reinitialize the form by passing state that instructs the page to do so.
            state:
              location.pathname === "/" ||
              location.pathname.includes("edit-payment")
                ? { reinit: true }
                : "",
          }}
        >
          Make a Bill Payment
        </Link>
        <Link to="/manage-payees">Manage Payees</Link>
        <PrintButton
          fontSize={16}
          ref={printRef}
          label="Print This Page"
          hideIcon
        />
      </DoNextLinks>
    </InnerCard>
  );
}

Step3.propTypes = {
  selectedPayments: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  editPaymentId: PropTypes.string,
  forcedOneTime: PropTypes.bool.isRequired,
};

export default Step3;
