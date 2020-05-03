import React from "react";
import styles from "./Redirect.module.scss";

function Redirect(props) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={styles.root}>
        In prod this redirects to <a href={props.to}>{props.to}</a>
      </div>
    );
  }
  window.location = props.url;
}

export default Redirect;
