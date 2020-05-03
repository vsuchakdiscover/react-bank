import React from "react";
import { Redirect } from "react-router-dom";
import Spinner from "reusable/lib/Spinner";
import { useApi } from "reusable/lib/useApi";
import { enrollmentStatusApi } from "../../../api";

function EnrollmentStatus({ children }) {
  const { error, loading, data: status } = useApi(
    enrollmentStatusApi.getStatus
  );
  if (error) {
    console.error(error);
    return <Redirect to="/tech-diff" push />;
  }
  if (loading) return <Spinner />;

  if (
    status &&
    (!status.eligible ||
      !status.fundsAvailable ||
      !status.enrolledInFIS ||
      !status.enrolledInDFS)
  ) {
    return <Redirect to="/" push />;
  }

  return children;
}

EnrollmentStatus.propTypes = {};

export default EnrollmentStatus;
