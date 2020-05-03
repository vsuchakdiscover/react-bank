import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// NOTE: If you add other imports below from react-table, you need to specify them in rollup.config.js in the commonjs.namedImports config.
import {
  useTable,
  usePagination,
  useExpanded,
  useFilters,
  useSortBy,
} from "react-table";

import useReactTablePrepareProps from "./hooks/useReactTablePrepareProps";

import Pagination from "./Pagination";
import LoadMorePagination from "./LoadMorePagination";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

import LoadAllOrLessPagination from "./LoadAllOrLessPagination";
import { alphanumericCaseInsensitive } from "./sortTypes";
import { columnType } from "./propTypes";

import styles from "./DataTable.module.scss";

export default function DataTable({
  adobeEventOnExpandRow,
  adobeEventOnCollapseRow,
  adobeEventOnLoadMore,
  caption,
  className,
  columns,
  data,
  divTable,
  emptyRowsText,
  expandableRow,
  expandableRowClassName,
  expandedParentRowClassName,
  expanderAriaLabelCallback,
  expanderCellClassName,
  fetchData,
  filterTypes,
  filterValues,
  hasLoadAllOrLessPagination,
  hasHeader,
  hasLoadMorePagination,
  hasPagination,
  hasSorting,
  initialSortBy,
  isRowExpandableCallback,
  loading,
  loadingText,
  loadLessText,
  loadMoreText,
  noResultsText,
  pageCount,
  pageSize,
  paginationClassName,
  rowClassName,
  rowDetailAriaLabelCallback,
  showHeaderWhenEmptyRows,
}) {
  const initialized = useRef(false);
  const rowsAreEmpty = !data.length && !loading;
  const showHeader = hasHeader && (!rowsAreEmpty || showHeaderWhenEmptyRows);
  const [loadLess, setLoadLess] = useState(false);

  // When pagination isn't enabled but pageSize is set, we only slice dataset by pageSize
  const sliceData =
    pageSize &&
    !hasLoadAllOrLessPagination &&
    !hasPagination &&
    !hasLoadMorePagination;

  const Table = !divTable ? "table" : "div";
  const Tbody = !divTable ? "tbody" : "div";
  const Tr = !divTable ? "tr" : "div";
  const Td = !divTable ? "td" : "div";

  // Store page index internally.
  const [internalPageIndex, setInternalPageIndex] = useState(0);

  // Prepare data to be usable in react-table.
  const {
    preparedData,
    preparedColumns,
    preparedFetchData,
    preparedFilterTypes,
    preparedFilterValues,
  } = useReactTablePrepareProps({
    data,
    columns,
    fetchData,
    filterTypes,
    filterValues,
  });

  // Detect whether sorting and pagination are manual (i.e. provided by parent component).
  const [manualSorting, manualPagination] = isManualSortingAndPagination({
    hasPagination,
    hasLoadMorePagination,
    hasLoadAllOrLessPagination,
    hasSorting,
    preparedFetchData,
  });

  // Setup basic tableProps.
  const tableProps = {
    columns: preparedColumns,
    data: preparedData,
    initialState: {
      pageIndex: internalPageIndex,
      pageSize,
      sortBy: initialSortBy,
    },
    filterTypes: preparedFilterTypes,
    sortTypes: {
      ialphanumeric: alphanumericCaseInsensitive,
    },
    useControlledState: (state) => ({
      ...state,
      filters: preparedFilterValues,
      hiddenColumns: preparedColumns
        .filter((c) => c.show === false)
        .map((c) => c.id || c.accessor),
    }),
    manualPagination,
    manualSortBy: manualSorting,
    autoResetSortBy: false,
  };

  // For manual pagination, pageCount should be provided by parent component.
  if (manualPagination) {
    tableProps.pageCount = pageCount;
  }

  // Initialize a table and get props and callbacks.
  const {
    canNextPage,
    canPreviousPage,
    allColumns,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    prepareRow,
    previousPage,
    rows,
    state: { pageIndex, sortBy },
  } = useTable(tableProps, useFilters, useSortBy, useExpanded, usePagination);

  const visibleColumnsCount =
    allColumns.filter((c) => c.show).length + (expandableRow ? 1 : 0);

  // When "load more" pagination mode is set,
  // we want to append new rows to previously loaded rows.
  const tableRows =
    hasLoadMorePagination ||
    (hasLoadAllOrLessPagination && !loadLess) ||
    sliceData
      ? [...rows.slice(0, pageSize * pageIndex + pageSize)]
      : hasPagination
      ? page
      : rows;

  const filteredRowsAreEmpty =
    filterValues &&
    typeof filterValues === "object" &&
    Object.keys(filterValues).length &&
    !tableRows.length &&
    !loading;

  // Listen for changes in pagination and use the state to fetch our new data.
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    preparedFetchData && preparedFetchData({ pageIndex, pageSize, sortBy });
  }, [preparedFetchData, pageIndex, pageSize, sortBy]);

  // Update internal page index to table page index.
  useEffect(() => {
    setInternalPageIndex(pageIndex);
  }, [pageIndex, setInternalPageIndex]);

  return (
    <>
      <Table
        {...getTableProps()}
        className={cx(
          styles.root,
          className,
          !!expandableRow && !divTable && styles.tableWithExpandableRows
        )}
      >
        {caption && (
          <caption className="sr-only">
            {typeof caption === "function" ? caption({ tableRows }) : caption}
          </caption>
        )}
        {showHeader && (
          <TableHeader
            divTable={divTable}
            hasExpandableRows={!!expandableRow}
            hasSorting={hasSorting}
            headerGroups={headerGroups}
            onSort={() => gotoPage(0)}
          />
        )}
        <Tbody>
          {tableRows.length > 0 &&
            tableRows.map(
              (row) =>
                prepareRow(row) || (
                  <TableRow
                    adobeEventOnExpandRow={adobeEventOnExpandRow}
                    adobeEventOnCollapseRow={adobeEventOnCollapseRow}
                    columnNumber={visibleColumnsCount}
                    divTable={divTable}
                    expandableRow={expandableRow}
                    expandableRowClassName={
                      typeof expandableRowClassName === "function"
                        ? expandableRowClassName(row)
                        : expandableRowClassName
                    }
                    expandedParentRowClassName={
                      typeof expandedParentRowClassName === "function"
                        ? expandedParentRowClassName(row)
                        : expandedParentRowClassName
                    }
                    rowDetailAriaLabelCallback={rowDetailAriaLabelCallback}
                    expanderAriaLabelCallback={expanderAriaLabelCallback}
                    expanderCellClassName={expanderCellClassName}
                    isRowExpandableCallback={isRowExpandableCallback}
                    key={row.getRowProps().key}
                    row={row}
                    rowClassName={
                      typeof rowClassName === "function"
                        ? rowClassName(row)
                        : rowClassName
                    }
                  />
                )
            )}

          {(filteredRowsAreEmpty || rowsAreEmpty) && (
            <Tr
              className={cx(styles.tableRow, styles.noRecordsRow)}
              data-no-records-row
            >
              <Td
                className={styles.emptyRowsMessage}
                colSpan={visibleColumnsCount}
              >
                {filteredRowsAreEmpty ? noResultsText : emptyRowsText}
              </Td>
            </Tr>
          )}

          {loading ? (
            <Tr>
              <Td className={styles.tableRowCell} colSpan={visibleColumnsCount}>
                {loadingText}
              </Td>
            </Tr>
          ) : null}
        </Tbody>
      </Table>

      {hasLoadAllOrLessPagination &&
        !hasLoadMorePagination &&
        !hasPagination && (
          <LoadAllOrLessPagination
            loadLess={loadLess}
            loadLessText={loadLessText}
            loadMoreText={loadMoreText}
            pageSize={pageSize}
            rowCount={rows.length}
            setLoadLess={setLoadLess}
          />
        )}

      {hasLoadMorePagination &&
        !hasLoadAllOrLessPagination &&
        !hasPagination &&
        !sliceData && (
          <LoadMorePagination
            canNextPage={canNextPage}
            className={paginationClassName}
            nextPage={nextPage}
            adobeEvent={adobeEventOnLoadMore}
          >
            {loadMoreText}
          </LoadMorePagination>
        )}

      {hasPagination &&
        !hasLoadAllOrLessPagination &&
        !hasLoadMorePagination &&
        !sliceData && (
          <Pagination
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            className={paginationClassName}
            gotoPage={gotoPage}
            nextPage={nextPage}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            previousPage={previousPage}
          />
        )}
    </>
  );
}

