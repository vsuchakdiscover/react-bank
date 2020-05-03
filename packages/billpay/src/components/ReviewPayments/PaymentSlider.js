import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import AddNewPaymentCard from "./AddNewPaymentCard";
import H2 from "reusable/lib/H2";
import { useHistory } from "react-router-dom";
import PaymentSliderCard from "./PaymentSliderCard";
import CleanCombobox from "reusable/lib/CleanCombobox";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./PaymentSlider.module.scss";
import { useApi } from "reusable/lib/useApi";
import Banner from "./Banner";
import { paymentsApi, payeesApi, accountsApi } from "../../api";
import UpcomingPaymentBanners from "./UpcomingPaymentBanners";
import {
  dateRange,
  futureDate,
  sundayThisWeek,
  todayAtMidnight,
  futureTime,
  getTime,
} from "./paymentSliderDateUtils";
import useIsMobile from "reusable/lib/useIsMobile";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ArrowRightIcon from "reusable/lib/ArrowRightIcon";
import cx from "classnames";

export const FILTER = {
  CURRENT_WEEK: "CW",
  NEXT_WEEK: "NW",
  NEXT_30_DAYS: "N30",
  ONE_TIME_PAYMENTS_AFTER_30_DAYS: "OTP30",
  REPEATING_PAYMENTS_AFTER_30_DAYS: "RP30",
};

