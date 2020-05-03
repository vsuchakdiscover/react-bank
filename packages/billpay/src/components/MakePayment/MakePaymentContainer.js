import React, { useState, useEffect, useRef } from "react";
import MakePayment from "./MakePayment";
import { enrollmentStatusApi } from "../../api/";
import Spinner from "reusable/lib/Spinner";
import ErrorBoundary from "../../ErrorBoundary";

const MakePaymentContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const { data: status } = await enrollmentStatusApi.getStatus();
        if (isMounted.current) setEnrollmentStatus(status);
      } catch {
        if (isMounted.current) setError(true);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    if (enrollmentStatus) {
      setLoading(false);
    } else {
      init();
    }
  }, [enrollmentStatus, setEnrollmentStatus]);

  async function enroll() {
    setLoading(true);
    try {
      const { data: enrollmentStatus } = await enrollmentStatusApi.postStatus();
      if (!isMounted.current) return;
      if (Object.keys(enrollmentStatus).find((i) => !enrollmentStatus[i])) {
        setError(true);
        setLoading(false);
      } else {
        setEnrollmentStatus(null); // clear the unenrolled data from payees, when the redirect happens a new payees data fetch will occur
        setRedirect(true);
      }
    } catch (error) {
      if (isMounted.current) {
        setError(true);
        setLoading(false);
      }
    }
  }

  return (
    <ErrorBoundary>
      {loading ? (
        <Spinner />
      ) : (
        <MakePayment
          enroll={enroll}
          enrollmentStatus={enrollmentStatus}
          error={error}
          redirect={redirect}
          setEnrollmentStatus={setEnrollmentStatus}
        />
      )}
    </ErrorBoundary>
  );
};

export default MakePaymentContainer;
