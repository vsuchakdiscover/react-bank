import React, { useReducer, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  accountsApi,
  customerProfileApi,
  discoverCardsApi,
  enrollmentStatusApi,
  paymentsApi,
} from "../../api/";
import SteppedForm from "reusable/lib/SteppedForm";
import ErrorSummary from "reusable/lib/ErrorSummary";
import Alert from "reusable/lib/Alert";
import Spinner from "reusable/lib/Spinner";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import styles from "./SchedulePayment.module.scss";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import {
  capitalizeFirstLetterOnly,
  nickNameWithLastFour,
  stripPeriod,
} from "reusable/lib/formattingUtils";
import {
  schedulePaymentReducer,
  getSelectedPayments,
  STATUS,
} from "./schedulePaymentReducer";
import HeroHeader from "../reusable/HeroHeader";
import { useLocation, useRouteMatch, useHistory } from "react-router-dom";
import { FREQUENCY_TYPE } from "../../utils/frequencyType";

const initialState = {
  status: STATUS.LOADING,
  customerProfile: null,
  accounts: [],
  errors: {},
  payments: [],
  scheduledPayments: [],
  formSubmitCount: 0,
  discoverCreditCards: [],
  preferredAccountId: null,
  formResetCount: 0,
};

function SchedulePayment(props) {
  const [state, dispatch] = useReducer(schedulePaymentReducer, initialState);
  const isMounted = useRef(true);
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const selectedPayeeId = location.search.includes("?open=")
    ? location.search.replace("?open=", "")
    : null; //auto select and open the payee if passed in the querystring

  // Reinitialize the form instead of running plain init if reinit is passed in React Router state.
  // This is set in 2 spots:
  // 1. SubNav when the user clicks on the link to this page while already on this page.
  // 2. When the user clicks on the "Make a Payment" link under "What would you like to do next?" on Step 3 of this page.
  // As a safety check, also assure there are accounts - there should be but if there aren't, run full init instead.
  const reInitialize = location.state?.reinit && state.accounts.length > 0;

  const editPaymentId = match.params.id; //id of payment to edit and flag for specific edit state treatment/display
  const forcedOneTime = location.search.includes("?onetime"); //treat the payment as a one time payment no matter existing payment type
  const autoPaySwitch = location.search.includes("autoPaySwitch"); //convert a repeating payment to autopay
  const autoPayEdit = location.search.includes("autoPayEdit"); //treat payment as autopay - edit as a series, not a one-time

  // Reinitializes SchedulePayment to show Step 1. Useful after a successful submission in 2 scenarios:
  // 1. User clicks "Make a Payment" under "What would you like to do next?" on Step 3.
  // 2. User clicks on "Make a Payment" in top-level navigation on Step 3.
  useEffect(() => {
    async function reInit() {
      const [enrollmentResp, scheduledPaymentsResp] = await Promise.all([
        enrollmentStatusApi.getStatus(),
        paymentsApi.getPaymentList({ statuses: "SCHEDULED" }),
      ]);

      dispatch([
        "reInit",
        {
          payees: enrollmentResp.data.payees,
          scheduledPayments: scheduledPaymentsResp.data,
          accounts: state.accounts,
          selectedPayeeId,
        },
      ]);
      // clear so reInit doesn't fire again. Clearing state also assures this doesn't fire if user does full refresh.
      history.replace({ pathname: "/", state: { reinit: false } });
    }
    if (reInitialize) reInit();
  }, [history, reInitialize, selectedPayeeId, state.accounts]);

  useEffect(() => {
    function getInitAction() {
      if (autoPaySwitch || autoPayEdit) return "autoPaySwitch";
      return editPaymentId ? "edit" : "init";
    }
    async function init() {
      try {
        const [
          customerProfileResp,
          accountsResp,
          scheduledPaymentsResp,
          discoverCardsResp,
          payeesResp,
        ] = await Promise.all([
          customerProfileApi.getCustomerProfile(),
          accountsApi.getAccounts(),
          paymentsApi.getPaymentList({ statuses: "SCHEDULED" }),
          discoverCardsApi.getDiscoverCards(),
          enrollmentStatusApi.getStatus(),
        ]);

        const payees = payeesResp.data.payees;

        if (isMounted.current) {
          if (
            //if in edit mode and the payment id isn't found
            editPaymentId &&
            !scheduledPaymentsResp.data.find(
              (s) => s.paymentId === editPaymentId
            ) &&
            !autoPaySwitch &&
            !autoPayEdit
          ) {
            // payment id isn't found so look for the payee id secondarily
            if (!payees.find((p) => p.id === editPaymentId)) {
              return history.push("/page-not-found");
            }
          }

          dispatch([
            getInitAction(),
            {
              customerProfile: customerProfileResp.data,
              accounts: accountsResp.data,
              scheduledPayments: scheduledPaymentsResp.data,
              discoverCreditCards: editPaymentId ? [] : discoverCardsResp.data,
              payees,
              editPaymentId,
              forcedOneTime,
              selectedPayeeId,
              status: STATUS.STEP1,
            },
          ]);
        }
      } catch (e) {
        if (isMounted.current) {
          console.error(e);
          history.push("/tech-diff");
        }
      }
    }

    // Only run init when reInitialize isn't true
    if (!reInitialize) init();
    return () => {
      isMounted.current = false;
      // This console exposes the root problem: Something is causing
      // this component to unmount twice during the delete process.
      // For now, the isMounted checks resolve the issue, but we need to
      // determine what's unmounting the component.
      process.env.NODE_ENV === "development" &&
        console.log("Unmounting SchedulePayment");
    };
  }, [
    autoPayEdit,
    autoPaySwitch,
    editPaymentId,
    forcedOneTime,
    history,
    location.search,
    props.payees,
    reInitialize,
    selectedPayeeId,
  ]);

  // Scroll to the top when the page status changes
  useEffect(() => {
    window.scroll(0, 0);
  }, [state.status]);

  const selectedPayments = getSelectedPayments(state.payments);

  const {
    status,
    accounts,
    errors,
    customerProfile,
    formSubmitCount,
    scheduledPayments,
    payments,
    formResetCount,
    discoverCreditCards,
    payees,
  } = state;

  // Submit errors must include a reference to the account name and number on the end.
  // Necessary since the error summary at the top needs to mention the account in the error message
  // but the errors displayed inline on the form do not since it's clear visually which field is in error.
  function getSubmitErrors(errors) {
    const submitErrors = {};
    Object.keys(errors).forEach((e) => {
      submitErrors[e] = stripPeriod(errors[e].message);
      if (errors[e].payee) {
        submitErrors[e] += " for " + nickNameWithLastFour(errors[e].payee);
      }
      if (e.includes("-frequency")) {
        // need to update the key for frequency to correspond with the combobox button id
        submitErrors[e + "-toggle-button"] =
          errors[e].message + " for " + nickNameWithLastFour(errors[e].payee);
        delete submitErrors[e];
      }
    });

    return submitErrors;
  }

  function getActiveStep(status) {
    if (status === STATUS.STEP1) return 1;
    if (status === STATUS.STEP2 || status === STATUS.SUBMITTING) return 2;
    if (status === STATUS.STEP3) return 3;
    return 1; // if no active step at the moment, return 1 as a default
  }

  if (status === STATUS.LOADING)
    return (
      <>
        <HeroHeader>{`Let\u2019s pay some bills`}</HeroHeader>
        <Spinner />
      </>
    );

  const serverErrors = selectedPayments.filter((s) => !s.success);
  const serverErrorPayees = serverErrors
    .map((s) => nickNameWithLastFour(s.payee))
    .join(", ")
    .replace(/,(?=[^,]*$)/, " and"); //remove the last comma & replace with "and" in the string

  const getHeadlineText = () => {
    if (payments[0].frequency !== FREQUENCY_TYPE.ONE_TIME) {
      if (autoPayEdit) return "eBill AutoPay Payment";
      return "Payments";
    } else {
      return "Payment";
    }
  };

  const activeStep = getActiveStep(status);

  return (
    <>
      <HeroHeader>
        {editPaymentId
          ? `Edit your bill payment, `
          : `Let\u2019s pay some bills, `}
        {capitalizeFirstLetterOnly(customerProfile.firstName)}
      </HeroHeader>
      <div className={styles.blueHeaderBg}></div>
      <SpinnerWrapper isLoading={status === STATUS.SUBMITTING}>
        <ErrorSummary
          errors={getSubmitErrors(errors)}
          formSubmitCount={formSubmitCount}
        />
        {serverErrors.length > 0 && status === STATUS.STEP3 && (
          <Alert type="error" closable={false} className="mb-20" verticalCenter>
            <p className="mb-0">
              <b>
                There was an error processing your payment
                {serverErrors.length > 1 ? "s" : " "} to {serverErrorPayees}.
              </b>
            </p>
          </Alert>
        )}
        <SteppedForm activeStep={activeStep}>
          <SteppedForm.Step
            header={
              <h3>
                {editPaymentId
                  ? `Edit ${getHeadlineText()} for ${nickNameWithLastFour(
                      payments[0].payee
                    )}`
                  : "Schedule Payments"}
              </h3>
            }
          >
            {activeStep === 1 && (
              <Step1
                selectedPayments={selectedPayments}
                accounts={accounts}
                discoverCreditCards={discoverCreditCards}
                formResetCount={formResetCount}
                dispatch={dispatch}
                payees={payees}
                payments={payments}
                scheduledPayments={scheduledPayments}
                errors={errors}
                editPaymentId={editPaymentId}
                forcedOneTime={forcedOneTime}
                autoPaySwitch={autoPaySwitch}
              />
            )}
          </SteppedForm.Step>

          <SteppedForm.Step header={<h3>Verify Payment Details</h3>}>
            {(activeStep === 2) & (status !== STATUS.SUBMITTING) && (
              <Step2
                dispatch={dispatch}
                accounts={accounts}
                selectedPayments={selectedPayments}
                editPaymentId={editPaymentId}
                forcedOneTime={forcedOneTime}
              />
            )}
          </SteppedForm.Step>

          <SteppedForm.Step
            header={
              <h3>{editPaymentId ? "Payment Updated" : "Payment Scheduled"}</h3>
            }
          >
            {activeStep === 3 && (
              <Step3
                dispatch={dispatch}
                accounts={accounts}
                selectedPayments={selectedPayments}
                editPaymentId={editPaymentId}
                forcedOneTime={forcedOneTime}
              />
            )}
          </SteppedForm.Step>
        </SteppedForm>
      </SpinnerWrapper>
    </>
  );
}

SchedulePayment.propTypes = {
  payees: PropTypes.array.isRequired,
  editPaymentId: PropTypes.string,
};

export default SchedulePayment;
