/* eslint-disable react/display-name */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import DataTable from "reusable/lib/DataTable";
import styles from "./RepeatingPaymentsModal.module.scss";
import FieldValue from "reusable/lib/FieldValue";
import { getFrequencyLabel } from "../../utils/frequencies";
import { getPaymentStatusLabel } from "../../utils/paymentStatuses";
import dateUtils from "reusable/lib/dateUtils";
import PrintButton from "reusable/lib/PrintButton";
import DeliveryMethodWithAddress from "../ReviewPayments/DeliveryMethodWithAddress";
import GrayCalendarIcon from "reusable/lib/GrayCalendarIcon";
import RevolvingIcon from "reusable/lib/RevolvingIcon";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import ErrorIcon from "reusable/lib/ErrorIcon";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import cx from "classnames";

function RepeatingPaymentsModal({
  adobeEventOnExpandRow,
  adobeEventOnCollapseRow,
  adobeEvent,
  payments,
  account,
  onEditClick,
  onDeleteAllClick,
  onClose,
  payees,
  onDeleteScheduledClick,
  isPaymentHistory,
}) {
  const tableRef = useRef();
  useTrackPageLoad(adobeEvent);
  return (
    <Modal
      aria-label={
        isPaymentHistory
          ? "Review your payment history"
          : "Review your upcoming payments"
      }
      onClose={onClose}
      blueCircleIconModal
      blueCircleIcon={
        isPaymentHistory ? (
          <RevolvingIcon width={40} />
        ) : (
          <GrayCalendarIcon width={40} />
        )
      }
    >
      {isPaymentHistory ? (
        payments.length > 0 ? (
          <p className="overlayHeader text-center mr-0">
            Repeating Payment History to{" "}
            {nickNameWithLastFour(payments[0].payee)}
          </p>
        ) : (
          <p>There is no payment history for this repeating payment.</p>
        )
      ) : (
        <>
          <p className="overlayHeader text-center mr-0">{`You have ${
            payments.length
          } upcoming payment${payments.length > 1 ? "s" : ""} to ${
            account.name
          }`}</p>
          <p className="text-center mb-20">
            Reminder: You can only have one repeating payment at a time.
          </p>
        </>
      )}
      <PaymentTable
        adobeEventOnExpandRow={adobeEventOnExpandRow}
        adobeEventOnCollapseRow={adobeEventOnCollapseRow}
        isPaymentHistory={isPaymentHistory}
        onEditClick={onEditClick}
        data={payments}
        className={styles.root}
        onClose={onClose}
        payees={payees}
        onDeleteScheduledClick={onDeleteScheduledClick}
        ref={tableRef}
      />
      {isPaymentHistory && (
        <PrintButton
          className={cx(styles.printButton, styles.floatRight)}
          ref={tableRef}
        ></PrintButton>
      )}
      {!isPaymentHistory && (
        <ButtonGroup>
          <Button
            adobeEvent="MAKE_BILL_PAYMENTS_UPCOMING_PYMTS_OVERLAY_DELETE_ALL_BTN"
            buttonStyle={BUTTON_TYPES.GHOST}
            onClick={(e) => onDeleteAllClick(e, payments)}
          >
            Delete All
          </Button>
          <ButtonGroup.Link>
            <Button
              adobeEvent="MAKE_BILL_PAYMENTS_UPCOMING_PYMTS_OVERLAY_GO_BACK_LNK"
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={onClose}
            >
              Go Back
            </Button>
          </ButtonGroup.Link>
        </ButtonGroup>
      )}
    </Modal>
  );
}

RepeatingPaymentsModal.propTypes = {
  adobeEventOnExpandRow: PropTypes.string,
  adobeEventOnCollapseRow: PropTypes.string,
  adobeEvent: PropTypes.string,
  isPaymentHistory: PropTypes.bool,
  payments: PropTypes.array.isRequired,
  account: PropTypes.object.isRequired,
  onDeleteAllClick: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onEditClick: PropTypes.func,
  payees: PropTypes.array.isRequired,
  onDeleteScheduledClick: PropTypes.func,
};

RepeatingPaymentsModal.defaultProps = {
  isPaymentHistory: false,
};

