import React from "react";
import PropTypes from "prop-types";
import styles from "./DefinitionList.module.scss";

/** Responsive definition list for displaying key/value pairs */
function DefinitionList({ items }) {
  return (
    <dl className={styles.root}>
      {items.map((i) => (
        <div className={i.divClass} key={i.label}>
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

DefinitionList.propTypes = {
  /** Array of label/value pairs to display in the <dl> 
  divClass is className to apply to the parent <div> that surrounds the key value pair */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      divClass: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
    })
  ),
};

export default DefinitionList;
