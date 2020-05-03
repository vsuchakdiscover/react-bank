/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import BlueBox from "reusable/lib/BlueBox";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import DataTable from "reusable/lib/DataTable";
import dateUtils from "reusable/lib/dateUtils";
import FieldValue from "reusable/lib/FieldValue";
import Modal from "reusable/lib/Modal";
import PrintButton from "reusable/lib/PrintButton";
import { getFrequencyLabel } from "../../utils/frequencies";
import { getPaymentStatusLabel } from "../../utils/paymentStatuses";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import DeliverByDateCell from "./DeliverByDateCell";
import DeliveryMethodWithAddress from "./DeliveryMethodWithAddress";
import styles from "./PaymentHistoryButtonWithModal.module.scss";

function PaymentHistoryButtonWithModal({ ariaLabel, data, header, linkLabel }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Button
        aria-label={linkLabel}
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        {linkLabel}
      </Button>

      {showModal && (
        <Modal
          aria-label={ariaLabel}
          header={header}
          onClose={() => setShowModal(false)}
        >
          <div className={styles.tableWrapper}>
            <BlueBox
              childrenClassName={styles.blueBoxContent}
              header="Payment History"
            >
              <DataTable
                className={styles.table}
                columns={[
                  {
                    Header: "Deliver By",
                    accessor: "deliverByDate",
                    Cell: DeliverByDateCell,
                    className: styles.deliverByCell,
                    headerClassName: styles.deliverByCell,
                  },
                  {
                    Header: "Payee",
                    accessor: "payee.nickName",
                    Cell: ({ cell }) => (
                      <FieldValue label="Payee" mobileOnlyLabel>
                        {nickNameWithLastFour(cell.row.original.payee)}
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
                initialSortBy={[{ id: "deliverByDate", desc: true }]}
              />
            </BlueBox>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ExpandableRow({ data }) {
  const DataGrid = ({ data }) => {
    const ref = useRef();

    return (
      <div className={styles.expandableRowContent} ref={ref}>
        <div>
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
              <FieldValue label="Frequency">
                {getFrequencyLabel(data.type)}
              </FieldValue>
            </div>

            <div className={styles.expandableRowCol2}>
              <FieldValue label="Delivery Method">
                <DeliveryMethodWithAddress
                  address={data.paymentAddress}
                  method={data.deliveryMethod}
                  displayLongName
                />
              </FieldValue>
            </div>

            <div className={styles.expandableRowCol3}>
              <FieldValue label="Ends">
                {dateUtils.formatDateStringToMDY(data.scheduledOn)}
              </FieldValue>
            </div>
          </div>
        </div>

        <PrintButton className={styles.printButton} ref={ref}></PrintButton>
      </div>
    );
  };
  return <DataGrid data={data} />;
}

PaymentHistoryButtonWithModal.defaultValues = {
  data: [],
};

PaymentHistoryButtonWithModal.propTypes = {
  ariaLabel: PropTypes.string,
  data: PropTypes.array.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.string,
  ]),
  linkLabel: PropTypes.string.isRequired,
};

export default PaymentHistoryButtonWithModal;
