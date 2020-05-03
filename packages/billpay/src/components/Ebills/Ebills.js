import React, { useEffect, useState } from "react";
import EnrolledPayeesTable from "./EnrolledPayeesTable";
import ActivityTable from "./ActivityTable";
import EnrollBox from "./EnrollBox";
import PropTypes from "prop-types";
import { enrollmentStatusApi, ebillsApi } from "../../api/";
import { useApi } from "reusable/lib/useApi";
import { parseErrors } from "../../api/apiUtils";
import useAlert from "../../hooks/useAlert";
import { ALERT_TYPES } from "reusable/lib/Alert";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import EnrollmentStatus from "../reusable/EnrollmentStatus";
import ErrorBoundary from "../../ErrorBoundary";
import { useHistory } from "react-router-dom";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

export const EBILL_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING_ACTIVATION: "PENDING_ACTIVATION",
  AVAILABLE: "AVAILABLE",
  NOT_AVAILABLE: "NOT_AVAILABLE",
};

const Ebills = ({ payees, setPayees }) => {
  const history = useHistory();

  useTrackPageLoad("bankac/billpay/manageEBills");
  const [activityTableData, setActivityTableData] = useState([]);
  const { error: payeesError, loading: payeesLoading, data: status } = useApi(
    enrollmentStatusApi.getStatus
  );
  const {
    error: ebillDetailsError,
    loading: ebillDetailsLoading,
    data: ebillDetails,
  } = useApi(ebillsApi.getEBillDetails);
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!payeesLoading) {
      setPayees(status.payees);
    }
    if (!ebillDetailsLoading) {
      setActivityTableData(ebillDetails);
    }
  }, [
    payeesLoading,
    setPayees,
    status,
    setActivityTableData,
    ebillDetailsLoading,
    ebillDetails,
  ]);
  const eligiblePayees = payees.filter(
    (p) => p.ebillStatus === EBILL_STATUS.AVAILABLE
  );
  const enrolledPayees = payees.filter(
    (p) =>
      p.ebillStatus === EBILL_STATUS.ACTIVE ||
      p.ebillStatus === EBILL_STATUS.PENDING_ACTIVATION
  );

  async function unenrollPayee(payeeId) {
    const unenrolledPayee = payees.find((p) => p.id === payeeId);
    window.scroll(0, 0);
    try {
      await ebillsApi.eBillUnenroll(payeeId);
      // We need to remove the ebill activity for the unenrolled payee
      const updatedActivityTableData = activityTableData.filter(
        (payee) => payee.id !== payeeId
      );
      setActivityTableData(updatedActivityTableData);
      // Update the ebill status to AVAILABLE for unenrolled payee
      const updatedPayees = payees.map((p) => {
        return p.id === payeeId
          ? { ...p, ebillStatus: EBILL_STATUS.AVAILABLE }
          : p;
      });
      setPayees(updatedPayees);
      return unenrolledPayee; // Used by caller to display alert with payee data
    } catch (err) {
      const errors = parseErrors(err);
      if (
        errors.length === 0 ||
        errors.find((e) => e.code === "General.TechnicalDifficulties")
      ) {
        console.error("Error: General.TechnicalDifficulties");
        return history.push("/tech-diff"); //check on real interaction here tech diff for now
      }
      if (errors.find((e) => e.code === "Ebill.UnEnroll.NotEligible")) {
        showAlert(
          <div>
            <b>
              We can&apos;t unenroll {nickNameWithLastFour(unenrolledPayee)}{" "}
              from eBills at this time
            </b>
            <p>
              This could be because you&apos;ve recently changed this
              payee&apos;s eBill status. Please allow up to 5 business days for
              your change to be processed, then try again.
            </p>
          </div>,
          ALERT_TYPES.WARNING
        );
      }
      console.error(err);
      return history.push("/tech-diff");
    }
  }

  if (payeesError) throw new Error("Payees Error in Ebills:" + payeesError);
  if (ebillDetailsError)
    throw new Error("eBillDetails error in Ebills: " + ebillDetailsError);

  return (
    <ErrorBoundary>
      <EnrollmentStatus>
        <EnrollBox eligiblePayees={eligiblePayees} />
        <EnrolledPayeesTable
          loading={payeesLoading}
          onUnenrollClick={unenrollPayee}
          enrolledPayees={enrolledPayees}
        />
        <ActivityTable
          data={activityTableData}
          setData={setActivityTableData}
          loading={ebillDetailsLoading}
        />
      </EnrollmentStatus>
    </ErrorBoundary>
  );
};

Ebills.propTypes = {
  payees: PropTypes.array.isRequired,
  setPayees: PropTypes.func.isRequired,
};

export default Ebills;
