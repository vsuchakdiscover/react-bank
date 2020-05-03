import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./ScheduledPaymentCard.module.scss";
import Card from "../Card";

const ScheduledPaymentCard = ({ amount, className, date, ...props }) => (
  <Card className={className} design="orange">
    <div className={cx(styles.inner, "row align-items-center")}>
      <div className={cx("col-6 order-1 col-md-2", styles.date)}>{date}</div>
      <div
        className={cx("col-8 col-md-7 col-lg-8 order-3 order-md-2", styles.msg)}
      >
        {props.children}
      </div>
      <div
        className={cx(
          "col-6 col-md-3 col-lg-2 order-2 order-md-3 ",
          styles.amount
        )}
      >
        ${amount}
      </div>
    </div>
  </Card>
);

ScheduledPaymentCard.propTypes = {
  /** Formatted amount to display */
  amount: PropTypes.string.isRequired,

  /** Scheduled Payment Message/Description */
  children: PropTypes.any.isRequired,

  /** Class to apply to wrapper div */
  className: PropTypes.string,

  /** Date to display */
  date: PropTypes.string.isRequired,
};

export default ScheduledPaymentCard;
