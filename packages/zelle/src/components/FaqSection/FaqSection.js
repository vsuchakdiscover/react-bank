import React from "react";
import cx from "classnames";
import styles from "./FaqSection.module.scss";
import { faqs } from "./Faqs";
import FAQ from "reusable/lib/FAQ";

const FaqSection = () => {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className="container-fluid pl-0 pr-0 mt-30">
          <div className="col-12">
            <h2 className={cx("meta-web-normal", styles.title)}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="col-12">
            {faqs.map(({ q, a, t }, index) => (
              <FAQ
                answer={a}
                index={index}
                key={index}
                question={q}
                tracking={t}
              />
            ))}
          </div>
          <div className="col-12">
            <div className={styles.disclaimerContainer}>
              <span className={cx(styles.disclaimerNum, styles.disclaimerText)}>
                1
              </span>
              <p className={styles.disclaimerText}>
                Transactions typically occur in minutes when the recipient’s
                email address or U.S. mobile number is already enrolled with{" "}
                <em>Zelle</em>.
              </p>
              <p className={styles.disclaimerText}>
                <em>Zelle</em> enrollment is required with a U.S.-based bank
                account and a U.S. mobile number or email address. Voice over IP
                &#40;VOIP&#41;, prepaid mobile phone numbers, landlines and
                Google voice numbers are not eligible for <em>Zelle</em>{" "}
                enrollment. Message and data charges from your carrier may
                apply. Transaction limitations may apply.
              </p>
              <p className={styles.disclaimerText}>
                To use <em>Zelle</em> with Discover, an Account Center
                registered Discover Checking, Online Savings, Statement Savings,
                or Money Market Account is required. Discover and <em>Zelle</em>{" "}
                do not offer a protection program for any authorized payments
                made with <em>Zelle</em>.
              </p>
              <p className={styles.disclaimerText}>
                <em>Zelle</em> and the <em>Zelle</em> related marks are wholly
                owned by Early Warning Services, LLC and are used herein under
                license.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
