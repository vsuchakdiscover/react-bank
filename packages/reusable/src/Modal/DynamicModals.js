import React from "react";
import { PropTypes } from "prop-types";
import Component from "@reach/component-component";
import { Dialog } from "@reach/dialog";
import Button, { BUTTON_TYPES } from "../Button";
import styles from "./Modal.module.scss";

const DialogOne = (props) => (
  <div className="meta-normal mt-25">
    <p>This is Dialog One.</p>
    <p>I&apos;m feeling {props.emotion}.</p>
  </div>
);

DialogOne.propTypes = {
  /** string variable for example */
  emotion: PropTypes.string.isRequired,
};

const DialogTwo = (props) => (
  <div className="meta-normal mt-25">
    <p>This is Dialog Two.</p>
    <p>I&apos;m feeling {props.emotion}.</p>
  </div>
);

DialogTwo.propTypes = {
  /** string variable for example */
  emotion: PropTypes.string.isRequired,
};

const MultipleModals = () => {
  return (
    <Component initialState={{ showDialog: false }}>
      {({ state, setState }) => (
        <>
          <div className="row">
            <div className="col-12">
              <Button
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={() =>
                  setState({
                    showDialog: true,
                    dialogContent: <DialogOne emotion="happy" />,
                    ariaLabel: "This is dialog one",
                  })
                }
              >
                Show Happy Dialog 1
              </Button>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="col-12">
              <Button
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={() =>
                  setState({
                    showDialog: true,
                    dialogContent: <DialogTwo emotion="annoyed" />,
                    ariaLabel: "This is dialog two",
                  })
                }
              >
                Show Annoyed Dialog 2
              </Button>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="col-12">
              <Button
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={() =>
                  setState({
                    showDialog: true,
                    dialogContent: <DialogOne emotion="sleepy" />,
                    ariaLabel: "This is dialog one",
                  })
                }
              >
                Show Sleepy Dialog 1
              </Button>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="col-12">
              <Button
                buttonStyle={BUTTON_TYPES.LINK}
                onClick={() =>
                  setState({
                    showDialog: true,
                    dialogContent: <DialogTwo emotion="itchy" />,
                    ariaLabel: "This is dialog two",
                  })
                }
              >
                Show Itchy Dialog 2
              </Button>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          {state.showDialog && (
            <Dialog
              aria-label={state.ariaLabel}
              onDismiss={() => {
                setState({ showDialog: false });
              }}
            >
              <Button
                aria-label="Close Modal"
                buttonStyle={BUTTON_TYPES.CLOSEX}
                className={styles["close-modal"]}
                onClick={() => setState({ showDialog: false })}
              />
              {state.dialogContent}
            </Dialog>
          )}
        </>
      )}
    </Component>
  );
};

export default MultipleModals;
