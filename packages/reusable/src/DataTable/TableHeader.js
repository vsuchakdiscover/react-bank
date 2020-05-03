import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import styles from "./DataTable.module.scss";

export default function TableHeader({
  divTable,
  hasExpandableRows,
  headerGroups,
  hasSorting,
  onSort,
}) {
  const Thead = !divTable ? "thead" : "div";
  const Tr = !divTable ? "tr" : "div";
  const Th = !divTable ? "th" : "div";

  function getToggleProps(header) {
    const toggleProps = header.getSortByToggleProps();
    const callback = toggleProps.onClick;

    toggleProps.onClick = (...args) => {
      onSort();
      return callback(...args);
    };

    return toggleProps;
  }

  return (
    <Thead className={styles.thead}>
      {headerGroups.map((headerGroup) => (
        // eslint-disable-next-line react/jsx-key
        <Tr
          {...headerGroup.getHeaderGroupProps({ className: styles.headerRow })}
        >
          {hasExpandableRows && (
            <Th className={cx(styles.th, styles.expanderCell)}></Th>
          )}
          {headerGroup.headers.map((header) => {
            // The client doesn't wish title prop to be present on th tag.
            const { title, key, ...headerProps } = header.getHeaderProps(
              hasSorting && getToggleProps(header)
            );
            return (
              <Th
                {...{
                  ...headerProps,
                  className: cx(
                    "meta-web-bold",
                    styles.th,
                    hasSorting && styles.sortableHeader,
                    header.headerClassName
                  ),
                }}
                key={key}
                scope="col"
              >
                {header.showHeader && (
                  <>
                    {header.render("Header")}
                    {hasSorting && (
                      <span
                        className={cx(styles.sortByArrows, {
                          [styles.descending]: header.isSortedDesc,
                          [styles.ascending]:
                            !header.isSortedDesc && header.isSorted,
                        })}
                      ></span>
                    )}
                  </>
                )}
              </Th>
            );
          })}
        </Tr>
      ))}
    </Thead>
  );
}

TableHeader.defaultProps = {
  hasSorting: false,
};

TableHeader.propTypes = {
  divTable: PropTypes.bool,

  /** Set to 'true' when table has expandable rows */
  hasExpandableRows: PropTypes.bool,

  /** Set to 'true' to enable sorting mode */
  hasSorting: PropTypes.bool,

  /** Headers data */
  headerGroups: PropTypes.array.isRequired,

  /** A function that's called when a header cell is clicked */
  onSort: PropTypes.func,
};
