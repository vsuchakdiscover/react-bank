/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";
import { payeesApi } from "../../api";
import { DeletedPayeeContext } from "./PayeesContext";
import useAlert from "../../hooks/useAlert";
import DeliveryMethod from "../reusable/DeliveryMethod";
import BlueBox from "reusable/lib/BlueBox";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import PrintButton from "reusable/lib/PrintButton";
import DataTable from "reusable/lib/DataTable";
import dateUtils from "reusable/lib/dateUtils";
import FieldValue from "reusable/lib/FieldValue";
import DeliveryMethodIcon from "../reusable/DeliveryMethodIcon";
import AccountNumberMask from "reusable/lib/AccountNumberMask";
import PencilIcon from "reusable/lib/PencilIcon";
import DeleteIcon from "reusable/lib/DeleteIcon";
import EBillIcon from "reusable/lib/EBillIcon";
import LastFourMask from "reusable/lib/LastFourMask";
import LinksList from "reusable/lib/LinksList";
import Modal from "reusable/lib/Modal";
import ButtonGroup from "reusable/lib/ButtonGroup";
import Spinner from "reusable/lib/Spinner";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import useIsMobile from "reusable/lib/useIsMobile";
import { formatZip } from "reusable/lib/formattingUtils";
import { getDeliveryMethod } from "../../utils/deliveryMethod";
import styles from "./PayeesTable.module.scss";
import ErrorOverlay from "../../components/reusable/ErrorOverlay";
import { EBILL_STATUS } from "../Ebills/Ebills";
import { useHistory } from "react-router";
import { formatCurrency, lastFour } from "reusable/lib/formattingUtils";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

function PayeesTable({ loading, payees }) {
  const isMobile = useIsMobile();
  const printRef = useRef();

  return (
    <>
      <div className={styles.printRow}>
        <PrintButton ref={printRef} className={styles.printBtn} />
      </div>
      <BlueBox header="Payees" childrenClassName={styles.payeesBlueBoxContent}>
        <div className={cx(styles.payeesCopy)}>
          <DataTable
            columns={[
              {
                Header: "Pay To",
                accessor: "nickName",
                Cell: NameCell,
                headerClassName: cx(styles.column, styles.payToColumn),
                className: styles.payToColumn,
              },
              {
                accessor: "operations",
                Cell: OperationsCell,
                headerClassName: styles.column,
                className: styles.operationsColumn,
                show: !isMobile,
              },
            ]}
            data={payees}
            expandableRow={ExpandableRow}
            emptyRowsText={
              <p className={styles.nopayees}>
                You don&apos;t have any Payees set up to make online bill
                payments
              </p>
            }
            loading={loading}
            showHeaderWhenEmptyRows={false}
            adobeEventOnExpandRow="MANAGE_PAYEE_PAYEES_PAY_TO_EXPAND_LNK"
            adobeEventOnCollapseRow="MANAGE_PAYEE_PAYEES_PAY_TO_COLLAPSE_LNK"
          ></DataTable>
        </div>
      </BlueBox>

      <div style={{ display: "none" }}>
        <PrintTable ref={printRef} payees={payees} />
      </div>
    </>
  );
}

const PrintTable = React.forwardRef((props, ref) => {
  return (
    <BlueBox
      ref={ref}
      header="Payees"
      childrenClassName={styles.payeesBlueBoxContent}
    >
      <div className={cx("container", styles.printTableContainer)}>
        {props.payees.map((payee) => (
          <div key={payee.id} className={styles.borderBtm}>
            <div className="row">
              <div className="col-4">
                <FieldValue label="Pay To">
                  {payee.nickName}{" "}
                  {payee.accountNumber && (
                    <LastFourMask value={payee.accountNumber} />
                  )}
                </FieldValue>
              </div>
              <div className="col-4">
                <FieldValue label="Delivery method">
                  <DeliveryMethodIcon
                    deliveryMethodKey={payee.deliveryMethod}
                  />{" "}
                  {getDeliveryMethod(payee.deliveryMethod).name}
                </FieldValue>
              </div>
            </div>
            <ExpandableRow data={payee} isPrint />
          </div>
        ))}
      </div>
    </BlueBox>
  );
});

