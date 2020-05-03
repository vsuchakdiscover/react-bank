import React from "react";
import ScheduledPaymentCard from "./ScheduledPaymentCard";
import { text } from "@storybook/addon-knobs";

export default { title: "Cards/Scheduled Payment Card" };

export const defaultExample = () => (
  <ul className="reset">
    <li>
      <ScheduledPaymentCard
        amount={text("amount", "100.00")}
        date={text("date", "JULY 15")}
      >
        Electronic payment from{" "}
        <b className="meta-web-bold">Cashback Debit (1234)</b> will be delivered
        by <b className="meta-web-bold">07/31/2019</b>
      </ScheduledPaymentCard>
    </li>
    <li>
      <ScheduledPaymentCard amount="1,999,000,999.00" date="AUG 15">
        Next electronic monthly payment from{" "}
        <b className="meta-web-bold">Cashback Debit (1234)</b> will be delivered
        by <b className="meta-web-bold">08/15/2019</b>
      </ScheduledPaymentCard>
    </li>
  </ul>
);
