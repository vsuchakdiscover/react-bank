/* eslint-disable react/prop-types */
import React from "react";
import styles from "./FAQ.module.scss";

const Disclaimer1 = ({ num = 1 }) => (
  <>
    <p className={styles.disclaimer}>
      <sup>{num}</sup>Transactions typically occur in minutes when the
      recipient’s email address or U.S. mobile number is already enrolled with
      <em>Zelle</em>.
    </p>
    <p className={styles.disclaimer}>
      <em>Zelle</em> enrollment is required with a U.S.-based bank account and a
      U.S. mobile number or email address. Voice over IP (VOIP), prepaid mobile
      phone numbers, landlines and Google voice numbers are not eligible for
      <em>Zelle</em> enrollment. Message and data charges from your carrier may
      apply. Transaction limitations may apply.
    </p>
    <p className={styles.disclaimer}>
      To use <em>Zelle</em> with Discover, an account center registered Discover
      checking, savings, or money market account is required. Discover and
      <em>Zelle</em>
      do not offer a protection program for any authorized payments made with
      <em>Zelle</em>.
    </p>
  </>
);

const UsBankDisclaimer = ({ num = 1 }) => (
  <p className={styles.disclaimer}>
    <sup>{num}</sup>Must have a bank account in the U.S. to use <em>Zelle</em>.
  </p>
);

const SendDisclaimer = ({ num = 1 }) => (
  <p className={styles.disclaimer}>
    <sup>{num}</sup>In order to send payment requests or split payment requests
    to a U.S. mobile number, the mobile number must already be enrolled in
    <em>Zelle</em>.
  </p>
);

const SendMoney = () => (
  <>
    <strong>Send Money:</strong>
    <ol>
      <li>Choose &quot;Send&quot;</li>
      <li>
        Select your recipient from your mobile device’s contacts or add a
        trusted recipient’s email address or U.S. mobile number
      </li>
      <li>Enter the amount </li>
      <li>Hit &quot;Send&quot; to complete the payment</li>
    </ol>
  </>
);

const RequestMoney = () => (
  <>
    <strong>
      Request Money<sup>1</sup>:
    </strong>
    <ol>
      <li>Choose &quot;Request&quot;</li>
      <li>Select the individual(s) from whom you’d like to request money</li>
      <li>Enter the amount</li>
      <li>Hit &quot;Request&quot;</li>
    </ol>
  </>
);

export const faqs = [
  {
    q: (
      <>
        What is <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          <em>Zelle</em> is a fast<sup>1</sup> and easy way to send money
          directly to almost any bank account in the U.S. With just an email
          address or U.S. mobile phone number, you can send money to people you
          trust, regardless of where they bank<sup>2</sup>.
        </p>
        <Disclaimer1 />
        <UsBankDisclaimer num={2} />
      </>
    ),
  },
  {
    q: (
      <>
        How do I use <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          To get started, log into the Discover Bank account center or mobile
          app. Choose &quot;Send Money with Zelle®&quot; from the Transfers
          menu, follow the enrollment prompts, and accept the terms and
          conditions.
        </p>
        <SendMoney />
        <RequestMoney />
        <strong>Receive Money:</strong>
        <p>
          Share your enrolled email address or U.S. mobile phone number with a
          friend and ask them to send you money with <em>Zelle</em>.
        </p>
        <SendDisclaimer />
      </>
    ),
  },
  {
    q: (
      <>
        How do I send money with <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          To get started, log into the Discover Bank account center or mobile
          app. Choose &quot;Send Money with Zelle®&quot; from the Transfers
          menu, follow the enrollment prompts, and accept the terms and
          conditions.
        </p>
        <SendMoney />
      </>
    ),
  },
];
