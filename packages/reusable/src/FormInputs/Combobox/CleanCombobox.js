import React from "react";
import Combobox from "./Combobox";
import styles from "./Combobox.module.scss";
import cx from "classnames";

const CleanCombobox = ({ ...props }) => {
  return (
    <Combobox
      showLabel={false}
      required
      containerClassName={styles.clean}
      menuClassName={styles.clean}
      dropdownClassName={cx("meta-web-bold", styles.clean)}
      {...props}
    />
  );
};

export default CleanCombobox;