PrintTable.displayName = "PrintTable";

const DeleteModalContent = ({ data, setShowModal, deletePayeeFromState }) => {
  useTrackPageLoad("bankac/billpay/managepayees/deleteoverlay");
  const history = useHistory();
  const { showAlert } = useAlert();
  const nickName = data.nickName;
  const id = data.id;

  const DeleteModalMsg = () => {
    const [loading, setLoading] = useState(false);
    const [getScheduled, setGetScheduled] = useState(true);
    const [scheduledList, setScheduledList] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
      async function getScheduledPayments() {
        try {
          const { data } = await payeesApi.getScheduledPayments(id);
          setScheduledList(data.slice(0, 2));
          setGetScheduled(false);
        } catch (err) {
          setGetScheduled(false);
          setError(true);
        }
      }
      getScheduledPayments();
    }, []);

    const AlertInner = () => (
      <div>
        <b>
          {nickName}{" "}
          {data.accountNumber && <LastFourMask value={data.accountNumber} />}{" "}
          has been deleted{" "}
        </b>
        {scheduledList.length > 0 && (
          <p>Any future payments have been cancelled.</p>
        )}
      </div>
    );

    async function deletePayee() {
      try {
        setLoading(true);
        const { data } = await payeesApi.deletePayee(id);
        if (data.status === "DELETED") {
          setLoading(false);
          setShowModal(false);
          deletePayeeFromState(id);
          showAlert(<AlertInner />);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }

    return getScheduled ? (
      <div className={cx(styles.positionSpinner, styles.spinnerMinHeight)}>
        <Spinner center={false} />
      </div>
    ) : error ? (
      <ErrorOverlay
        onClose={() => {
          setShowModal(false);
        }}
      />
    ) : (
      <SpinnerWrapper
        isLoading={loading}
        loadingText={`Deleting ${data.nickName} ${
          data.accountNumber ? `(${lastFour(data.accountNumber)})` : ""
        }
         as a payee...`}
      >
        <p className={cx("overlayHeader", "mb-20")}>
          Are you sure you want to delete {data.nickName}{" "}
          {data.accountNumber ? `(${lastFour(data.accountNumber)})` : ""} as a
          payee ?
        </p>
        {scheduledList.length > 0 && (
          <div className="mb-25">
            <p>
              You have upcoming scheduled payments that will be cancelled if you
              delete this payee, including:
            </p>
            {
              <div className={styles.scheduledPaymentsTableContainer}>
                <DataTable
                  columns={[
                    {
                      Header: "Deliver By",
                      accessor: "deliverByDate",
                      Cell: ({ cell }) =>
                        dateUtils.formatDateStringToMDY(cell.value),
                    },
                    {
                      Header: "Pay From",
                      accessor: "paymentMethod",
                      Cell: ({ cell }) =>
                        `${cell.value.accountName} (${lastFour(
                          cell.value.accountNumber
                        )})`,
                    },
                    {
                      Header: "Amount",
                      accessor: "amount",
                      Cell: ({ cell }) => formatCurrency(cell.value),
                    },
                  ]}
                  data={scheduledList}
                  className={styles.scheduledPaymentsTable}
                ></DataTable>
              </div>
            }
          </div>
        )}

        <ButtonGroup className={styles.positionButtons}>
          <Button
            adobeEvent="MANAGE_PAYEE_DELETE_OVERLAY_YES_DELETE_BTN"
            onClick={deletePayee}
          >
            Delete <span className="sr-only">{data.nickName}</span>
          </Button>
          {scheduledList.length > 0 && (
            <ButtonGroup.Link>
              <Button
                adobeEvent="MANAGE_PAYEE_DELETE_OVERLAY_REVIEW_PAYMENTS_BTN"
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={() => {
                  history.push({
                    pathname: "/review-payments",
                  });
                }}
              >
                Review Payments
              </Button>
            </ButtonGroup.Link>
          )}
          <ButtonGroup.Link>
            <Button
              adobeEvent="MANAGE_PAYEE_DELETE_OVERLAY_DONT_DELETE_BTN"
              buttonStyle={BUTTON_TYPES.LINK}
              onClick={() => {
                setShowModal(false);
              }}
              aria-label="Cancel Delete Payee"
            >
              Cancel
            </Button>
          </ButtonGroup.Link>
        </ButtonGroup>
      </SpinnerWrapper>
    );
  };

  return (
    <div className={cx(styles.deleteOverlay, "meta-web-normal")}>
      {(data.ebillStatus && data.ebillStatus === EBILL_STATUS.ACTIVE) ||
      data.ebillStatus === EBILL_STATUS.PENDING_ACTIVATION ? (
        <>
          <p className="overlayHeader">Unenroll from eBills to delete</p>
          <p className="mb-30">
            You can&rsquo;t delete a Payee that&rsquo;s currently enrolled in
            eBills. Visit Manage eBills to unenroll this payee and try again.
          </p>
          <ButtonGroup className={styles.positionButtons}>
            <Link to="/manage-ebills">
              <Button>Manage eBills</Button>
            </Link>
            <ButtonGroup.Link>
              <Button
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={() => {
                  setShowModal(false);
                }}
                aria-label="Go Back"
              >
                Go Back
              </Button>
            </ButtonGroup.Link>
          </ButtonGroup>
        </>
      ) : (
        <DeleteModalMsg />
      )}
    </div>
  );
};

