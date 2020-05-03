import React, { useState, useContext } from "react";
import BlueBox from "reusable/lib/BlueBox";
import Spinner from "reusable/lib/Spinner";
import DataTable from "reusable/lib/DataTable";
import FieldValue from "reusable/lib/FieldValue";
import PropTypes from "prop-types";
import styles from "./EnrolledPayeesTable.module.scss";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import ButtonGroup from "reusable/lib/ButtonGroup";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import useAlert from "../../hooks/useAlert";
import Modal from "reusable/lib/Modal";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import { UnenrolledPayeeContext } from "./UnenrolledPayeesContext";
import Tooltip from "reusable/lib/Tooltip";
import cx from "classnames";
import { useHistory } from "react-router";
import { EBILL_STATUS } from "./Ebills";
import { pageTrack } from "reusable/lib/tracking";

const EnrolledPayeesTable = ({ enrolledPayees, loading, onUnenrollClick }) => {
  const [unenrolling, setUnenrolling] = useState(false);
  const [confirmUnenrollPayeeId, setConfirmUnenrollPayeeId] = useState(null);
  const { showAlert } = useAlert();
  const history = useHistory();

  const payeeToUnenroll = enrolledPayees.find(
    (p) => p.id === confirmUnenrollPayeeId
  );

  async function handleUnenrollClick(payeeId) {
    setConfirmUnenrollPayeeId(payeeId);
  }

  async function handleUnenrollConfirm(e) {
    e.preventDefault();
    try {
      setUnenrolling(true);
      const unenrolledPayee = await onUnenrollClick(confirmUnenrollPayeeId);
      setConfirmUnenrollPayeeId(null);
      showAlert(
        <>
          <b>
            {nickNameWithLastFour(unenrolledPayee)} has been successfully
            unenrolled from eBills
          </b>
          <p>
            Please allow up to 5 business days for your change to be processed.
          </p>
        </>
      );
    } catch (err) {
      console.error(err);
      return history.push("/tech-diff");
    } finally {
      pageTrack("bankac/billpay/manageEBills/unenroll-payee-success", {
        events: "event9",
      });
      setConfirmUnenrollPayeeId(null);
      setUnenrolling(false);
    }
  }

  const EnrolledPayeesTableHeader = () => {
    const headers = [
      {
        Header: "Payee",
        accessor: "nickName",
        Cell: PayeeCell,
        className: styles.payeeCell,
      },
    ];
    if (!process.env.REACT_APP_HIDE_AUTOPAY) {
      headers.push({
        Header: "AutoPay Status",
        accessor: "",
        Cell: AutoPayCell,
        className: styles.autoPayCell,
      });
    }
    return headers;
  };

  return (
    <UnenrolledPayeeContext.Provider
      value={{
        onUnenrollClick: handleUnenrollClick,
      }}
    >
      {payeeToUnenroll && (
        <Modal
          aria-label="Unenroll Payee"
          onClose={() => setConfirmUnenrollPayeeId(null)}
        >
          <>
            <SpinnerWrapper isLoading={unenrolling}>
              <p className="overlayHeader">
                Are you sure you want to unenroll{" "}
                {nickNameWithLastFour(payeeToUnenroll)} from eBills?
              </p>

              <ButtonGroup className="mt-30">
                <Button
                  adobeEvent="MANAGE_EBILLS_UNENROLL_PAYEE_OVERLAY_UNENROLL_BTN"
                  onClick={handleUnenrollConfirm}
                >
                  Unenroll
                </Button>
                <ButtonGroup.Link>
                  <Button
                    adobeEvent="MANAGE_EBILLS_UNENROLL_PAYEE_OVERLAY_CANCEL_LNK"
                    aria-label="Close Overlay"
                    buttonStyle={BUTTON_TYPES.LINK}
                    onClick={() => setConfirmUnenrollPayeeId(null)}
                  >
                    Cancel
                  </Button>
                </ButtonGroup.Link>
              </ButtonGroup>
            </SpinnerWrapper>
          </>
        </Modal>
      )}
      <BlueBox
        id="enrolled-payees-bluebox"
        data-testid="enrolled-payees-bluebox"
        header="Enrolled Payees"
        childrenClassName={styles.blueBoxContent}
      >
        <DataTable
          columns={EnrolledPayeesTableHeader()}
          loading={loading}
          loadingText={
            <div className={styles.positionSpinner}>
              <Spinner center={false} />
            </div>
          }
          className={styles.table}
          data={enrolledPayees}
          emptyRowsText={
            <p className="mb-0">
              You don&apos;t have any payees enrolled in eBills
            </p>
          }
        />
      </BlueBox>
    </UnenrolledPayeeContext.Provider>
  );
};

