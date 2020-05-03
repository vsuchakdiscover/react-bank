/* eslint-disable react/prop-types */
import React, { useRef, useContext, useState } from "react";
import BlueBox from "reusable/lib/BlueBox";
import DataTable from "reusable/lib/DataTable";
import styles from "./ActivityTable.module.scss";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import PrintButton from "reusable/lib/PrintButton";
import Spinner from "reusable/lib/Spinner";
import SmartLink from "reusable/lib/SmartLink";
import { ebillsApi } from "../../api";
import { formatDateStringToMDY } from "reusable/lib/dateUtils";
import FieldValue from "reusable/lib/FieldValue";
import LinksList from "reusable/lib/LinksList";
import LastFourMask from "reusable/lib/LastFourMask";
import { useHistory } from "react-router";
import Modal from "reusable/lib/Modal";
import SuccessIcon from "reusable/lib/SuccessIcon";
import WarningIcon from "reusable/lib/WarningIcon";
import { pageTrack } from "reusable/lib/tracking";
import cx from "classnames";

const ActivityContext = React.createContext();

const ActivityTable = ({ data, loading, setData }) => {
  const printRef = useRef();
  const [showModal, setShowModal] = useState(null);

  async function handleMarkAsPaidClick(ebill) {
    try {
      await ebillsApi.fileEbill(ebill.id);
      const updatedActivityTableData = data.map((payee) => {
        if (payee.id === ebill.payeeId) {
          const newEbillList = payee.ebillList.map((_ebill) => {
            return ebill.id === _ebill.id
              ? { ..._ebill, status: "MARKED_PAID" }
              : _ebill;
          });
          return { ...payee, ebillList: newEbillList };
        }
        return payee;
      });
      setShowModal("success");
      setData(updatedActivityTableData);
      pageTrack("bankac/billpay/manageEBills/payment-marked-paid-success");
    } catch (err) {
      setShowModal("error");
      pageTrack("bankac/billpay/manageEBills/payment-marked-paid-error");
      console.error(err);
    }
  }

  return (
    <ActivityContext.Provider
      value={{
        onMarkAsPaidClick: handleMarkAsPaidClick,
      }}
    >
      <div className={styles.printRow}>
        <PrintButton ref={printRef} className={styles.printBtn} />
      </div>
      <BlueBox
        id="activity-bluebox"
        ref={printRef}
        header="Activity"
        childrenClassName={styles.blueBoxContent}
      >
        <DataTable
          adobeEventOnExpandRow="MANAGE_EBILLS_ACTIVITY_PAYEE_EXPAND"
          className={styles.table}
          columns={[
            {
              Header: "Payee",
              accessor: "nickName",
              Cell: PayeeCell,
              headerClassName: styles.payeeCell,
              className: styles.payeeCell,
            },
            {
              Header: "Due Date",
              accessor: "ebillList[0].dueDate",
              Cell: DueDateCell,
              headerClassName: styles.dueDateCell,
              className: styles.dueDateCell,
            },
            {
              Header: "Amount",
              accessor: "ebillList[0]",
              Cell: AmountCell,
              className: styles.amountCell,
              headerClassName: styles.amountHeader,
            },
            {
              Header: "Status",
              Cell: StatusCell,
              accessor: "ebillList[0].status",
              headerClassName: styles.alignRight,
              className: styles.statusCell,
            },
            {
              id: "operations",
              Cell: OperationsCell,
              className: styles.operationCell,
              headerClassName: styles.operationCell,
            },
          ]}
          loadingText={
            <div className={styles.positionSpinner}>
              <Spinner center={false} />
            </div>
          }
          loading={loading}
          data={data}
          expandableRow={ExpandableRow}
          expandableRowClassName={styles.expandableRow}
          isRowExpandableCallback={({ original }) => {
            // Only rows with more than one ebill should be expandable
            return original.ebillList.length > 1;
          }}
          emptyRowsText={<p>No activity found</p>}
        />
      </BlueBox>
      {showModal && (
        <Modal
          aria-label={
            showModal === "success"
              ? "Your ebill has been marked as paid"
              : "Your ebill couldn&apos;t be marked paid"
          }
          onClose={() => setShowModal(false)}
        >
          {showModal === "success" ? (
            <div>
              <p className={cx("overlayHeader", styles.successBanner)}>
                <SuccessIcon /> Your ebill has been marked paid
              </p>
              <Button onClick={() => setShowModal(false)}>Got it</Button>
            </div>
          ) : (
            <>
              <p className={cx("overlayHeader", styles.successBanner)}>
                <WarningIcon /> Your ebill couldn&apos;t be marked paid
              </p>
              <p>Please try again later.</p>
              <Button onClick={() => setShowModal(false)}>Okay</Button>
            </>
          )}
        </Modal>
      )}
    </ActivityContext.Provider>
  );
};

function PayeeCell({ cell }) {
  return (
    <FieldValue>
      {cell.row.original.nickName}{" "}
      {cell.row.original.accountNumber &&
        cell.row.original.accountNumber !== "" && (
          <LastFourMask value={cell.row.original.accountNumber} />
        )}
    </FieldValue>
  );
}

