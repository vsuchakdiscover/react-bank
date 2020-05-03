import React from "react";
import PropTypes from "prop-types";
import { clickTrack } from "reusable/lib/tracking";

// Logs clicks for elements with:
// 1. An onClick handler
// 2. A data-track attribute (that contains the event to track)
// The clickTrack function logs clicks to Adobe.
// Approach inspired by https://stackoverflow.com/questions/59556495/how-to-run-common-code-before-all-onclick-handlers-in-a-react-app-to-work-arou
export default function LogClicks({ children }) {
  const onClick = (e) => {
    // Look for data-track attribute on the active element that was just clicked
    const event = e.nativeEvent?.currentTarget?.activeElement?.dataset?.track;
    if (event) clickTrack(event);
    // Now that event has been tracked, the child click handler will fire (this parent handler always fires first since it's global).
  };
  // onClickCapture is an event provided by React.
  return <div onClickCapture={onClick}>{children}</div>;
}

LogClicks.propTypes = {
  children: PropTypes.node.isRequired,
};
