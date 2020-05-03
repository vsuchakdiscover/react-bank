/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
// This file contains all the FAQ data, formatted in JSX.
// It's used by FaqSection.js

import React from "react";
import styles from "./Faqs.module.scss";

const Disclaimer1 = ({ num = 1 }) => (
  <>
    <p className={styles.disclaimer}>
      <sup>{num}</sup>Transactions typically occur in minutes when the
      recipient’s email address or U.S. mobile number is already enrolled with{" "}
      <em>Zelle</em>.
    </p>
    <p className={styles.disclaimer}>
      <em>Zelle</em> enrollment is required with a U.S.-based bank account and a
      U.S. mobile number or email address. Voice over IP (VOIP), prepaid mobile
      phone numbers, landlines and Google voice numbers are not eligible for{" "}
      <em>Zelle</em> enrollment. Message and data charges from your carrier may
      apply. Transaction limitations may apply.
    </p>
    <p className={styles.disclaimer}>
      To use <em>Zelle</em> with Discover, an Account Center registered Discover
      Checking, Online Savings, Statement Savings, or Money Market Account is
      required. Discover and <em>Zelle</em> do not offer a protection program
      for any authorized payments made with <em>Zelle</em>.
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
    to a U.S. mobile number, the mobile number must already be enrolled in{" "}
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
        <UsBankDisclaimer className="mb-0" num={2} />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_WHAT_ZELLE_EXPAND_LNK",
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
          To get started, log into the online Account Center or mobile app.
          Choose "Send Money with Zelle<sup>®</sup>" from the Transfers menu,
          follow the enrollment prompts, and accept the terms and conditions.
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
    t: "BANKAC_ZELLE_FAQ_HOW_USE_EXPAND_LNK",
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
          To get started, log into the online Account Center or mobile app.
          Choose "Send Money with Zelle<sup>®</sup>" from the Transfers menu,
          follow the enrollment prompts, and accept the terms and conditions.
        </p>
        <SendMoney />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_HOW_SEND_EXPAND_LNK",
  },
  {
    q: (
      <>
        How do I request money with <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          To get started, log into the online Account Center or mobile app.
          Choose &quot;Send Money with Zelle<sup>®</sup>&quot; from the
          Transfers menu, follow the enrollment prompts, and accept the terms
          and conditions.
        </p>
        <RequestMoney />
        <SendDisclaimer />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_HOW_REQUEST_EXPAND_LNK",
  },
  {
    q: (
      <>
        How do I receive money with <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          To receive money with <em>Zelle</em>, you’ll need to enroll your U.S.
          mobile number or email address. You can then share your enrolled email
          address or U.S. mobile phone number with a friend and ask them to send
          you money with <em>Zelle</em>.
        </p>
        <p>
          If you have already enrolled with <em>Zelle</em>, you do not need to
          take any further action. The money will move directly into your bank
          account, typically within minutes
          <sup>1</sup>.
        </p>
        <Disclaimer1 />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_HOW_RECEIVE_EXPAND_LNK",
  },
  {
    q: (
      <>
        How do I enroll with <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          It’s easy—<em>Zelle</em> is already available in the Discover mobile
          app and the online Account Center.
        </p>
        <p>
          You can enroll with <em>Zelle</em> online or through our mobile app.
          Once you log into your account, select &quot;Send Money with Zelle
          <sup>®</sup>&quot; from the Transfers menu and follow the enrollment
          prompts.
        </p>
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_HOW_ENROLL_EXPAND_LNK",
  },
  {
    q: (
      <>
        Which accounts can I use to send money with <em>Zelle</em>?
      </>
    ),
    a: (
      <p>
        You can send money from your Discover Checking, Online Savings,
        Statement Savings, or Money Market Accounts. If you’re using a Discover
        Online Savings, Statement Savings, or Money Market Account, please be
        aware that sending money with <em>Zelle</em> will count toward your 6
        limited transactions for the month.
      </p>
    ),
    t: "BANKAC_ZELLE_FAQ_WHICH_ACCOUNTS_EXPAND_LNK",
  },
  {
    q: (
      <>
        Who can I send money to with <em>Zelle?</em>
      </>
    ),
    a: (
      <>
        <p>
          You can use <em>Zelle</em> to send money directly to almost any bank
          account in the U.S. Since money is typically sent in minutes
          <sup>1</sup>, it’s important to only send money to people you trust,
          and always ensure you’ve used the correct email address or U.S. mobile
          number
        </p>
        <Disclaimer1 />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_WHO_SEND_EXPAND_LNK",
  },
  {
    q: "How do I add a new recipient so that I can send them money?",
    a: (
      <>
        <p>
          Once you send or request money to or from someone new, they’ll be
          added to your recipient list so you can easily send/receive in the
          future.
        </p>
        <p>
          To add a trusted recipient using the Discover mobile app: select
          &quot;Send Money with Zelle<sup>®</sup>&quot; from the Transfers menu.
          Choose &quot;Send&quot; and select &quot;Add From Contacts&quot; or
          enter the recipient’s email address or U.S. mobile phone number in the
          search bar (once you do, you’ll automatically be taken to the next
          step).
        </p>
        <p>
          To add a recipient using the online Account Center: select &quot;Send
          Money with Zelle<sup>®</sup>&quot; from the Transfers menu. Choose
          &quot;Send&quot; and enter your recipient’s email or U.S. mobile
          number in the search bar (once you do, you’ll automatically be taken
          to the next step).
        </p>
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_ADD_RECIPIENT_EXPAND_LNK",
  },
  {
    q: (
      <>
        Can I use <em>Zelle</em> to send money internationally?
      </>
    ),
    a: (
      <p>
        In order to use <em>Zelle</em>, the sender’s and recipient’s bank
        accounts must be based in the U.S.
      </p>
    ),
    t: "BANKAC_ZELLE_FAQ_SEND_INTERNATIONAL_EXPAND_LNK",
  },
  {
    q: (
      <>
        What types of payments can I make with <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          You can use <em>Zelle</em> to send money directly to almost any bank
          account in the U.S.
        </p>
        <p>
          <em>Zelle</em> is a great way to send money to family, friends, and
          people you are familiar with such as your personal trainer,
          babysitter, or neighbor<sup>1</sup>. Since money is typically sent in
          minutes<sup>2</sup> it’s important to only send money to people you
          trust, and always ensure you’ve used the correct email address or U.S.
          mobile number.
        </p>
        <p>
          Neither Discover nor <em>Zelle</em> offers a protection program for
          any authorized payments made with <em>Zelle</em> — for example, if you
          do not receive the item you paid for or the item is not as described
          or as you expected.
        </p>
        <p>
          You should not use <em>Zelle</em> to send money to anyone for tax
          payments, payments made pursuant to court orders (including
          court-ordered amounts for alimony or child support), fines, payments
          to loan sharks, gambling debts or payments otherwise prohibited by
          law, and you should not use <em>Zelle</em> to request money from
          anyone for any such payments.
        </p>
        <UsBankDisclaimer num={1} />
        <Disclaimer1 num={2} />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_PAYMENT_TYPES_EXPAND_LNK",
  },
  {
    q: (
      <>
        How do I view my <em>Zelle</em> activity?
      </>
    ),
    a: (
      <>
        <p>
          You can see incoming and outgoing <em>Zelle</em> payments (both
          pending and completed) on the <em>Zelle</em> activity page.
        </p>
        <p>
          Log into the online Account Center or mobile app and choose &quot;Send
          Money with Zelle<sup>®</sup>&quot; from the Transfers menu. From
          there, click on &quot;Activity&quot; to view your <em>Zelle</em>{" "}
          payments.
        </p>
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_VIEW_ACTIVITY_EXPAND_LNK",
  },
  {
    q: (
      <>
        Does Discover Bank have limits for sending or receiving <em>Zelle</em>{" "}
        payments?
      </>
    ),
    a: (
      <>
        <p>
          We do not limit how much money you can receive with <em>Zelle</em>.
        </p>
        <p>
          You may send a total of $600 per day using <em>Zelle</em>. We may
          change your send limit, from time to time, based on a variety of
          factors. If we change your transfer limit for sending money, we will
          let you know. Please review the Zelle<sup>®</sup> Person to Person
          Transfer Service User Agreement Addendum for more information.
        </p>
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_LIMITS_ON_PYMT_EXPAND_LNK",
  },
  {
    q: (
      <>
        Someone sent me money with <em>Zelle</em>, now what?
      </>
    ),
    a: (
      <>
        <p>
          If you have already enrolled with <em>Zelle</em>, you do not need to
          take any further action. The money will move directly into your bank
          account, typically within minutes<sup>1</sup>.
        </p>
        <p>
          <strong>
            If you have not yet enrolled with <em>Zelle</em>, follow these
            steps:
          </strong>
        </p>
        <ol>
          <li>
            Click on the link provided in the payment notification you received
            via email or text message.
          </li>
          <li>Select Discover Bank</li>
          <li>
            Follow the instructions provided on the page to enroll and receive
            your payment. Pay attention to the email address or U.S. mobile
            number where you received the payment notification—you should enroll
            with <em>Zelle</em> using that email address or U.S. mobile number
            to ensure you receive your money.
          </li>
        </ol>
        <Disclaimer1 />
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_SENT_MONEY_EXPAND_LNK",
  },
  {
    q: (
      <>
        Are there any fees for using <em>Zelle</em>?
      </>
    ),
    a: (
      <p>
        Discover Bank does not charge a fee for sending or receiving money with{" "}
        <em>Zelle</em>. Please note, your carrier's messaging and data charges
        may apply when using the mobile app. Contact your provider for more
        information.
      </p>
    ),
    t: "BANKAC_ZELLE_FAQ_FEES_EXPAND_LNK",
  },
  {
    q: (
      <>
        How long does it take to send and receive money with <em>Zelle</em>?
      </>
    ),
    a: (
      <>
        <p>
          Payments sent using <em>Zelle</em> are typically available in an
          enrolled recipient’s account within minutes.
        </p>
        <p>
          If you send money to someone who isn’t enrolled with <em>Zelle</em>,
          they will receive a notification prompting them to enroll. After
          enrollment, the money will move directly to your recipient’s account.
        </p>
        <p>
          If your payment is pending, we recommend confirming that the person
          you sent money to has enrolled with <em>Zelle</em> and that you
          entered the correct email address or U.S. mobile phone number. If the
          person has not yet enrolled with <em>Zelle</em>, they have 14 days to
          enroll, or your payment will be cancelled.
        </p>
        <p>
          If you’re enrolled and waiting to receive money, you should check to
          see if you’ve received a payment notification via email. If you
          haven’t received a payment notification, we recommend following up
          with the sender to confirm they entered the correct email address or
          U.S. mobile phone number.
        </p>
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_HOW_LONG_EXPAND_LNK",
  },
  {
    q: (
      <>
        Can I use <em>Zelle</em> at Discover Bank if I already use{" "}
        <em>Zelle</em> at another bank?
      </>
    ),
    a: (
      <p>
        If you enrolled with <em>Zelle</em> using your email address or U.S.
        mobile number at one financial institution, you cannot enroll that same
        email address or U.S. mobile phone number at another institution. But
        you can transfer your email address or U.S. mobile phone number. During
        enrollment on the Discover mobile app or online Account Center, you'll
        see a prompt notifying you that the email address or U.S. mobile phone
        number is already enrolled at another institution. You'll be asked to
        confirm that you want to complete the transfer and then to verify your
        email address or U.S. mobile phone number.
      </p>
    ),
    t: "BANKAC_ZELLE_FAQ_OTHER_BANK_EXPAND_LNK",
  },
  {
    q: (
      <>
        What do I do if my recipient didn’t receive the money I sent with{" "}
        <em>Zelle</em>?
      </>
    ),
    a: (
      <p>
        If your recipient did not receive your payment, make sure they’ve
        enrolled their email address or U.S. mobile number with <em>Zelle</em>.
        If they are enrolled, verify that the email address or U.S. mobile
        number you used to send money to your recipient is associated with your
        recipient’s <em>Zelle</em> enrollment.
      </p>
    ),
    t: "BANKAC_ZELLE_FAQ_NOT_RECEIVED_EXPAND_LNK",
  },
  {
    q: "Can I cancel a payment?",
    a: (
      <>
        <p>You are not able to cancel a payment once you have sent it. </p>
        <p>
          If your recipient has not yet enrolled with <em>Zelle</em>, the
          payment will remain pending and the money will not move from your
          account. Once the recipient enrolls, the payment will be sent. If the
          recipient does not enroll within 14 days, the payment will expire.
        </p>
        <p>
          If the person you sent money to has already enrolled with{" "}
          <em>Zelle</em>, the money is sent directly to their bank account and
          cannot be canceled. This is why it’s important to only send money to
          people you trust, and always ensure you’ve used the correct email
          address or U.S. mobile number when sending money.
        </p>
      </>
    ),
    t: "BANKAC_ZELLE_FAQ_CANCEL_PAYMENT_EXPAND_LNK",
  },
];