function ExpandableRow({ data, isPrint = false }) {
  const history = useHistory();
  return (
    <div className={cx("row", styles.expandable)}>
      <div className={isPrint ? "col-4" : "col-md-4"}>
        <FieldValue label="Name">{data.name}</FieldValue>
      </div>
      <div className={isPrint ? "col-4" : "col-md-4"}>
        <FieldValue label="Nickname">
          {data.nickName}{" "}
          {data.accountNumber && <LastFourMask value={data.accountNumber} />}{" "}
        </FieldValue>
      </div>
      {data.accountNumber && data.accountNumber.length && (
        <div className={isPrint ? "col-4" : "col-md-4"}>
          <FieldValue label="Account Number">
            <AccountNumberMask value={data.accountNumber} />
          </FieldValue>
        </div>
      )}

      {!data.verified && data.phoneNumber && (
        <div className={isPrint ? "col-4" : "col-md-4"}>
          <FieldValue label="Phone Number">
            {data.phoneNumber.formatted}
          </FieldValue>
        </div>
      )}

      {!data.verified && data.address && (
        <div className={isPrint ? "col-4" : "col-md-4"}>
          <FieldValue label="Address">
            {data.address.streetAddress}
            <br />
            {data.address.extendedAddress && (
              <>
                {data.address.extendedAddress}
                <br />
              </>
            )}
            {data.address.locality}, {data.address.region}{" "}
            {formatZip(data.address.postalCode)}
          </FieldValue>
        </div>
      )}

      <div className={isPrint ? "col-4" : "col-md-4"}>
        <FieldValue label="Delivery Method">
          <DeliveryMethod
            showAllowByText={true}
            allowByTextClass={styles.break}
            iconSize={20}
            iconClass={styles.icon}
            method={data.deliveryMethod}
            displayLongName
          />
        </FieldValue>
      </div>

      {data.ebillStatus && data.ebillStatus !== EBILL_STATUS.NOT_AVAILABLE && (
        <div className={isPrint ? "col-4" : "col-md-4"}>
          <FieldValue label="eBills">
            <>
              <EBillIcon className={styles.icon} />
              {data.ebillStatus === EBILL_STATUS.AVAILABLE && (
                <>
                  Eligible for eBills
                  <Button
                    className={styles.ebillsEnroll}
                    buttonStyle={BUTTON_TYPES.LINK}
                    onClick={() => {
                      history.push({
                        pathname: "/manage-ebills/enroll",
                        state: { payeeId: data.id },
                      });
                    }}
                  >
                    Enroll Now
                  </Button>
                </>
              )}
              {data.ebillStatus === EBILL_STATUS.ACTIVE && "Enrolled in eBills"}
              {data.ebillStatus === EBILL_STATUS.PENDING_ACTIVATION && (
                <i>Enrollment Pending</i>
              )}
            </>
          </FieldValue>
        </div>
      )}
      {!isPrint && (
        <div className={cx("col-md-4", styles.mobileOperations)}>
          <OperationsButtonBar data={data}></OperationsButtonBar>
        </div>
      )}
    </div>
  );
}

