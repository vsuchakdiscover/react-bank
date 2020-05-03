import React from "react";
import PropTypes from "prop-types";
import Button, { BUTTON_TYPES } from "./Button";
import PrintIcon from "../Icons/PrintIcon";
import styles from "./PrintButton.module.scss";
import ReactToPrint from "react-to-print";
import cx from "classnames";

/** Print button that optionally automatically opens a print window containing the content passed via ref 
    The forwardRef is necessary to support passing a reference to the element to print to react-to-print
    If ref isn't provided, it's just a plain print button.
*/
const PrintButton = React.forwardRef((props, ref) => {
  function getButton() {
    return (
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        className={cx(styles.button, props.className)}
        onClick={props.onClick}
        style={{ fontSize: props.fontSize + "px" }}
      >
        {!props.hideIcon && <PrintIcon className={styles.icon} />}
        {props.label}
      </Button>
    );
  }

  return ref ? (
    <ReactToPrint
      content={() => ref.current}
      onAfterPrint={props.onAfterPrint}
      onBeforeGetContent={props.onBeforeGetContent}
      onBeforePrint={props.onBeforePrint}
      onPrintError={props.onPrintError}
      trigger={() => getButton()}
    />
  ) : (
    getButton()
  );
});

PrintButton.propTypes = {
  /** Classname to apply to the Button */
  className: PropTypes.string,

  /** Shows/Hides the Print Icon */
  hideIcon: PropTypes.bool,

  /** Print Button label */
  label: PropTypes.string,

  /** Callback function that triggers after print */
  onAfterPrint: PropTypes.func,

  /** Callback function that triggers before the library gathers the page's content. Either returns void or a Promise. This can be used to change the content on the page before printing. */
  onBeforeGetContent: PropTypes.func,

  /** Callback function that triggers before print. Either returns void or a Promise. Note: this function is run immediately prior to printing, but after the page's content has been gathered. To modify content before printing, use onBeforeGetContent instead. */
  onBeforePrint: PropTypes.func,

  /** Function to call when the button is clicked */
  onClick: PropTypes.func,

  /** Callback function that will be called if there is a printing error serious enough that printing cannot continue. Currently limited to Promise rejections in onBeforeGetContent or onBeforePrint. Use this to attempt to print again. errorLocation will tell you in which callback the Promise was rejected. */
  onPrintError: PropTypes.func,

  /** Font size */
  fontSize: PropTypes.number,
};

PrintButton.defaultProps = {
  label: "Print",
  hideIcon: false,
  fontSize: 15,
};

PrintButton.displayName = "PrintButton";

export default PrintButton;
