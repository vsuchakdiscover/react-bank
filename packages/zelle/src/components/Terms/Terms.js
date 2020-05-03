import React, { useRef } from "react";
import cx from "classnames";
import styles from "./Terms.module.scss";
import TermsText from "./TermsText";
import PrintButton from "reusable/lib/PrintButton";
import ClickToExpand from "reusable/lib/ClickToExpand";

const Terms = () => {
  const componentRef = useRef();
  return (
    <ClickToExpand>
      <div className="d-flex align-items-start align-items-md-center justify-content-between">
        <h2 className={cx("meta-web-bold", styles.termsTitle)}>
          Zelle Terms & Conditions
        </h2>
        <PrintButton ref={componentRef} />
      </div>
      <TermsText ref={componentRef} />
    </ClickToExpand>
  );
};
export default Terms;