const PaymentSlider = ({ addToPaymentsAsCancelled }) => {
  const sliderRef = useRef(null);
  const history = useHistory();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState(FILTER.NEXT_30_DAYS);

  const {
    loading: paymentsLoading,
    error: paymentError,
    data: payments = [],
    setData: setPayments,
  } = useApi(paymentsApi.getPaymentList, {
    statuses: [
      "SCHEDULED",
      "COMPLETED",
      "PROCESSING",
      "CANCELED",
      "FAILED",
      "OTHER",
    ],
  });

  const {
    loading: payeesLoading,
    error: payeesError,
    data: payees = [],
    setData: setPayees,
  } = useApi(payeesApi.getPayees);

  const {
    loading: accountsLoading,
    error: accountsError,
    data: accounts = [],
  } = useApi(accountsApi.getAccounts);

  function getFilteredPayments(_payments) {
    const lastDayThisWeek = futureTime(6, sundayThisWeek);
    const sundayNextWeek = futureTime(7, sundayThisWeek);
    const lastDayNextWeek = futureTime(13, sundayThisWeek);
    const thirtyDaysFromToday = futureTime(30, todayAtMidnight);

    switch (filter) {
      case FILTER.CURRENT_WEEK:
        return _payments.filter((p) => {
          const deliverByDate = getTime(p.deliverByDate);
          return (
            deliverByDate >= sundayThisWeek && deliverByDate <= lastDayThisWeek
          );
        });

      case FILTER.NEXT_WEEK:
        return _payments.filter((p) => {
          const deliverByDate = getTime(p.deliverByDate);
          return (
            deliverByDate >= sundayNextWeek && deliverByDate <= lastDayNextWeek
          );
        });

      case FILTER.NEXT_30_DAYS:
        return _payments.filter((p) => {
          const deliverByDate = getTime(p.deliverByDate);
          return (
            deliverByDate <= thirtyDaysFromToday &&
            deliverByDate >= todayAtMidnight.getTime()
          );
        });

      case FILTER.ONE_TIME_PAYMENTS_AFTER_30_DAYS:
        return _payments.filter(
          (p) =>
            p.type === "ONE_TIME" &&
            getTime(p.deliverByDate) > thirtyDaysFromToday
        );

      case FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS:
        return _payments.filter(
          (p) =>
            p.type === "REPEATING" &&
            getTime(p.deliverByDate) > thirtyDaysFromToday
        );

      default:
        throw new Error("Unhandled scheduledPayments filter: " + filter);
    }
  }

  function sortPayments(a, b) {
    if (a.deliverByDate < b.deliverByDate) {
      return -1;
    }
    if (a.deliverByDate > b.deliverByDate) {
      return 1;
    }
    return 0;
  }

  function handleDeletePayment(payment) {
    setPayments(
      payments.map((p) => {
        if (p.paymentId === payment.paymentId) {
          p.status = "CANCELED";
        }
        return p;
      })
    );
    addToPaymentsAsCancelled([payment]);
  }

  function handleDeleteRepeatingPayment(payment) {
    setPayments(
      payments.map((p) => {
        if (p.ruleId === payment.ruleId && p.status === "SCHEDULED") {
          p.status = "CANCELED";
          addToPaymentsAsCancelled([p]);
        }
        return p;
      })
    );

    setPayees(
      payees.map((p) => {
        if (p.id === payment.payee.id) {
          delete p.repeatingPayment;
        }
        return p;
      })
    );
  }

  function handleDeleteRepeatingRule(payment) {
    setPayments(
      payments.map((p) => {
        if (
          p.ruleId === payment.repeatingPayment.ruleId &&
          p.status === "SCHEDULED" //only mark as canceled currently scheduled payments
        ) {
          p.status = "CANCELED";
        }
        return p;
      })
    );
    addToPaymentsAsCancelled(
      payments.filter(
        (p) =>
          p.ruleId === payment.repeatingPayment.ruleId &&
          p.status === "SCHEDULED" //only mark as canceled currently scheduled payments
      )
    );
    setPayees(
      payees.map((p) => {
        if (p.id === payment.payee.id) {
          delete p.repeatingPayment;
        }
        return p;
      })
    );
  }

  function getFilters() {
    return [
      {
        label: `Current Week: ${dateRange(
          sundayThisWeek,
          futureDate(6, sundayThisWeek)
        )}`,
        value: FILTER.CURRENT_WEEK,
      },
      {
        label: `Next Week: ${dateRange(
          futureDate(7, sundayThisWeek),
          futureDate(13, sundayThisWeek)
        )}`,
        value: FILTER.NEXT_WEEK,
      },
      {
        label: `Next 30 days: ${dateRange(
          new Date(),
          futureDate(30, todayAtMidnight)
        )}`,
        value: FILTER.NEXT_30_DAYS,
      },
      {
        label: "One Time Payments after 30 days",
        value: FILTER.ONE_TIME_PAYMENTS_AFTER_30_DAYS,
      },
      {
        label: "Repeating Payments after 30 days",
        value: FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS,
      },
    ];
  }

  if (paymentsLoading || payeesLoading || accountsLoading) return null;

  if (paymentError || payeesError || accountsError) {
    console.error(
      "Error loading data in PaymentSlider",
      paymentError,
      payeesError,
      accountsError
    );
    throw new Error("Error loading data in PaymentSlider");
  }

  const sliderSettings = {
    dots: true,
    className: styles.slickSlider,
    infinite: false,
    arrows: false,
    speed: 500,
    // If there aren't 4 payments to display, then show the length + 1 (plus 1 accounts for the add payment card)
    slidesToShow: payments.length < 3 ? payments.length + 1 : 4,
    slidesToScroll: 4,
    // eslint-disable-next-line react/display-name
    appendDots: (dots) => (
      <div>
        <Button
          adobeEvent="BillPay:ReviewPayments:Scheduled:Icon:Previous"
          className={cx(styles.unstyledBtn, styles.rotated)}
          onClick={slidePrev}
          aria-label="View previous payments page"
        >
          <ArrowRightIcon />
        </Button>
        <ul> {dots} </ul>
        <Button
          adobeEvent="BillPay:ReviewPayments:Scheduled:Icon:Next"
          className={styles.unstyledBtn}
          onClick={slideNext}
          aria-label="View next payments page"
        >
          <ArrowRightIcon />
        </Button>
      </div>
    ),
    responsive: [
      {
        breakpoint: 960,
        settings: {
          dots: false,
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          dots: false,
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const sortedPayments =
    filter === FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS
      ? payees.filter(
          (p) => p.repeatingPayment && p.repeatingPayment.nextPaymentDate //nextPaymentDate property lets us know that this payee has payments scheduled out past 30 days
        )
      : [
          ...getFilteredPayments(
            payments.filter(
              (p) =>
                p.status === "SCHEDULED" ||
                p.status === "COMPLETED" ||
                p.status === "PROCESSING"
            )
          ),
        ].sort(sortPayments);

  const slideNext = () => {
    sliderRef.current.slickNext();
  };
  const slidePrev = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <>
      <H2>Scheduled Payments</H2>
      <section role="contentinfo" aria-label="Scheduled Payments">
        <CleanCombobox
          id="scheduledPaymentsFilter"
          label="Filter selected payments"
          options={getFilters()}
          name="scheduledPaymentsFilter"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        />
        {sortedPayments.length === 0 ? (
          <>
            {!isMobile && (
              <div className={"mb-20"}>
                <AddNewPaymentCard />
              </div>
            )}
            <Banner>
              You don&apos;t have any payments scheduled in this time period.
            </Banner>
          </>
        ) : (
          <>
            <div className={styles.sliderWrapper}>
              {/* Use a key to assure the first "page" of the slider is shown when the filter changes 
            (React creates a completely new component instance when the key changes) */}
              <Slider key={filter} ref={sliderRef} {...sliderSettings}>
                {!isMobile && <AddNewPaymentCard />}
                {filter === FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS
                  ? sortedPayments.map((payee) => (
                      <PaymentSliderCard
                        key={payee.id}
                        payee={payee}
                        payments={payments}
                        onDeletePayment={handleDeleteRepeatingRule}
                        onDeleteSeriesPayment={handleDeleteRepeatingRule}
                        payees={payees}
                        accounts={accounts}
                        filter={filter}
                      />
                    ))
                  : sortedPayments.map((payment) => (
                      <PaymentSliderCard
                        key={payment.paymentId}
                        payment={payment}
                        payments={payments}
                        onDeletePayment={handleDeletePayment}
                        onDeleteSeriesPayment={handleDeleteRepeatingPayment}
                        payees={payees}
                        accounts={accounts}
                        filter={filter}
                      />
                    ))}
              </Slider>
            </div>
            {filter !== FILTER.REPEATING_PAYMENTS_AFTER_30_DAYS && (
              <UpcomingPaymentBanners
                upcomingPayments={sortedPayments}
                filter={filter}
              />
            )}
          </>
        )}
        {isMobile && (
          <Button
            className="mb-15"
            adobeEvent="BillPay:ReviewPayments:Lnk:Make A Payment"
            buttonStyle={BUTTON_TYPES.GHOST}
            onClick={() => history.push("/")}
          >
            Make a Payment
          </Button>
        )}
      </section>
    </>
  );
};

PaymentSlider.propTypes = {
  addToPaymentsAsCancelled: PropTypes.func.isRequired,
};

export default PaymentSlider;
