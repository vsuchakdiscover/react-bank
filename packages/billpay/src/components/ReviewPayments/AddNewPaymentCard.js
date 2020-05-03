import React from "react";
import styles from "./AddNewPaymentCard.module.scss";
import PlusIcon from "reusable/lib/PlusIcon";
import SmartLink from "reusable/lib/SmartLink";

const AddNewPaymentCard = () => {
  return (
    <SmartLink
      adobeEvent="BillPay:ReviewPayments:Lnk:Make A Payment"
      to="/"
      className={styles.root}
    >
      <div className={styles.makePayment}>
        <div>
          <PlusIcon />
        </div>
        Make a Payment
      </div>
    </SmartLink>
  );
};

export default AddNewPaymentCard;
