/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useRef, useState } from "react";
import BlueBox from "reusable/lib/BlueBox";
import DataTable from "reusable/lib/DataTable";
import dateUtils from "reusable/lib/dateUtils";
import FieldValue from "reusable/lib/FieldValue";
import PrintButton from "reusable/lib/PrintButton";
import Spinner from "reusable/lib/Spinner";
import { getDeliveryMethod } from "../../utils/deliveryMethod";
import { getFrequencyLabel } from "../../utils/frequencies";
import { getPaymentStatusLabel } from "../../utils/paymentStatuses";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import DeliveryMethod from "../reusable/DeliveryMethod";
import DeliverByDateCell from "./DeliverByDateCell";
import DeliveryMethodWithAddress from "./DeliveryMethodWithAddress";
import ExpandableSection from "./ExpandableSection";
import {
  filterByDateRange,
  filterByPaymentStatus,
  filterExactMultipleOr,
} from "./filterTypes";
import PaymentHistoryFilterForm from "./PaymentHistoryFilterForm";
import styles from "./PaymentHistoryTable.module.scss";

function PaymentHistoryTable({ loading, payments }) {
  const [expandableOpen, setExpandableOpen] = useState(false);

  const initialFilterValues = {
    status: ["processing", "completed", "failed", "other"],
  };

  const [filterValues, setFilterValues] = useState(initialFilterValues);

  const paymentsWithoutScheduled = payments.filter(
    (p) => p.status !== "SCHEDULED"
  );

  const handleCancel = () => {
    setExpandableOpen(false);
  };

  return (
    <div className={styles.root}>
      <BlueBox
        childrenClassName={styles.blueBoxContent}
        header="Payment History"
      >
        <>
          <ExpandableSection
            adobeEvent="BillPay:ReviewPayments:History:Icon:Expand"
            className={styles.expandableSection}
            id="search"
            label="Search"
            open={expandableOpen}
            onToggle={(openState) => setExpandableOpen(openState)}
          >
            <PaymentHistoryFilterForm
              payments={paymentsWithoutScheduled}
              initialValues={{ ...initialFilterValues }}
              values={filterValues}
              onSubmit={setFilterValues}
              onCancel={handleCancel}
            />
          </ExpandableSection>
          <DataTable
            className={styles.table}
            columns={[
              {
                Header: "Delivered By",
                accessor: "deliverByDate",
                Cell: DeliverByDateCell,
                filter: filterByDateRange,
                className: styles.deliverByCell,
                headerClassName: styles.deliverByCell,
              },
              {
                Header: "Paid To",
                accessor: "payee.nickName",
                Cell: ({ cell }) => {
                  return (
                    <FieldValue label="Paid To" mobileOnlyLabel>
                      {nickNameWithLastFour(cell.row.original.payee)}
                    </FieldValue>
                  );
                },
                filter: filterExactMultipleOr,
                className: styles.payeeCell,
                headerClassName: styles.payeeCell,
              },
              {
                Header: "Paid From",
                accessor: "paymentMethod.accountName",
                Cell: ({ cell }) => (
                  <FieldValue label="Paid From" mobileOnlyLabel>
                    {nickNameWithLastFour(cell.row.original.paymentMethod)}
                  </FieldValue>
                ),
                filter: filterExactMultipleOr,
                className: styles.payFromCell,
                headerClassName: styles.payFromCell,
              },
              {
                Header: "Delivery Method",
                accessor: "deliveryMethod",
                Cell: ({ cell }) => (
                  <FieldValue label="Delivery Method" mobileOnlyLabel>
                    <DeliveryMethod iconSize={20} method={cell.value} />
                  </FieldValue>
                ),
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
              {
                accessor: "status",
                show: false,
                filter: filterByPaymentStatus,
              },
            ]}
            data={paymentsWithoutScheduled}
            rowDetailAriaLabelCallback={rowDetailAriaLabelCallback}
            expanderAriaLabelCallback={expanderArialLabelCallback}
            expanderCellClassName={styles.expanderCell}
            expandableRow={ExpandableRow}
            expandableRowClassName={styles.expandableRow}
            expandableToggleIconSize={15}
            filterValues={filterValues}
            hasLoadMorePagination
            hasSorting
            initialSortBy={[{ id: "deliverByDate", desc: true }]}
            loading={loading}
            loadingText={
              <div className={styles.positionSpinner}>
                <Spinner center={false} />
              </div>
            }
            noResultsText="There are no payments found. Please modify your search criteria and try again."
            pageSize={5}
            rowClassName={styles.tableRow}
          />
        </>
      </BlueBox>
    </div>
  );
}

function ExpandableRow({ data }) {
  const DataGrid = ({ data }) => {
    const printRef = useRef();

    return (
      <>
        <div className={styles.expandableRowGrid}>
          <div className={styles.expandableRowCol1}>
            <FieldValue label="Status">
              {getPaymentStatusLabel(data.status)}
            </FieldValue>
          </div>
          <div className={styles.expandableRowCol2}>
            <FieldValue label="Confirmation Number">
              {data.confirmationNumber}
            </FieldValue>
          </div>
        </div>

        <div className={styles.expandableRowGrid}>
          <div className={styles.expandableRowCol1}>
            <FieldValue label="Delivery Method">
              <DeliveryMethodWithAddress
                address={data.paymentAddress}
                method={data.deliveryMethod}
              />
            </FieldValue>
          </div>

          <div className={styles.expandableRowCol2}>
            <FieldValue label="Frequency">
              {getFrequencyLabel(data.type)}
            </FieldValue>
          </div>

          <div className={styles.expandableRowCol3}>
            <FieldValue label="Scheduled On">
              {dateUtils.formatDateStringToMDY(data.scheduledOn)}
            </FieldValue>
          </div>
        </div>

        <div className={styles.expandableRowGrid}>
          <div className={styles.expandableRowCol5}>
            <PrintButton ref={printRef} />
          </div>
          <div style={{ display: "none" }}>
            <PrintPaymentHistory ref={printRef} data={data} />
          </div>
        </div>
      </>
    );
  };
  return <DataGrid data={data} />;
}

const PrintPaymentHistory = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="container">
      <div className="row">
        <div className="col-3">
          <FieldValue label="Delivered By">
            {props.data.deliverByDate}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Paid To">
            {nickNameWithLastFour(props.data.payee)}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Paid From">
            {nickNameWithLastFour(props.data.paymentMethod)}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Delivery Method">
            <DeliveryMethod iconSize={20} method={props.data.deliveryMethod} />
          </FieldValue>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <FieldValue label="Amount">
            ${props.data.amount.toFixed(2)}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Status">
            {getPaymentStatusLabel(props.data.status)}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Confirmation Number">
            {props.data.confirmationNumber}
          </FieldValue>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <FieldValue label="Scheduled On">
            {dateUtils.formatDateStringToMDY(props.data.scheduledOn)}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Frequency">
            {getFrequencyLabel(props.data.type)}
          </FieldValue>
        </div>
        <div className="col-3">
          <FieldValue label="Delivery Method">
            <DeliveryMethodWithAddress
              address={props.data.paymentAddress}
              method={props.data.deliveryMethod}
            />
          </FieldValue>
        </div>
      </div>
    </div>
  );
});

PrintPaymentHistory.displayName = "PrintPaymentHistory";

function expanderArialLabelCallback({ isExpanded, original }) {
  const deliveryMethod = getDeliveryMethod(original.deliveryMethod);
  return `${isExpanded ? "Collapse" : "Expand"} ${
    deliveryMethod.name
  } to ${nickNameWithLastFour(original.payee)}`;
}

function rowDetailAriaLabelCallback({ original }) {
  return nickNameWithLastFour(original.payee) + " payment details";
}

export default PaymentHistoryTable;
