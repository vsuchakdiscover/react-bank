import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./DataTable.module.scss";
import MinusIcon from "../Icons/MinusIcon";
import PlusIcon from "../Icons/PlusIcon";

function ExpanderCell({
  divTable,
  adobeEventOnExpandRow,
  adobeEventOnCollapseRow,
  expanderAriaLabelCallback,
  expanderCellClassName,
  isHidden,
  row,
}) {
  const Td = !divTable ? "td" : "div";
  return (
    <Td className={cx(styles.expanderCell, expanderCellClassName)}>
      {!isHidden && (
        <span
          {...row.getToggleRowExpandedProps({
            className: styles.expander,
            title: null,
          })}
        >
          <button
            data-track={
              row.isExpanded ? adobeEventOnCollapseRow : adobeEventOnExpandRow
            }
            aria-label={expanderAriaLabelCallback(row)}
            className={styles.expanderHandle}
          >
            {row.isExpanded ? <MinusIcon /> : <PlusIcon />}
          </button>
        </span>
      )}
    </Td>
  );
}

ExpanderCell.defaultProps = {
  expanderAriaLabelCallback: ({ isExpanded }) =>
    `${isExpanded ? "Collapse" : "Expand"} row`,
  isHidden: false,
};

ExpanderCell.propTypes = {
  adobeEventOnCollapseRow: PropTypes.string,
  adobeEventOnExpandRow: PropTypes.string,
  divTable: PropTypes.bool,
  expanderAriaLabelCallback: PropTypes.func,
  expanderCellClassName: PropTypes.string,
  isHidden: PropTypes.bool,
  row: PropTypes.object.isRequired,
};

export default ExpanderCell;
