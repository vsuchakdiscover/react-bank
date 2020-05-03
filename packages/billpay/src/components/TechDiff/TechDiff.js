import React from "react";
import Headline from "reusable/lib/Headline";
import URLS from "reusable/lib/urls";
import styles from "./TechDiff.module.scss";

const TechDiff = (props) => (
  <div className={styles.root}>
    <Headline className="mb-20">Looks like something went wrong</Headline>
    <p>
      There was a problem processing your request. Please try again. If the
      problem persists, we recommend trying again later.
    </p>
    <a href={URLS.PORTAL_LOGIN}>Go to Account Center</a>
  </div>
);

export default TechDiff;
