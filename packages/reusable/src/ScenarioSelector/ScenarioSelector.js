/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Button from "../Button";
import styles from "./ScenarioSelector.module.scss";
import useLocalStorage from "../hooks/useLocalStorage";

// Handy way to change the currently selected scenario
// Like all scenario features, only runs in dev mode
export function setScenario(scenario, value) {
  if (process.env.NODE_ENV === "development") {
    localStorage.setItem(scenario, value);
  }
}

function ScenarioSelector({ children }) {
  const [expand, setExpand] = useLocalStorage("expand", "false");
  const [position] = useLocalStorage("position", "topLeft");

  const isOpen = expand === "true";

  async function resetDb() {
    // Although Discover apps typically use Axios, using fetch
    // here since this file is just a dev dependency. This avoids
    // adding Axios as a dependency on the reusable project.
    // This endpoint route is automatically configured in mockApiUtils.js
    try {
      await fetch(process.env.REACT_APP_API_BASE_URL + "/resetDb/", {
        method: "POST",
      });
    } catch (err) {
      console.err(err);
    }
  }

  return (
    <div className={cx(styles.container, styles[position])}>
      <a
        aria-label={(isOpen ? "Close" : "Open") + " Scenario Selector"}
        href="#"
        onClick={(event) => {
          event.preventDefault();
          setExpand(isOpen ? "false" : "true");
        }}
      >
        {isOpen ? "-" : "+"}
      </a>

      {isOpen && (
        <>
          <div>
            <Button onClick={resetDb}>Reset DB</Button>
          </div>
          {children}
        </>
      )}
    </div>
  );
}

ScenarioSelector.propTypes = {
  /** Content to display on the page */
  children: PropTypes.any.isRequired,
};

export default ScenarioSelector;
