import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./DataTable.module.scss";

export default function Pagination({
  canNextPage,
  canPreviousPage,
  className,
  gotoPage,
  nextPage,
  pageCount,
  pageIndex,
  pageOptions,
  previousPage,
}) {
  return (
    <div className={cx(styles.pagination, className)}>
      <button
        aria-label="Go to previous page"
        disabled={!canPreviousPage}
        onClick={() => previousPage()}
      >
        {"<"}
      </button>{" "}
      <button
        aria-label="Go to next page"
        disabled={!canNextPage}
        onClick={() => nextPage()}
      >
        {">"}
      </button>{" "}
      <span>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{" "}
      </span>
    </div>
  );
}

Pagination.defaultProps = {
  canNextPage: false,
  canPreviousPage: false,
  pageCount: 1,
  pageIndex: 0,
};

Pagination.propTypes = {
  canNextPage: PropTypes.bool,
  canPreviousPage: PropTypes.bool,
  className: PropTypes.string,
  gotoPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.array.isRequired,
  previousPage: PropTypes.func.isRequired,
};