function NameCell({ cell }) {
  let mask = "";
  let alphaNumeric = "";
  if (
    cell.row.original.accountNumber &&
    cell.row.original.accountNumber !== ""
  ) {
    const value = cell.row.original.accountNumber.slice(-4);
    const valueArray = Array.from(value);

    if (valueArray.includes("*")) {
      valueArray.forEach((d) => {
        if (d === "*") {
          mask = mask + "●";
        } else {
          alphaNumeric = alphaNumeric + d;
        }
      });
    } else {
      alphaNumeric = value.slice(-4);
    }
  }

  return (
    <>
      {cell.value}{" "}
      {alphaNumeric !== "" && (
        <>
          (<span className={styles.maskedValue}>{mask}</span>
          {alphaNumeric})
        </>
      )}
    </>
  );
}

function OperationsCell({ cell }) {
  return <OperationsButtonBar data={cell.row.original}></OperationsButtonBar>;
}

function OperationsButtonBar({ data }) {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const handleDeleteClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <LinksList>
        {data.ebillStatus === EBILL_STATUS.AVAILABLE && (
          <Button
            adobeEvent="MANAGE_PAYEE_PAYEES_ENROLL_IN_EBILLS_LNK"
            buttonStyle={BUTTON_TYPES.LINK}
            onClick={() => {
              history.push({
                pathname: "/manage-ebills/enroll",
                state: { payeeId: data.id },
              });
            }}
          >
            Enroll in eBills
          </Button>
        )}
        <Button
          adobeEvent="MANAGE_PAYEE_PAYEES_EDIT_LNK"
          buttonStyle={BUTTON_TYPES.LINK}
          aria-label={`Edit ${data.nickName}`}
          onClick={() => {
            history.push({
              pathname: "/add-payee",
              state: {
                ...transformPayeeData(data),
                edit: true,
              },
            });
          }}
        >
          <PencilIcon />
        </Button>
        <Button
          adobeEvent="MANAGE_PAYEE_PAYEES_DELETE_LNK"
          className={styles.deleteBtn}
          buttonStyle={BUTTON_TYPES.LINK}
          onClick={handleDeleteClick}
          aria-label={`Delete ${data.nickName}`}
        >
          <DeleteIcon />
        </Button>
      </LinksList>
      {showModal && (
        <Modal
          adobeEventOnClose="MANAGE_PAYEE_DELETE_OVERLAY_CLOSE_LNK"
          aria-label={`Are you sure you want to delete ${data.nickName}`}
          data={data}
          onClose={() => setShowModal(false)}
        >
          <DeletedPayeeContext.Consumer>
            {({ deletePayeeFromState }) => {
              return (
                <DeleteModalContent
                  deletePayeeFromState={deletePayeeFromState}
                  setShowModal={setShowModal}
                  data={data}
                />
              );
            }}
          </DeletedPayeeContext.Consumer>
        </Modal>
      )}
    </>
  );
}

function transformPayeeData(dataObj) {
  const data = { ...dataObj, ...(dataObj.address || {}) };

  if (data.address) {
    delete data.address;
    delete data.formatted;
  }

  if (data.phoneNumber && data.phoneNumber.number) {
    data.phoneNumber = data.phoneNumber.number;
  }

  if (data.postalCode) {
    data.zip = data.postalCode;
    delete data.postalCode;
  }

  return data;
}

export default PayeesTable;
