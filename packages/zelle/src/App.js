import React, { useState, useEffect, useCallback, Suspense } from "react";
import { tmxApi, enrollmentApi, profileApi } from "./api";
import Spinner from "reusable/lib/Spinner";
import Alert from "reusable/lib/Alert";
import Button from "reusable/lib/Button";
import DropdownButton from "reusable/lib/DropdownButton";
import IdleTimeout from "reusable/lib/IdleTimeout";
import URLS from "reusable/lib/urls";
import { clickTrack } from "reusable/lib/tracking";
import Marquee from "./components/Marquee";
import EnrollSection from "./components/EnrollSection";
import ErrorBoundary from "./ErrorBoundary";
import FaqSection from "./components/FaqSection";
import Cta from "./components/Cta";
import OOB from "./components/OOB";
import "../../reusable/src/scss/global.scss";
import styles from "./App.module.scss";
import Redirect from "./components/Redirect";

// Lazy load since it's a dev tool that's only used in development anyway. This keeps it out of the main prod bundle.
// It will only be called in JSX below when in dev environment.
const ScenarioSelector = React.lazy(() =>
  import("./components/ZelleScenarioSelector")
);

const VIEW = {
  ERROR: "ERROR",
  RSA_DENY: "RSA_DENY",
  UNINITIALIZED: "UNINITIALIZED",
  ENROLLED: "ENROLLED",
  ACCEPTANCE_REQUIRED: "ACCEPTANCE_REQUIRED",
  OOB_ON_LOAD: "OOB_ON_LOAD",
  PROFILE_INCOMPLETE: "PROFILE_INCOMPLETE",
  NO_ELIGIBLE_ACCOUNTS: "NO_ELIGIBLE_ACCOUNTS",
  NO_POSITIVE_BALANCE: "NO_POSITIVE_BALANCE",
};

