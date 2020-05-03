import React from "react";
import PropTypes from "prop-types";
import Redirect from "./components/Redirect";
import URLS from "reusable/lib/urls";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) return <Redirect to={URLS.TECH_DIFF} />;
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ErrorBoundary;
