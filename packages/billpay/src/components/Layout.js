import React, {
  isValidElement,
  Suspense,
  useState,
  useRef,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import H1 from "reusable/lib/H1";
import IdleTimeout from "reusable/lib/IdleTimeout";
import Alert from "reusable/lib/Alert";
import SubNav from "./SubNav";
import AlertContext from "./AlertContext";
import styles from "./Layout.module.scss";
import { useLocation } from "react-router";
import HeroHeader from "./reusable/HeroHeader";
import SubheadingContext from "./SubheadingContext";
import ErrorBoundary from "../ErrorBoundary";

// Declare a route and wrap a component in the app's layout.
// Includes centralized alert system with a showAlert function exposed via context.
const Layout = ({
  path,
  exact,
  heading,
  subheading,
  menuIndex,
  children,
  scenarioSelector: ScenarioSelector,
}) => {
  const previousPathRef = useRef();
  const location = useLocation();
  const [alerts, setAlerts] = useState([]);

  // Allows to set subheading dynamically from the children context.
  const [dynamicSubheading, setDynamicSubheading] = useState();
  // Either show dynamically set or default subheading if exists.
  const currentSubheading = dynamicSubheading || subheading;

  // Store an array of alert references. Each alert needs a ref so we can focus it when it displays.
  const alertsRef = useRef([]);

  useEffect(
    function clearAlertsAndSubheadingWhenPageChanges() {
      const userNavigatedToNewPage = path !== previousPathRef.current;
      if (userNavigatedToNewPage) {
        setDynamicSubheading(undefined); // Reset dynamic subheading.
        if (!location.state?.preserveAlerts) setAlerts([]); // Skip clearing alerts when navigating to a new page if the page that set the alert set "preserveAlerts" in the state object.
        previousPathRef.current = path;
      }
    },
    [location, path]
  );

  useEffect(
    function focusNewestAlertWhenNumberOfAlertsChanges() {
      if (alerts.length > 0) {
        const newestAlertId = alerts[0].id;
        alertsRef.current[newestAlertId].focus();
        window.scroll(0, 0);
      }
    },
    [alerts]
  );

  function removeAlert(id) {
    delete alertsRef.current[id]; // Remove alert ref
    setAlerts((curAlerts) => curAlerts.filter((a) => a.id !== id));
  }

  return (
    <Route
      exact={exact}
      path={path}
      render={() => {
        return (
          <main className="meta-web-normal">
            {/* Wrap heading in H1 if passed in as string */}
            {isValidElement(heading) ? heading : <H1>{heading}</H1>}
            <SubheadingContext.Provider
              value={{ setSubheading: setDynamicSubheading }}
            >
              <AlertContext.Provider value={{ setAlerts }}>
                <SubNav activeIndex={menuIndex} />

                {/* Place error boundary below nav so that navigation continues to render when a child page fails */}
                <ErrorBoundary>
                  {currentSubheading ? (
                    isValidElement(currentSubheading) ? (
                      currentSubheading
                    ) : (
                      <HeroHeader>{currentSubheading}</HeroHeader>
                    )
                  ) : (
                    ""
                  )}

                  {alerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      type={alert.type}
                      onClose={() => removeAlert(alert.id)}
                      ref={(el) => (alertsRef.current[alert.id] = el)}
                      className={styles.alert}
                    >
                      {alert.content}
                    </Alert>
                  ))}

                  <Suspense fallback={<></>}>{children}</Suspense>
                </ErrorBoundary>
              </AlertContext.Provider>
            </SubheadingContext.Provider>
            {ScenarioSelector &&
              process.env.REACT_APP_USE_SCENARIO_SELECTOR === "Y" && (
                <Suspense fallback={<></>}>
                  {/* Accept either a component reference or JSX */}
                  {isValidElement(ScenarioSelector) ? (
                    ScenarioSelector
                  ) : (
                    <ScenarioSelector />
                  )}
                </Suspense>
              )}
            {/* Hide idle timeout in development since it's annoying */}
            {process.env.NODE_ENV !== "development" && (
              <IdleTimeout secondsBeforeWarning={720} />
            )}
          </main>
        );
      }}
    />
  );
};

Layout.propTypes = {
  /** Child component to compose within the layout's <main> section */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,

  /** React Router's exact prop. Applied to the embedded Route component. */
  exact: PropTypes.bool,

  /** Page heading. Accept a string or a React element. */
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,

  /** Page subheading. Accept a string or a React element. */
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /** React Router's path prop. Specifies the page's matching route. */
  path: PropTypes.string,

  /** The associated tabIndex that should be styled as active when this page's route matches. */
  menuIndex: PropTypes.number,

  /** The scenario selector for displaying different scenarios. */
  scenarioSelector: PropTypes.object,
};

Layout.defaultProps = {
  exact: false,
};

export default Layout;