function App() {
  const [profile, setProfile] = useState(null);
  const [zelleIframeUrl, setZelleIframeUrl] = useState(null);
  const [tmxId, setTmxId] = useState(null);
  const [view, setView] = useState(VIEW.UNINITIALIZED);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: null,
  });

  function showAlert(message, type) {
    window.scrollTo(0, 0);
    setAlert({ show: true, message, type });
  }

  async function enroll() {
    try {
      const resp = await enrollmentApi.postEnrollment(tmxId);
      setView(VIEW.ENROLLED);
      setZelleIframeUrl(resp.data.url);
      window.scroll(0, 0);
    } catch (error) {
      setView(VIEW.ERROR);
    }
  }

  async function getEnrollment() {
    try {
      const resp = await enrollmentApi.getEnrollment(tmxId, "Y");
      setView(VIEW.ENROLLED);
      setZelleIframeUrl(resp.data.url);
      window.scroll(0, 0);
    } catch (error) {
      setView(VIEW.ERROR);
    }
  }

  const getProfile = useCallback(async () => {
    const profileResp = await profileApi.getProfile();
    profileResp.status === 200
      ? setProfile(profileResp.data)
      : setView(VIEW.ERROR);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const tmxResp = await tmxApi.getTMX();
        setTmxId(tmxResp.data.tmxId);

        try {
          const enrollmentResp = await enrollmentApi.getEnrollment(
            tmxResp.data.tmxId,
            "N"
          );
          if (enrollmentResp.data.enrolled) {
            setZelleIframeUrl(enrollmentResp.data.url);
            setView(VIEW.ENROLLED);
          } else {
            getProfile();
          }
        } catch (error) {
          // API should return an errors array. If not there, just show error page.
          if (error.response.status === 403) return setView(VIEW.RSA_DENY);
          if (!error.response.data.errors) return setView(VIEW.ERROR);
          switch (error.response.data.errors[0].code) {
            case "Terms.Acceptance.Required":
              await getProfile();
              return setView(VIEW.ACCEPTANCE_REQUIRED);
            case "General.AccessDenied.BankSA":
              return setView(VIEW.OOB_ON_LOAD);
            case "Ineligible.Customer.Profile.Incomplete":
              return setView(VIEW.PROFILE_INCOMPLETE);
            case "Ineligible.No.Eligible.Accounts":
              return setView(VIEW.NO_ELIGIBLE_ACCOUNTS);
            case "Ineligible.No.Positive.Balance":
              return setView(VIEW.NO_POSITIVE_BALANCE);
            default:
              setView(VIEW.ERROR);
          }
        }
      } catch (error) {
        setView(VIEW.ERROR);
      }
    }

    init();
  }, [getProfile]);

  const ProfileIncomplete = () => (
    <div className={styles.profileError}>
      <h2>Please update your profile before you enroll in Zelle</h2>
      <p>
        You must have a valid email address and at least one phone number on
        file.
      </p>
      <Button
        onClick={() => {
          clickTrack("BANKAC_ZELLE_LANDING_PROFILE_UPDATE_PROFILE_BTN");
          window.location = URLS.VIEW_PROFILE;
        }}
      >
        Update Profile
      </Button>
    </div>
  );

  const NoAccounts = () => (
    <div className={styles.profileError}>
      <h2>
        Ready to get started with Zelle? Just open an eligible bank account.
      </h2>
      <p>
        Use Zelle with a Cashback Debit, Online Savings, or Money Market
        Account.
      </p>
      <DropdownButton
        label="Open an Account"
        onClick={() => clickTrack("BANKAC_ZELLE_LANDING_OPEN_AN_ACCOUNT_BTN")}
        onKeydown={() => clickTrack("BANKAC_ZELLE_LANDING_OPEN_AN_ACCOUNT_BTN")}
        options={[
          {
            label: "Cashback Debit",
            value: URLS.CREATE_NEW_CHECKING_ACCOUNT,
          },
          {
            label: "Savings",
            value: URLS.CREATE_NEW_SAVINGS_ACCOUNT,
          },
          {
            label: "Money Market",
            value: URLS.CREATE_NEW_MONEY_MARKET_ACCOUNT,
          },
        ]}
      ></DropdownButton>
    </div>
  );

  const NoPositiveBalance = () => (
    <div className={styles.profileError}>
      <h2>
        Ready to get started with Zelle? Just add money to your Discover bank
        account.
      </h2>
      <p>
        You must have a positive balance in an eligible Discover bank account to
        enroll in Zelle.
      </p>
      <Button
        onClick={() => {
          clickTrack("BANKAC_ZELLE_LANDING_MAKE_TRANSFER_BTN");
          window.location = URLS.TRANSFER_FUNDS;
        }}
      >
        Make a Transfer
      </Button>
    </div>
  );

  function renderView() {
    switch (view) {
      case VIEW.PROFILE_INCOMPLETE:
        return <ProfileIncomplete />;
      case VIEW.NO_ELIGIBLE_ACCOUNTS:
        return <NoAccounts />;
      case VIEW.NO_POSITIVE_BALANCE:
        return <NoPositiveBalance />;
      case VIEW.ACCEPTANCE_REQUIRED:
        return (
          <EnrollSection
            profile={profile}
            tmxId={tmxId}
            setProfile={setProfile}
            showAlert={showAlert}
            enroll={enroll}
          />
        );
      default:
        throw new Error("Unknown view: " + view);
    }
  }

  function renderZelle() {
    switch (view) {
      case VIEW.ERROR:
        return <Redirect to={URLS.TECH_DIFF} />;
      case VIEW.RSA_DENY:
        return <Redirect to={URLS.RSA_DENY} />;
      case VIEW.UNINITIALIZED:
        return (
          <div className={styles.spinnerWrapper}>
            <Spinner center={false} />
          </div>
        );
      case VIEW.OOB_ON_LOAD:
        return (
          <div className={styles.oobOnLoadWrapper}>
            <OOB
              onCancel={() => (window.location = URLS.LOGOUT)}
              onComplete={getEnrollment}
            />
          </div>
        );
      case VIEW.ENROLLED:
        return (
          <div className={styles.iframe}>
            <iframe
              width="100%"
              height="100%"
              title="Zelle"
              frameBorder="0"
              src={zelleIframeUrl}
            />
          </div>
        );
      default:
        return (
          <>
            {alert.show && (
              <Alert
                className={styles.alert}
                type={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
              >
                {alert.message}
              </Alert>
            )}
            <Marquee />

            <section className={styles.section}>
              <div className={styles.shadowBox}>
                <span className={styles.gradientBorder} />
                <div className={styles.shadowBoxInner}>
                  <Cta />
                  {renderView()}
                </div>
              </div>
            </section>
            <FaqSection />
          </>
        );
    }
  }

  return (
    <ErrorBoundary>
      {(process.env.NODE_ENV === "development" ||
        process.env.REACT_APP_USE_SCENARIO_SELECTOR === "Y") && (
        <Suspense fallback={<></>}>
          <ScenarioSelector />
        </Suspense>
      )}
      {renderZelle()}
      <IdleTimeout />
    </ErrorBoundary>
  );
}

export default App;
