import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Button from "../Button";

import styles from "./DataTable.module.scss";

export default function LoadMorePagination({
  children,
  className,
  nextPage,
  canNextPage,
  adobeEvent,
}) {
  if (canNextPage) {
    return (
      <div
        className={cx(styles.pagination, styles.loadMoreContainer, className)}
      >
        <Button adobeEvent={adobeEvent} buttonStyle="link" onClick={nextPage}>
          {children}
          <span className="sr-only">loads more items</span>
        </Button>
      </div>
    );
  }
  return [];
}

LoadMorePagination.defaultProps = {
  canNextPage: false,
};

LoadMorePagination.propTypes = {
  canNextPage: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  nextPage: PropTypes.func.isRequired,
};
