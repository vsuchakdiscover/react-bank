import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import styles from "./DataTable.module.scss";

export default function TableCell({ cell, divTable }) {
  const Td = !divTable ? "td" : "div";

  const { column } = cell;

  return (
    <Td
      {...cell.getCellProps({
        className: cx(column.className, styles.tableRowCell),
      })}
    >
      {cell.render("Cell")}
    </Td>
  );
}

TableCell.propTypes = {
  cell: PropTypes.object.isRequired,
  divTable: PropTypes.bool,
};
