import React from "react";
import PropTypes from "prop-types";
import TechDiff from "./components/TechDiff";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Can also log the error to an error reporting service
  }

  render() {
    return this.state.hasError ? <TechDiff /> : this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ErrorBoundary;