function ExpandableRow({ data, isPrint = false, isMobile }) {
  // Remove the first item from array
  const ebillListWithoutFirst = data.ebillList.filter(
    (_, index) => index !== 0
  );
  return (
    <DataTable
      className={styles.table}
      columns={[
        {
          Header: "Payee",
          accessor: "nickName",
          Cell: PayeeCell,
          className: styles.emptyPayeeCell,
        },
        {
          accessor: "dueDate",
          Cell: DueDateCell,
          headerClassName: styles.dueDateCell,
          className: styles.dueDateCell,
        },
        {
          Header: "Amount",
          Cell: HistoryAmountCell,
          headerClassName: styles.alignRight,
          className: styles.amountCell,
          show: !isMobile,
        },
        {
          Header: "Status",
          Cell: StatusCell,
          accessor: "status",
          headerClassName: styles.column,
          className: styles.statusCell,
          show: !isMobile,
        },
        {
          id: "operations",
          Cell: HistoryOperationsCell,
          show: !isMobile,
          className: styles.operationCell,
        },
      ]}
      hasHeader={false}
      data={ebillListWithoutFirst}
      hasLoadMorePagination
      adobeEventOnLoadMore="MANAGE_EBILLS_ACTIVITY_PAYEE_DETAILS_VIEW_MORE_LNK"
      pageSize={5}
    />
  );
}

function OperationsCell({ cell }) {
  const history = useHistory();
  const { onMarkAsPaidClick } = useContext(ActivityContext);
  return (
    <FieldValue>
      <LinksList>
        {cell.row.original.ebillList[0].status === "UNPAID" && (
          <>
            <Button
              adobeEvent="MANAGE_EBILLS_ACTIVITY_PAYEE_PAY_BILL_LNK"
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={() => {
                history.push(`/?open=${cell.row.original.id}`);
              }}
            >
              Pay Bill
            </Button>
            <Button
              adobeEvent="MANAGE_EBILLS_ACTIVITY_PAYEE_DETAILS_MARK_AS_PAID_LNK"
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={() => onMarkAsPaidClick(cell.row.original.ebillList[0])}
            >
              Mark as Paid
            </Button>
          </>
        )}
        <SmartLink
          target="_blank"
          rel="noopener noreferrer"
          to={cell.row.original.ebillList[0].paymentURIDetails}
          aria-label="Opens a new browser window"
          adobeEvent="MANAGE_EBILLS_ACTIVITY_PAYEE_DETAILS_VIEW_BILL_LNK"
        >
          View Bill
        </SmartLink>
      </LinksList>
    </FieldValue>
  );
}

function HistoryOperationsCell({ cell }) {
  const { onMarkAsPaidClick } = useContext(ActivityContext);
  return (
    <FieldValue>
      <LinksList>
        {cell.row.original.status === "UNPAID" && (
          <Button
            adobeEvent="MANAGE_EBILLS_ACTIVITY_PAYEE_MARK_AS_PAID_LNK"
            buttonStyle={BUTTON_TYPES.LINK}
            onClick={() => onMarkAsPaidClick(cell.row.original)}
          >
            Mark as Paid
          </Button>
        )}
        <SmartLink
          target="_blank"
          rel="noopener noreferrer"
          to={cell.row.original.paymentURIDetails}
          aria-label="Opens a new browser window"
          adobeEvent="MANAGE_EBILLS_ACTIVITY_PAYEE_VIEW_BILL_LNK"
        >
          View Bill
        </SmartLink>
      </LinksList>
    </FieldValue>
  );
}

function AmountCell({ cell }) {
  return (
    <FieldValue label="Amount" mobileOnlyLabel>
      <span className={styles.amountDescription}>Amount Due</span>{" "}
      <span className={styles.floatRight}>{`$${cell.value.totalDue.toFixed(
        2
      )}`}</span>
      <br />
      {cell.value.minimumDue && (
        <>
          <span className={styles.amountDescription}>Min Due</span>
          <span
            className={styles.floatRight}
          >{`$${cell.value.minimumDue.toFixed(2)}`}</span>
        </>
      )}
    </FieldValue>
  );
}

function HistoryAmountCell({ cell }) {
  return (
    <FieldValue label="Amount" mobileOnlyLabel>
      <span className={styles.amountDescription}>Amount Due</span>{" "}
      <span
        className={styles.floatRight}
      >{`$${cell.row.original.totalDue.toFixed(2)}`}</span>
      <br />
      {cell.row.original.minimumDue && (
        <>
          <span className={styles.amountDescription}>Min Due</span>
          <span
            className={styles.floatRight}
          >{`$${cell.row.original.minimumDue.toFixed(2)}`}</span>
        </>
      )}
      {cell.row.original.availableBalance && (
        <>
          <span className={styles.amountDescription}>Available Balance</span>
          <span
            className={styles.floatRight}
          >{`$${cell.row.original.availableBalance.toFixed(2)}`}</span>
        </>
      )}
    </FieldValue>
  );
}

function StatusCell({ cell }) {
  const getStatusText = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Scheduled";
      case "UNPAID":
        return "Unpaid";
      case "PAID":
        return "Paid";
      case "MARKED_PAID":
        return "Marked as Paid";

      default:
        console.error(
          "Invalid status type: Should be SCHEDULED, UNPAID, PAID, or MARKED_PAID"
        );
        break;
    }
  };
  return (
    <FieldValue label="Status" mobileOnlyLabel>
      {getStatusText(cell.value)}
    </FieldValue>
  );
}

function DueDateCell({ cell }) {
  return (
    <FieldValue label="Due Date" mobileOnlyLabel>
      {formatDateStringToMDY(cell.value)}
    </FieldValue>
  );
}

export default ActivityTable;
