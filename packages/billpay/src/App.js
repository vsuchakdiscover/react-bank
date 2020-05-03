import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Spinner from "reusable/lib/Spinner";
import H1 from "reusable/lib/H1";
import "reusable/src/scss/global.scss";
import PageNotFound from "./components/PageNotFound";
import Layout from "./components/Layout";
import BankHolidaysProvider from "reusable/lib/BankHolidaysProvider";
import { payeesApi } from "./api";
import TechDiff from "./components/TechDiff";

// Lazy load pages
const ReviewPayments = React.lazy(() =>
  import(/* webpackChunkName: "ReviewPayments" */ "./components/ReviewPayments")
);

const MakePaymentContainer = React.lazy(() =>
  import(
    /* webpackChunkName: "MakePaymentContainer" */ "./components/MakePayment/MakePaymentContainer"
  )
);

const ManagePayees = React.lazy(() =>
  import(/* webpackChunkName: "ManagePayees" */ "./components/ManagePayees")
);

const AddPayeeContainer = React.lazy(() =>
  import(
    /* webpackChunkName: "AddPayeeContainer" */ "./components/ManagePayees/AddPayee"
  )
);

const Ebills = React.lazy(() =>
  import(/* webpackChunkName: "Ebills" */ "./components/Ebills")
);

const EbillsEnroll = React.lazy(() =>
  import(
    /* webpackChunkName: "EbillsEnroll" */ "./components/Ebills/enroll/EbillsEnroll"
  )
);

// Lazy load scenario selectors so they're not part of the prod build
const MakePaymentScenarioSelector = React.lazy(() =>
  import(
    /* webpackChunkName: "devtools" */ "./components/MakePayment/MakePaymentScenarioSelector"
  )
);

const ManagePayeeScenarioSelector = React.lazy(() =>
  import(
    /* webpackChunkName: "devtools" */ "./components/ManagePayees/ManagePayeeScenarioSelector"
  )
);

const EbillsScenarioSelector = React.lazy(() =>
  import(
    /* webpackChunkName: "devtools" */ "./components/Ebills/EbillsScenarioSelector"
  )
);

const ReviewPaymentsScenarioSelector = React.lazy(() =>
  import(
    /* webpackChunkName: "devtools" */ "./components/ReviewPayments/ReviewPaymentsScenarioSelector"
  )
);

function App() {
  const [payees, setPayees] = useState([]);

  return (
    <Suspense fallback={<Spinner />}>
      <BankHolidaysProvider getBankHolidays={payeesApi.getBankHolidays}>
        <Router basename={process.env.REACT_APP_ROOT}>
          <Switch>
            <Layout
              exact
              path="/"
              heading={
                <H1>
                  Payments
                  <span className="sr-only">: Make a Bill Payment</span>
                </H1>
              }
              menuIndex={0}
              scenarioSelector={MakePaymentScenarioSelector}
            >
              <MakePaymentContainer />
            </Layout>

            <Layout
              exact
              path="/edit-payment/:id?"
              heading={
                <H1>
                  Payments
                  <span className="sr-only">: Make a Bill Payment</span>
                </H1>
              }
              scenarioSelector={MakePaymentScenarioSelector}
            >
              <MakePaymentContainer />
            </Layout>

            <Layout
              path="/review-payments"
              heading={
                <H1>
                  Payments
                  <span className="sr-only">: Review Payments</span>
                </H1>
              }
              menuIndex={1}
              scenarioSelector={ReviewPaymentsScenarioSelector}
              subheading="See your scheduled and delivered payments"
            >
              <ReviewPayments />
            </Layout>

            <Layout
              path="/manage-payees"
              heading={
                <H1>
                  Payments<span className="sr-only">: Manage Payees</span>
                </H1>
              }
              menuIndex={2}
              scenarioSelector={ManagePayeeScenarioSelector}
              subheading="Organize your payees in one location"
            >
              <ManagePayees payees={payees} setPayees={setPayees} />
            </Layout>

            <Layout
              path="/add-payee"
              heading={
                <H1>
                  Payments<span className="sr-only">: Manage Payees</span>
                </H1>
              }
              menuIndex={2}
              subheading="Organize your payees in one location"
            >
              <AddPayeeContainer payees={payees} setPayees={setPayees} />
            </Layout>

            <Layout
              path="/manage-ebills/enroll"
              heading={
                <H1>
                  Payments<span className="sr-only">: eBills enroll</span>
                </H1>
              }
              scenarioSelector={EbillsScenarioSelector}
              menuIndex={3}
            >
              <EbillsEnroll payees={payees} setPayees={setPayees} />
            </Layout>

            <Layout
              path="/manage-ebills"
              heading={
                <H1>
                  Payments<span className="sr-only">: Manage eBills</span>
                </H1>
              }
              subheading="Receive your bills the easy way"
              scenarioSelector={EbillsScenarioSelector}
              menuIndex={3}
            >
              <Ebills payees={payees} setPayees={setPayees} />
            </Layout>

            <Layout
              heading={
                <H1>
                  Payments
                  <span className="sr-only">: Technical Difficulty</span>
                </H1>
              }
              path="/tech-diff"
            >
              <TechDiff />
            </Layout>

            {/* This will match any unmatched routes */}
            <Layout heading="">
              <PageNotFound />
            </Layout>
          </Switch>
        </Router>
      </BankHolidaysProvider>
    </Suspense>
  );
}

export default App;
