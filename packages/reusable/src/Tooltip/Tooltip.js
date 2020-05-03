import React, { useRef } from "react";
import PropTypes from "prop-types";
import Component from "@reach/component-component";
import { DialogOverlay, DialogContent } from "./tooltipBase";
import Button, { BUTTON_TYPES } from "../Button";

import styles from "./Tooltip.module.scss";

const Pointer = React.forwardRef((props, ref) => {
  Pointer.displayName = "Pointer";
  return <span {...props} className={styles["tooltip__pointer"]} ref={ref} />;
});

// Used for display in React dev tools
Pointer.displayName = "Pointer";

const Tooltip = ({
  adobeEvent,
  ariaLabel,
  buttonStyle,
  trigger,
  closeXCopy,
  width,
  ...props
}) => {
  const area = useRef(null);
  const pointer = useRef(null);
  const point = useRef(null);
  let lastclicked = "";

  /*const getAdjustment = () => {
    if (window.innerWidth > Number(boundaryWidth)) {
      return (window.innerWidth - boundaryWidth) / 2;
    } else {
      return 0;
    }
  };*/

  const getInnerWidth = () => {
    return window.innerWidth - 30 < Number(width)
      ? window.innerWidth - 30
      : width;
  };

  const getLeft = (tooltipWidth) => {
    if (
      //overflows on the right
      window.innerWidth <
      pointer.current.getBoundingClientRect().left + tooltipWidth / 2
    ) {
      return "auto";
    } else if (
      //overflows on the left
      pointer.current.getBoundingClientRect().left <
      tooltipWidth / 2
    ) {
      return 0;
    } else {
      return pointer.current.getBoundingClientRect().left - tooltipWidth / 2;
    }
  };

  //keep it simple, dont need to rerender, just update the position, could use popper but why?
  const findPosition = () => {
    if (!pointer.current) {
      return false;
    }
    //const adjustment = getAdjustment();
    const innerWidth = getInnerWidth();
    let left = getLeft(innerWidth);
    /*if (left < adjustment) {
      left = left + (adjustment - left);
    }*/
    return {
      left: left,
      right: left === "auto" ? 0 : "auto",
      top:
        pointer.current.getBoundingClientRect().top + 45 + window.pageYOffset,
    };
  };

  const checkWidth = () => {
    if (window.innerWidth - 30 < Number(width)) {
      return "calc(100% - 30px)";
    } else {
      return width + "px";
    }
  };

  const resizePosition = () => {
    if (!area.current) {
      return false;
    }
    const position = findPosition();
    area.current.style.top = position.top + "px";
    area.current.style.left = position.left + "px";
    area.current.style.right = position.right + "px";
    area.current.style.width = checkWidth();
    setPointerPosition();
  };

  const findPointerPosition = () => {
    const tooltipWidth = getInnerWidth();
    //const adjustment = getAdjustment();
    let left = getLeft(tooltipWidth);
    /*if (left < adjustment) {
      left = left + (adjustment - left);
    }*/
    let right = "auto";
    if (left === "auto") {
      right =
        window.innerWidth - pointer.current.getBoundingClientRect().left - 17;
    } else if (left === 0) {
      left = pointer.current.getBoundingClientRect().left - 4;
    } else {
      left = tooltipWidth / 2 - 4;
      right = "auto";
    }

    return {
      left: left === "auto" ? "auto" : left + "px",
      top: "-12px",
      right: right,
    };
  };

  const setPointerPosition = () => {
    const position = findPointerPosition();
    point.current.style.top = position.top;
    point.current.style.left = position.left;
    point.current.style.right = position.right;
  };

  return (
    <Component initialState={{ showDialog: false }}>
      {({ state, setState }) => {
        const handleClickOutside = (event) => {
          if (area.current) {
            if (!area.current.contains(event.target)) {
              if (event.target !== lastclicked) {
                setState({ showDialog: false });
                document.removeEventListener("click", handleClickOutside, true);
                window.removeEventListener("resize", resizePosition);
              }
            }
          }
        };
        return (
          <>
            <Button
              adobeEvent={adobeEvent}
              buttonStyle={buttonStyle}
              onClick={(e) => {
                lastclicked = e.target;
                setState({ showDialog: !state.showDialog });
                if (!state.showDialog) {
                  document.addEventListener("click", handleClickOutside, true);
                  window.addEventListener("resize", resizePosition);
                } else {
                  document.removeEventListener(
                    "click",
                    handleClickOutside,
                    true
                  );
                  window.removeEventListener("resize", resizePosition);
                }
              }}
            >
              {trigger}
              <span className={styles.icon} ref={pointer} />
              {/*<InfoIcon className={styles.icon} ref={pointer} />*/}
            </Button>

            {state.showDialog && (
              <>
                <DialogOverlay
                  aria-label={ariaLabel}
                  className="tooltip"
                  isOpen={state.showDialog}
                  lastclicked={lastclicked}
                  ref={area}
                  style={{
                    top: findPosition().top,
                    left: findPosition().left,
                    right: findPosition().right,
                    width: checkWidth(),
                  }}
                >
                  <Pointer
                    ref={point}
                    style={{
                      top: findPointerPosition().top,
                      left: findPointerPosition().left,
                      right: findPointerPosition().right,
                    }}
                  />

                  <DialogContent>
                    <Button
                      aria-label={closeXCopy}
                      buttonStyle={BUTTON_TYPES.CLOSEX}
                      className={styles.closeButton}
                      onClick={() => {
                        setState({ showDialog: false });
                        document.removeEventListener(
                          "click",
                          handleClickOutside,
                          true
                        );
                        window.removeEventListener("resize", resizePosition);
                      }}
                    />
                    {props.children}
                  </DialogContent>
                </DialogOverlay>
              </>
            )}
          </>
        );
      }}
    </Component>
  );
};

Tooltip.defaultProps = {
  buttonStyle: BUTTON_TYPES.TOOLTIP,
  closeXCopy: "Close Modal",
  trigger: <span></span>,
  width: "300",
};

Tooltip.propTypes = {
  /** Event code sent to Adobe for tracking purposes on click */
  adobeEvent: PropTypes.string,

  /** Aria label applied to the overlay */
  ariaLabel: PropTypes.string,

  /** CSS Style to apply to the button */
  buttonStyle: PropTypes.string,

  /** Content to display within the tooltip */
  children: PropTypes.any.isRequired,

  /** Aria label applied to the modal close button */
  closeXCopy: PropTypes.string,

  /** Markup used for the trigger */
  trigger: PropTypes.element.isRequired,

  /** Tooltip width */
  width: PropTypes.string,
};

export default Tooltip;
