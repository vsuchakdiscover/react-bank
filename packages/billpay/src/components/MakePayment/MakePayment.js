import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Redirect, useHistory } from "react-router-dom";
import Spinner from "reusable/lib/Spinner";
import Button from "reusable/lib/Button";
import TouchPhoneNumber from "reusable/lib/TouchPhoneNumber";
import CalendarCheckIcon from "reusable/lib/CalendarCheckIcon";
import EBillThinIcon from "reusable/lib/EBillThinIcon";
import MobilePhoneIcon from "reusable/lib/MobilePhoneIcon";
import styles from "./MakePayment.module.scss";
import cx from "classnames";
import SchedulePayment from "./SchedulePayment";
import HeroHeader from "../reusable/HeroHeader";
import URLS from "reusable/lib/urls";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import SmartLink from "reusable/lib/SmartLink";
import { clickTrack } from "reusable/lib/tracking";

const MakePayment = ({ error, enrollmentStatus, enroll, redirect }) => {
  const InsufficientFunds = () => (
    <div className={styles.root}>
      <HeroHeader className="mb-20">
        Add funds to start paying your bills
      </HeroHeader>
      <div className={styles.noFundsContainer}>
        <p className="mb-30">
          Once your available balance in your checking or money market account
          is greater than $0, you can enroll in Bill Pay and start paying bills.
        </p>

        <Button
          adobeEvent="MAKE_BILL_PAYMENTS_MAKE_A_TRANSFER_BTN"
          href={URLS.TRANSFER_FUNDS}
        >
          Make a Transfer
        </Button>

        <h2 className={cx("meta-web-bold", styles.hdrReset)}>
          Other ways to fund your account:
        </h2>
        <div className={styles.enrollBoxContain}>
          <div className={cx(styles.enrollBox)}>
            <h3 className="meta-web-bold">Request a wire transfer</h3>
            <p>
              For information on how to schedule a wire transfer, visit the{" "}
              <a
                className="text-underline"
                href="https://bank.discover.com/bankac/profile/helpcenter"
              >
                Help Center
              </a>
              <br />
              or call{" "}
              <b>
                <TouchPhoneNumber>1-800-347-7000</TouchPhoneNumber>
              </b>
              .
            </p>
          </div>
          <div className={cx(styles.enrollBox)}>
            <h3 className="meta-web-bold">Send a check to:</h3>
            <p>
              Discover Bank
              <br />
              PO Box 30417
              <br />
              Salt Lake City, Utah 84130
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const WelcomeMsg = () => (
    <>
      <HeroHeader>Welcome to Discover Bank Online Bill Pay</HeroHeader>
      <p className="meta-web-bold mb-10">
        It&apos;s the easy, convenient way to pay and manage your bills.
      </p>
      <ul className={cx(styles.bulletList, "mb-15")}>
        <li>
          Pay many U.S.-based businesses or individuals in just a few simple
          steps
        </li>
        <li>
          Many payments can be scheduled to be made as quickly as the next
          business day
        </li>
        <li>Payments will be made by the “Deliver By” date</li>
        <li>Track your payment history to help manage your budget</li>
      </ul>
      <p>
        To enroll in Bill Pay, just accept the Terms & Conditions and select
        “Enroll.”
      </p>
    </>
  );

  const MigratedMsg = () => (
    <>
      <HeroHeader>Discover Bill Pay is better than ever</HeroHeader>
      <div className={styles.migratedContainer}>
        <p className={styles.subhead}>
          <b>
            We&apos;ve updated the look and made it easier to manage your bills
            in one place.
          </b>
        </p>
        <ul className={cx("reset row", styles.callouts)}>
          <li className="col-md-4">
            <CalendarCheckIcon />
            <p className="mt-15">
              Schedule payments your way, whether you&apos;re paying a single
              bill or making multiple payments at once
            </p>
          </li>
          <li className="col-md-4">
            <EBillThinIcon />

            <p className="mt-15">
              Set up eBills for more of your payees—we now have more than 1,200
              payees eligible for eBills
            </p>
          </li>
          <li className="col-md-4">
            <MobilePhoneIcon />

            <p className="mt-15">
              Enjoy a streamlined experience to pay bills, review payment
              activity, and more
            </p>
          </li>
        </ul>
        <p className={styles.calloutCta}>
          To get started, just accept the updated terms and conditions below.
          You will also need to re-enroll in eBills.
        </p>
      </div>
    </>
  );

  const Payees = () => {
    const history = useHistory();
    if (!enrollmentStatus) return <Spinner />;
    if (enrollmentStatus.payees.length > 0)
      return <SchedulePayment payees={enrollmentStatus.payees} />;

    return (
      <div className={styles.root}>
        <HeroHeader className="mb-20">
          Add a Payee to get started with Bill Pay
        </HeroHeader>
        <div className={styles.noFundsContainer}>
          <p className="mb-30">
            With Bill Pay, you can pay many U.S.-based businesses or
            individuals. All it takes is a few simple steps and you&apos;re
            ready to pay bills.
          </p>

          <Button
            onClick={() => {
              history.push({
                pathname: "/manage-payees",
              });
            }}
            adobeEvent="MAKE_BILL_PAYMENTS_ADD_A_PAYEE_BTN"
          >
            Add a Payee
          </Button>
        </div>
      </div>
    );
  };

  const Enroll = ({ migrated }) => {
    useTrackPageLoad("bankac/billpay/makePayments/enroll");
    const ref = useRef();
    const handleSubmit = (event) => {
      event.preventDefault();
      clickTrack("MAKE_BILL_PAYMENTS_ENROLL_BTN");
      enroll();
    };

    return (
      <form
        className={cx(styles.root, migrated ? styles.migrated : "")}
        onSubmit={handleSubmit}
        ref={ref}
      >
        {migrated ? <MigratedMsg /> : <WelcomeMsg />}

        <div className={migrated ? "d-inline-block" : ""}>
          <p className={styles.termsLine}>
            By selecting &quot;
            {migrated ? "Accept" : "Enroll"}&quot;, you acknowledge that you
            have received, are able to view, and agree to the Discover Bank
            Online Bill Pay{" "}
            <SmartLink
              to="https://www.discoverbank.com/bankac/billpay_tc.pdf"
              target="_blank"
              className="text-underline"
              rel="noopener noreferrer"
              adobeEvent="MAKE_BILL_PAYMENTS_BILL_PAY_TERMS_AND_CONDITIONS_LNK"
            >
              Terms &amp; Conditions.
            </SmartLink>
          </p>
          <p className={cx("mb-30", styles.hidePrint)}>
            Please save or{" "}
            <a
              href="https://www.discoverbank.com/bankac/billpay_tc.pdf"
              target="_blank"
              className="text-underline"
              rel="noopener noreferrer"
            >
              print
            </a>{" "}
            for your records.
          </p>
        </div>
        <Button
          type="submit"
          className={cx(migrated ? styles.enrollBtn : "", styles.hidePrint)}
        >
          {migrated ? "Accept" : "Enroll"}
        </Button>
      </form>
    );
  };

  Enroll.propTypes = {
    migrated: PropTypes.bool,
  };

  if (redirect) return <Redirect to="/manage-payees" push />;
  if (error) {
    console.error(error);
    return <Redirect to="/tech-diff" push />;
  }
  if (enrollmentStatus) {
    if (
      enrollmentStatus.eligible &&
      enrollmentStatus.fundsAvailable &&
      enrollmentStatus.enrolledInFIS &&
      enrollmentStatus.enrolledInDFS
    ) {
      return <Payees />;
    } else {
      const {
        eligible,
        fundsAvailable,
        enrolledInFIS,
        enrolledInDFS,
      } = enrollmentStatus;
      if (!eligible) throw new Error("User is not eligible");
      if (!fundsAvailable) return <InsufficientFunds />;
      if (!enrolledInFIS && !enrolledInDFS) return <Enroll />;

      if (!enrolledInDFS) {
        return <Enroll migrated />;
      }
    }
  }

  throw new Error("Unhandled scenario in MakePayment");
};

MakePayment.propTypes = {
  eligible: PropTypes.bool,
  enrolled: PropTypes.bool,
  error: PropTypes.bool,
  enroll: PropTypes.func.isRequired,
  migrated: PropTypes.bool,
  enrollmentStatus: PropTypes.object,
  redirect: PropTypes.bool.isRequired,
};

MakePayment.defaultProps = {
  error: false,
};

export default MakePayment;
