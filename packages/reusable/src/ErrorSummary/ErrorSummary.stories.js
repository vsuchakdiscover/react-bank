import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorSummary from "./ErrorSummary";

const errors = {
  name: "Please enter a valid name.",
  nickName: "Please enter a valid nickname.",
};

const showErrorSummary = true;

const FocusExample = () => {
  const summaryRef = useRef(null);

  useEffect(() => {
    if (showErrorSummary) summaryRef.current.focus();
  }, []);

  return (
    showErrorSummary && (
      <Router>
        <ErrorSummary className="mt-25" errors={errors} ref={summaryRef} />
      </Router>
    )
  );
};

export const defaultExample = () => (
  <ErrorSummary className="mt-25" errors={errors} />
);

export const withFocusRef = () => <FocusExample />;

export default {
  title: "ErrorSummary",
  parameters: {
    info: {
      propTables: [ErrorSummary],
      components: [defaultExample],
    },
  },
};
