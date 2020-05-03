import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import FocusLock from "react-focus-lock";

import { ReactComponent as Close } from "../svgs/close.svg";

import styles from "./Overlay.module.scss";

export default function Overlay({
  ariaLabelledBy,
  className,
  children,
  onCloseClick,
}) {
  // Use this ref to access the DOM within the overlay.
  const ref = useRef();

  useEffect(() => {
    function handleClickAway(e) {
      // If clicked element is outside the overlay element (ref.current)
      // we close the overlay.
      if (ref.current && !ref.current.contains(e.target)) {
        onCloseClick(e);
      }
    }

    document.addEventListener("click", handleClickAway, true);
    return () => {
      document.removeEventListener("click", handleClickAway, true);
    };
  }, [onCloseClick]);

  return (
    <FocusLock>
      <div
        aria-labelledby={ariaLabelledBy}
        aria-modal="true"
        className={cx(styles.root, className)}
        role="dialog"
        ref={ref}
        tab-index={0}
      >
        <div className={styles.overlay}>
          {onCloseClick && (
            <div className={styles.header}>
              <button
                aria-label="Close"
                className={styles.close}
                onClick={onCloseClick}
              >
                <Close />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </FocusLock>
  );
}

Overlay.propTypes = {
  /** aria-labelledby attribute for the dialog */
  ariaLabelledBy: PropTypes.string,

  /** Dialog content */
  children: PropTypes.node,

  /** Dialog css class */
  className: PropTypes.string,

  /** A function that's called when close dialog button is clicked */
  onCloseClick: PropTypes.func,
};
