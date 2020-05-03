import React, { useContext, useEffect, useState } from "react";
import AccountVerificationForm from "./AccountVerificationForm";
import { ebillsApi } from "../../../api";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import { useApi, useLazyApi } from "reusable/lib/useApi";
import useAlert from "../../../hooks/useAlert";
import { ALERT_TYPES } from "reusable/lib/Alert";
import PropTypes from "prop-types";
import Spinner from "reusable/lib/Spinner";
import Headline from "reusable/lib/Headline";
import { Link, useHistory, useLocation } from "react-router-dom";
import SubheadingContext from "../../SubheadingContext";
import { EBILL_STATUS } from "../Ebills";
import ErrorBoundary from "../../../ErrorBoundary";
import queryString from "query-string";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

function EbillsEnroll({ payees, setPayees }) {
  const history = useHistory();
  const location = useLocation();
  const { showAlert } = useAlert();
  const { setSubheading } = useContext(SubheadingContext);

  const { payeeId } = queryString.parse(location.search);
  if (!payeeId) history.push("/page-not-found");

  // Get tokens from the API. We use them to build the form.
  const {
    error,
    loading: loadingTokens,
    data: tokensApiResponse = {},
  } = useApi(ebillsApi.getEBillTokens, {
    payeeId,
  });

  const sessionKey = tokensApiResponse.sessionKey;

  // We store tokenList locally, because we can get an updated list from the API.
  const [tokenList, setTokenList] = useState([]);

  useTrackPageLoad("bankac/billpay/manageEBills/enroll-payee", {
    prop5: "Bill Pay:Ebills:Enroll Payee",
    eVar5: "Bill Pay:Ebills:Enroll Payee",
    events: "event22",
  });

  // Updates local copy of tokenList.
  useEffect(() => {
    setTokenList(tokensApiResponse.ebillsTokenList);
  }, [tokensApiResponse.ebillsTokenList]);

  // Updates blue HeroHeader subheading with payee nickName.
  useEffect(() => {
    tokensApiResponse.nickName &&
      setSubheading(`eBill Enrollment for ${tokensApiResponse.nickName}`);
  }, [tokensApiResponse.nickName, setSubheading]);

  // Submit form via API.
  const {
    callApi: callEnrollmentApi,
    loading: submitting,
    error: submissionError,
  } = useLazyApi(ebillsApi.eBillEnrollment);

  function handleFormSubmit(fieldValues) {
    const payload = {
      id: payeeId,
      ebillsTokenList: addFormValuesToTokenList(fieldValues, tokenList),
    };

    if (sessionKey) {
      payload.sessionKey = tokensApiResponse.sessionKey;
    }

    callEnrollmentApi(payload).then(handleSuccessfulApiCall);
  }

  async function handleSuccessfulApiCall({ data }) {
    const { ebillsTokenList, id, ebillStatus } = data;
    if (ebillsTokenList) {
      setTokenList(ebillsTokenList);
    } else {
      setPayees(payees.map((p) => (p.id === id ? { ...p, ebillStatus } : p)));
      // Sometimes the server will not update eBillStatus correctly - Throw warning alert if status is still AVAILABLE
      if (ebillStatus === EBILL_STATUS.AVAILABLE) {
        showAlert(
          <>
            <p className="mb-0">
              <b>Your statements weren&apos;t enrolled</b>
            </p>
            <p>
              We couldn&apos;t verify your account with the information
              provided.
            </p>
          </>,
          ALERT_TYPES.WARNING
        );
      } else {
        // Otherwise show success alert
        showAlert(
          <>
            <b>{nickNameWithLastFour(data)} has been enrolled in eBills </b>
            <p>
              When eBills arrive, you’ll be notified here in the Activity
              section and receive an email notification about your new
              statements.
            </p>
          </>
        );
      }
      // Per requirements, redirect even if the eBillStatus doesn't get updated properly. The user is alerted of any issue via the `showAlert` above.
      history.push({
        pathname: "/manage-ebills",
        state: {
          preserveAlerts: true,
        },
      });
    }
  }

  if (error || submissionError) {
    return (
      <div>
        <Headline className="mb-20">
          We could not validate your information.
        </Headline>
        <p>Please try again.</p>
        <Link to="/manage-ebills">Go to Manage eBills</Link>
      </div>
    );
  }

  if (loadingTokens) {
    return <Spinner />;
  }

  return (
    <ErrorBoundary>
      <p className="mw-630">
        To enroll these payee statements into eBills, we need to verify your
        account using the following information associated with your{" "}
        {tokensApiResponse.nickName} account:
      </p>
      <AccountVerificationForm
        onSubmit={handleFormSubmit}
        tokenList={tokenList || []}
        tokenListName={tokensApiResponse.name}
        submitting={submitting}
      />
    </ErrorBoundary>
  );
}

EbillsEnroll.propTypes = {
  payees: PropTypes.array,
  setPayees: PropTypes.func,
};

function addFormValuesToTokenList(values, tokenList) {
  const getTokenValue = (t) =>
    t.formatType === "HELP TEXT" ||
    t.formatType === "SITE KEY INSTRUCTIONAL TEXT Format Type"
      ? "true" //"true" as string is intentional per client instruction, service requires this
      : values[t.tokenID];
  return tokenList.map((t) => ({
    ...t,
    value: getTokenValue(t),
  }));
}

export default EbillsEnroll;
