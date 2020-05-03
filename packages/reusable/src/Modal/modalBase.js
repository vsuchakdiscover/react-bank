/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";
import Component from "@reach/component-component";
import Portal from "@reach/portal";
import { checkStyles, wrapEvent, assignRef } from "@reach/utils";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";

//adpated from @reach dialog modal, see https://github.com/reach/reach-ui

let createAriaHider = (dialogNode) => {
  let originalValues = [];
  let rootNodes = [];

  Array.prototype.forEach.call(
    document.querySelectorAll("body > *"),
    (node) => {
      const portalNode = dialogNode.parentNode.parentNode.parentNode;
      if (node === portalNode) {
        return;
      }
      let attr = node.getAttribute("aria-hidden");
      let alreadyHidden = attr !== null && attr !== "false";
      if (alreadyHidden) {
        return;
      }
      originalValues.push(attr);
      rootNodes.push(node);
      node.setAttribute("aria-hidden", "true");
    }
  );

  return () => {
    rootNodes.forEach((node, index) => {
      let originalValue = originalValues[index];
      if (originalValue === null) {
        node.removeAttribute("aria-hidden");
      } else {
        node.setAttribute("aria-hidden", originalValue);
      }
    });
  };
};

let k = () => {};

let checkDialogStyles = () => checkStyles("dialog");

let portalDidMount = (refs) => {
  refs.disposeAriaHider = createAriaHider(refs.overlayNode);
};

let contentWillUnmount = ({ refs }) => {
  refs.disposeAriaHider();
};

let DialogOverlay = React.forwardRef(
  (
    {
      isOpen = true,
      onDismiss = k,
      initialFocusRef,
      onClick,
      onKeyDown,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <Component didMount={checkDialogStyles}>
        {isOpen ? (
          <Portal data-reach-dialog-wrapper>
            <Component
              didMount={({ refs }) => {
                portalDidMount(refs);
              }}
              refs={{ overlayNode: null }}
              willUnmount={contentWillUnmount}
            >
              {({ refs }) => (
                <FocusLock
                  onActivation={() => {
                    if (initialFocusRef) {
                      initialFocusRef.current.focus();
                    }
                  }}
                  onDeactivation={() => {
                    if (props.children.props.lastclicked) {
                      props.children.props.lastclicked.focus();
                    }
                  }}
                  returnFocus
                >
                  <RemoveScroll>
                    <div
                      data-reach-dialog-overlay
                      onClick={wrapEvent(onClick, (event) => {
                        event.stopPropagation();
                        onDismiss();
                      })}
                      onKeyDown={wrapEvent(onKeyDown, (event) => {
                        if (event.key === "Escape") {
                          event.stopPropagation();
                          onDismiss();
                        }
                      })}
                      ref={(node) => {
                        refs.overlayNode = node;
                        assignRef(forwardedRef, node);
                      }}
                      {...props}
                    />
                  </RemoveScroll>
                </FocusLock>
              )}
            </Component>
          </Portal>
        ) : null}
      </Component>
    );
  }
);

DialogOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  initialFocusRef: () => {},
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  onDismiss: PropTypes.func,
  onKeyDown: PropTypes.func,
};

let stopPropagation = (event) => event.stopPropagation();

let DialogContent = React.forwardRef(
  ({ onClick, onKeyDown, ...props }, forwardedRef) => (
    <div
      aria-modal="true"
      data-reach-dialog-content
      onClick={wrapEvent(onClick, stopPropagation)}
      ref={(node) => {
        assignRef(forwardedRef, node);
      }}
      tabIndex="-1"
      {...props}
    />
  )
);

DialogContent.propTypes = {
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

let Dialog = ({ isOpen, onDismiss = k, initialFocusRef, ...props }) => (
  <DialogOverlay
    className="modal"
    initialFocusRef={initialFocusRef}
    isOpen={isOpen}
    onDismiss={onDismiss}
  >
    <DialogContent {...props} />
  </DialogOverlay>
);

Dialog.propTypes = {
  /** Dialog is open when true */
  initialFocusRef: PropTypes.node,
  isOpen: PropTypes.bool,
  onDismiss: PropTypes.func,
};

export { DialogOverlay, DialogContent, Dialog };
