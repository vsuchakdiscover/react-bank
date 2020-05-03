/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import H3 from "reusable/lib/H3";
import styles from "./Cta.module.scss";
import enrollIcon from "../../images/payment-settings.svg";
import globeIcon from "../../images/globe.svg";
import moneyIcon from "../../images/money-fast.svg";

const Card = ({ image, heading, children }) => (
  <div className="col-12 col-md-4">
    <div className={styles.container}>
      <div className={styles.iconContainer}>{image}</div>
      <H3 className={cx("meta-web-bold", styles.title)}>{heading}</H3>
      <p className={cx("meta-web-normal", styles.copy)}>{children}</p>
    </div>
  </div>
);

const Cta = () => (
  <section className="container-fluid">
    <div className="row">
      <Card
        image={
          <img className={styles.icon} src={enrollIcon} alt="Enroll icon" />
        }
        heading={
          <>
            Enroll with <em>Zelle</em>
          </>
        }
      >
        All you need is an email address and U.S. mobile phone number.
      </Card>

      <Card
        image={<img className={styles.icon} src={globeIcon} alt="Globe icon" />}
        heading="Start sending and receiving"
      >
        Send money directly from your account to friends, family, and people you
        trust<sup>1</sup>.
      </Card>

      <Card
        image={
          <img
            className={cx(styles.icon, styles.icon__narrow)}
            src={moneyIcon}
            alt="Money icon"
          />
        }
        heading="Money moves fast"
      >
        All it takes is a few clicks and funds arrive in minutes <sup>1</sup>.
      </Card>

      <div className="col-12 col-md-12">
        <span className={styles.orangeBorder} />
      </div>
    </div>
  </section>
);

export default Cta;
