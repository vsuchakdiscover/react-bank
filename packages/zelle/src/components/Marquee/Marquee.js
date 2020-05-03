import React from "react";
import Headline from "reusable/lib/Headline";
import H2 from "reusable/lib/H2";
import { ReactComponent as ZelleLogo } from "./zelle-logo.svg";
import styles from "./Marquee.module.scss";

const Marquee = () => {
  return (
    <section className={styles.marquee}>
      <div className={styles.inner}>
        <div className={styles.copyContainer}>
          <ZelleLogo className={styles.zelleLogo} />
          <Headline type="h1" className={styles.header}>
            Move money your way with Zelle
            <sup className={styles.reg}>&reg;</sup>
          </Headline>
          <H2 className={styles.subheader}>
            Send or receive money a fast and easy way<sup>1</sup>.
          </H2>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
