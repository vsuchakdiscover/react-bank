import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import ExpanderCell from "./ExpanderCell";
import TableCell from "./TableCell";

import styles from "./DataTable.module.scss";

export default function TableRow({
  adobeEventOnExpandRow,
  adobeEventOnCollapseRow,
  columnNumber,
  divTable,
  expandableRow,
  expandableRowClassName,
  expandedParentRowClassName,
  rowDetailAriaLabelCallback,
  expanderAriaLabelCallback,
  expanderCellClassName,
  isRowExpandableCallback,
  row,
  rowClassName,
}) {
  const Tr = !divTable ? "tr" : "div";
  const Td = !divTable ? "td" : "div";

  const tableHasExpandableRows = Boolean(expandableRow);

  // The row is expandable when a table has expandableRows enabled
  // and isRowExpandableCallback returns true.
  const isExpandableRow =
    tableHasExpandableRows && isRowExpandableCallback(row);

  return (
    <>
      <Tr
        {...row.getRowProps({
          className: cx(
            styles.tableRow,
            rowClassName,
            row.isExpanded && expandedParentRowClassName
          ),
        })}
      >
        {tableHasExpandableRows && (
          <ExpanderCell
            adobeEventOnExpandRow={adobeEventOnExpandRow}
            adobeEventOnCollapseRow={adobeEventOnCollapseRow}
            divTable={divTable}
            expanderAriaLabelCallback={expanderAriaLabelCallback}
            expanderCellClassName={expanderCellClassName}
            isHidden={!isExpandableRow}
            row={row}
          />
        )}
        {row.cells.map((cell) => {
          const { key } = cell.getCellProps();
          return <TableCell cell={cell} divTable={divTable} key={key} />;
        })}
      </Tr>

      {isExpandableRow && row.isExpanded && (
        <Tr aria-expanded="true" className={expandableRowClassName}>
          <Td className={styles.expandedRow} colSpan={columnNumber}>
            {/* Per https://www.w3.org/WAI/GL/wiki/Using_HTML5_section_element */}
            <section
              role="contentinfo"
              aria-label={
                rowDetailAriaLabelCallback && rowDetailAriaLabelCallback(row)
              }
            >
              {expandableRow({ data: row.original })}
            </section>
          </Td>
        </Tr>
      )}
    </>
  );
}

TableRow.defaultProps = {
  hasExpandableRows: false,
};

TableRow.propTypes = {
  adobeEventOnExpandRow: PropTypes.string,
  adobeEventOnCollapseRow: PropTypes.string,
  columnNumber: PropTypes.number.isRequired,
  divTable: PropTypes.bool,
  expandableRow: PropTypes.any,
  expandableRowClassName: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  expandedParentRowClassName: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  rowDetailAriaLabelCallback: PropTypes.func,
  expanderAriaLabelCallback: PropTypes.func,
  expanderCellClassName: PropTypes.string,
  isRowExpandableCallback: PropTypes.func,
  row: PropTypes.object.isRequired,
  rowClassName: PropTypes.string,
};