function PayeeCell({ cell }) {
  const { onUnenrollClick } = useContext(UnenrolledPayeeContext);
  const isPending =
    cell.row.original.ebillStatus === EBILL_STATUS.PENDING_ACTIVATION;
  return (
    <FieldValue label="Payee" mobileOnlyLabel>
      {nickNameWithLastFour(cell.row.original)}
      {isPending ? (
        <span className={styles.pending}>
          <i>Pending</i>
          <Tooltip width="500">
            <p className="mb-0">
              Please allow up to 5 business days for this payee to be enrolled
              in eBills.{" "}
              {process.env.REACT_APP_HIDE_AUTOPAY
                ? "Once enrolled, you can unenroll the payee."
                : "Once enrolled, you can set up eBill AutoPay or unenroll the payee."}
            </p>
          </Tooltip>
        </span>
      ) : (
        <Button
          adobeEvent="MANAGE_EBILLS_ENROLLED_PAYEES_UNENROLL_LNK"
          buttonStyle={BUTTON_TYPES.LINK}
          onClick={() => onUnenrollClick(cell.row.original.id)}
          aria-label={`Delete payment`}
        >
          Unenroll
        </Button>
      )}
    </FieldValue>
  );
}

function AutoPayCell({ cell }) {
  const isPending =
    cell.row.original.ebillStatus === EBILL_STATUS.PENDING_ACTIVATION;
  const hasAutoPay = cell.row.original.hasOwnProperty("automaticPayment");
  const payeeId = cell.row.original.id;
  return (
    !isPending && (
      <FieldValue label="AutoPay Status" mobileOnlyLabel>
        {hasAutoPay ? (
          <ManageAutopay id={payeeId} />
        ) : (
          <SetupAutopay id={payeeId} />
        )}
      </FieldValue>
    )
  );
}

const ManageAutopay = ({ id }) => {
  const history = useHistory();
  return (
    <>
      <span className={cx(styles.autopayStatusDot, styles.on)}></span>
      On
      <Button
        adobeEvent="MANAGE_EBILLS_ENROLLED_PAYEES_AUTOPAY_MANAGE_LNK"
        buttonStyle={BUTTON_TYPES.LINK}
        className="mt-10"
        onClick={() => {
          history.push("/edit-payment/" + id + "?autoPayEdit");
        }}
      >
        Manage
      </Button>
    </>
  );
};

const SetupAutopay = ({ id }) => {
  const history = useHistory();
  return (
    <>
      <span className={cx(styles.autopayStatusDot)}></span>
      Off
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        className="mt-10"
        adobeEvent="MANAGE_EBILLS_ENROLLED_PAYEES_AUTOPAY_SETUP_LNK"
        onClick={() => {
          history.push("/edit-payment/" + id + "?onetime&autoPaySwitch");
        }}
      >
        Set Up
      </Button>
    </>
  );
};

ManageAutopay.propTypes = {
  id: PropTypes.string.isRequired,
};

SetupAutopay.propTypes = {
  id: PropTypes.string.isRequired,
};
AutoPayCell.propTypes = {
  cell: PropTypes.object.isRequired,
};

PayeeCell.propTypes = {
  cell: PropTypes.object.isRequired,
};

EnrolledPayeesTable.propTypes = {
  enrolledPayees: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onUnenrollClick: PropTypes.func.isRequired,
};

export default EnrolledPayeesTable;