DataTable.defaultProps = {
  data: [],
  divTable: false,
  emptyRowsText: "No records.",
  filterTypes: {},
  filterValues: {},
  hasHeader: true,
  hasLoadAllOrLessPagination: false,
  hasLoadMorePagination: false,
  hasPagination: false,
  hasSorting: false,
  initialSortBy: [],
  isRowExpandableCallback: (row) => true,
  loadLessText: "View less",
  loadMoreText: "View more",
  loading: false,
  loadingText: "Loading...",
  noResultsText:
    "There are no records found. Please modify your filter criteria and try again.",
  showHeaderWhenEmptyRows: false,
};

DataTable.propTypes = {
  /** Adobe event to log when row is expanded */
  adobeEventOnExpandRow: PropTypes.string,

  /** Adobe event to log when row is collapsed */
  adobeEventOnCollapseRow: PropTypes.string,

  /** Adobe event to log when inner activity is paginated */
  adobeEventOnLoadMore: PropTypes.string,

  /** A string or a function that returns table caption. If a function, the function is passed the number of table rows. */
  caption: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /** A css class for table */
  className: PropTypes.string,

  /** Table columns.
   This array holds meta-data for each table column. See more in 		   DataTable/propTypes.js */
  columns: PropTypes.arrayOf(columnType).isRequired,

  /** An array with table data */
  data: PropTypes.array,

  /** If set to 'true' a table is constructed of divs instead of canonical table, tr, th and td tags */
  divTable: PropTypes.bool,

  /** Sets a custom text when table is empty */
  emptyRowsText: PropTypes.any,

  /** A component renders an expandable row. If set, expandable rows are shown in the table */
  expandableRow: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

  /** A css class name or a function that returns a css class name for an expandable row */
  expandableRowClassName: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),

  /** A css class name or a function that returns a css class name for an expanded parent row */
  expandedParentRowClassName: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),

  /**
   * A function that allows setting a custom aria-label for expander.
   * The function accepts a single argument:
   * - row - a full react-table row data object
   */
  expanderAriaLabelCallback: PropTypes.func,

  /** A css class name for expander toggle cell */
  expanderCellClassName: PropTypes.string,

  /** A fetchData callback. Use when a table needs to fetch paginated data from a remote server. */
  fetchData: PropTypes.func,

  /**
   * An object of custom filter types.
   * Allows overriding or adding additional filter types for columns to use.
   * If a column's filter type isn't found on this object, it will default to using the built-in filter types.
   *
   * Example:
   *
   * Adds a custom startsWith filter
   *
   * ```javascript
   * const filterTypes = {
   *   startsWith: (rows, id, filterValue) => {
   *     return rows.filter(row => {
   *       const rowValue = row.values[id]
   *       return rowValue !== undefined
   *         ? String(rowValue)
   *             .toLowerCase()
   *             .startsWith(String(filterValue).toLowerCase())
   *         : true
   *     })
   *   }
   * }
   * ```
   *
   * Also see the withFilters story for more details.
   * */
  filterTypes: PropTypes.object,

  /** An key:value object of filter values where key is field (accessor) name and value is filter value. */
  filterValues: PropTypes.object,

  /** If set to 'true', table displays "View more" / "View less" style pagination. If the option is combined with fetchData, then on pagination data is loaded from a remote server. */
  hasHeader: PropTypes.bool,

  /** If set to 'true', table displays a header. */
  hasLoadAllOrLessPagination: PropTypes.bool,

  /** If set to 'true', table displays "Load more" style pagination. If the option is combined with fetchData, then on pagination data is loaded from a remote server. */
  hasLoadMorePagination: PropTypes.bool,

  /** If set to 'true', table displays regular (previous/next) pagination. If the option is combined with fetchData, then on pagination data is loaded from a remote server. */
  hasPagination: PropTypes.bool,

  /** If set to 'true', table columns can be sorted when clicked on a header. If the option is combined with fetchData, then on pagination data is loaded from a remote server. */
  hasSorting: PropTypes.bool,

  /** Initial sort options */
  initialSortBy: PropTypes.arrayOf(
    PropTypes.shape({
      /** Column id or accessor name */
      id: PropTypes.string.isRequired,
      /** If set to 'true' sorting is in descendant order, if set to 'false' sorting in ascending order. */
      desc: PropTypes.bool.isRequired,
    })
  ),

  /**
   * A function that's run for every row and decides whether a row is expandable or not based on row data.
   * Returns a boolean and accepts a row data object.
   **/
  isRowExpandableCallback: PropTypes.func,

  /** Sets a custom label for load less pager */
  loadLessText: PropTypes.string,

  /** Sets a custom label for load more pager */
  loadMoreText: PropTypes.string,

  /** Sets table into loading more. Useful when fetchData callback fetches data from a remote server */
  loading: PropTypes.bool,

  /** Sets a custom loading message */
  loadingText: PropTypes.any,

  /** Sets a custom no filter results message */
  noResultsText: PropTypes.string,

  /** A remote server sort callback. Use it when table sorts are done remotely */
  onSort: PropTypes.func,

  /** Custom page count. Use it when fetchData callback is provided */
  pageCount: PropTypes.number,

  /** A default page size */
  pageSize: PropTypes.number,

  /** A css class name of the pagination container */
  paginationClassName: PropTypes.string,

  /** A css class name or a function that returns a css class name for a row */
  rowClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /**
   * A function that allows setting a custom aria-label for each expanded row.
   * The function accepts a single argument: - row - a full react-table row data object
   */
  rowDetailAriaLabelCallback: PropTypes.func,

  /** When set to 'true' show headers when the table doesn't have records */
  showHeaderWhenEmptyRows: PropTypes.bool,
};

const isManualSortingAndPagination = ({
  hasPagination,
  hasLoadMorePagination,
  hasLoadAllOrLessPagination,
  preparedFetchData,
  hasSorting,
}) => {
  const manualPagination =
    !!(hasPagination || hasLoadMorePagination || hasLoadAllOrLessPagination) &&
    !!preparedFetchData;
  const manualSorting = manualPagination || (hasSorting && !!preparedFetchData);
  return [manualSorting, manualPagination];
};