const PaymentTable = React.forwardRef(
  (
    {
      adobeEventOnExpandRow,
      adobeEventOnCollapseRow,
      data,
      onEditClick,
      payees,
      onDeleteScheduledClick,
      isPaymentHistory,
    },
    ref
  ) => {
    function ExpandableRow({ data }) {
      const DataGrid = ({ data }) => {
        const payee = payees.find((p) => p.id === data.payee.id);
        const ref = useRef();

        return (
          <div className={styles.expandableRowContent} ref={ref}>
            <FieldValue label="Status">
              {getPaymentStatusLabel(data.status)}
            </FieldValue>

            {!isPaymentHistory && (
              <FieldValue label="Payee">
                {nickNameWithLastFour(data.payee)}
              </FieldValue>
            )}

            <FieldValue label="Scheduled On">
              {dateUtils.formatDateStringToMDY(data.scheduledOn)}
            </FieldValue>

            <FieldValue
              label={`Deliver ${
                data.type === "REPEATING" ? "First Payment" : ""
              } By`}
            >
              {dateUtils.formatDateStringToMDY(data.deliverByDate)}
            </FieldValue>

            {!isPaymentHistory && data.type !== "EBILL_AUTOPAY" && (
              <FieldValue label="Frequency">
                {getFrequencyLabel(data.type)}
              </FieldValue>
            )}

            {!isPaymentHistory && data.type === "REPEATING" && (
              <FieldValue label="Ends">
                {payee.repeatingPayment.noOfPayments
                  ? `After ${payee.repeatingPayment.noOfPayments}  Payments`
                  : "Never"}
              </FieldValue>
            )}

            <FieldValue label="Delivery Method">
              <DeliveryMethodWithAddress
                address={data.paymentAddress}
                method={data.deliveryMethod}
                displayLongName
              />
            </FieldValue>

            {!isPaymentHistory && (
              <div className={styles.actionButtons}>
                <Button
                  adobeEvent="MAKE_BILL_PAYMENTS_UPCOMING_PYMTS_OVERLAY_PYMT_EDIT_LNK"
                  onClick={(e) => onEditClick(e, data)}
                >
                  Edit
                </Button>

                <Button
                  adobeEvent="MAKE_BILL_PAYMENTS_UPCOMING_PYMTS_OVERLAY_PYMT_DELETE_LNK"
                  buttonStyle={BUTTON_TYPES.LINK}
                  onClick={(e) => onDeleteScheduledClick(e, data)}
                >
                  Delete
                </Button>
              </div>
            )}

            <PrintButton className={styles.printButton} ref={ref}></PrintButton>
          </div>
        );
      };
      return <DataGrid data={data} />;
    }

    return (
      <div className={styles.root} ref={ref}>
        <DataTable
          adobeEventOnExpandRow={adobeEventOnExpandRow}
          adobeEventOnCollapseRow={adobeEventOnCollapseRow}
          className={styles.table}
          columns={[
            {
              Header: isPaymentHistory ? "Delivered By" : "Deliver By",
              accessor: "deliverByDate",
              Cell: ({ cell }) => (
                <>
                  <FieldValue
                    label={isPaymentHistory ? "Delivered By" : "Deliver By"}
                    mobileOnlyLabel
                  >
                    {dateUtils.formatDateStringToMDY(cell.value)}
                    {/* Hide repeating icon for paymentHistory modal, since it would be redundant */}
                    {!isPaymentHistory &&
                      cell.row.original.type === "REPEATING" && (
                        <RevolvingIcon className={styles.iconPadding} />
                      )}

                    {isPaymentHistory &&
                      cell.row.original.status === "FAILED" && (
                        <ErrorIcon
                          size="small"
                          className={styles.iconPadding}
                        />
                      )}
                  </FieldValue>
                </>
              ),
              className: styles.deliverByCell,
              headerClassName: styles.deliverByCell,
            },
            {
              Header: isPaymentHistory ? "Paid From" : "Pay From",
              accessor: "paymentMethod.accountName",
              Cell: ({ cell }) => (
                <FieldValue label="Pay From" mobileOnlyLabel>
                  {nickNameWithLastFour(cell.row.original.paymentMethod)}
                </FieldValue>
              ),
              className: styles.payeeCell,
              headerClassName: styles.payeeCell,
            },
            {
              Header: "Amount",
              accessor: "amount",
              Cell: ({ cell }) => (
                <FieldValue label="Amount" mobileOnlyLabel>
                  {`$${cell.value.toFixed(2)}`}
                </FieldValue>
              ),
              className: styles.amountCell,
              headerClassName: styles.amountCell,
            },
          ]}
          data={data}
          expandableRow={ExpandableRow}
          expandableRowClassName={styles.expandableRow}
          hasLoadMorePagination
          loadMoreText="View More"
          pageSize={50}
          initialSortBy={[{ id: "deliverByDate", desc: false }]}
          expanderAriaLabelCallback={({ isExpanded, original }) =>
            `${
              isExpanded ? "Collapse" : "Expand"
            } details for $${original.amount.toFixed(
              2
            )} payment on ${dateUtils.formatDateStringToMDY(
              original.deliverByDate
            )}`
          }
        />
      </div>
    );
  }
);

PaymentTable.propTypes = {
  adobeEventOnExpandRow: PropTypes.string,
  adobeEventOnCollapseRow: PropTypes.string,
  isPaymentHistory: PropTypes.bool,
  data: PropTypes.array.isRequired,
  cell: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteScheduledClick: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  payees: PropTypes.array.isRequired,
};

PaymentTable.defaultProps = {
  isPaymentHistory: false,
};

export default RepeatingPaymentsModal;
