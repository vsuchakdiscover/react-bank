import React from "react";
import PropTypes from "prop-types";
import Button, { BUTTON_TYPES } from "../Button";
import styles from "./DataTable.module.scss";

function LoadAllOrLessPagination({
  loadLess,
  loadLessText,
  loadMoreText,
  pageSize,
  rowCount,
  setLoadLess,
}) {
  // When dataset is smaller than page size,
  // we don't show the pager.
  if (!loadLess && rowCount <= pageSize) {
    return "";
  }

  return (
    <div className={styles.lessOrAllPagination}>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setLoadLess(!loadLess)}
      >
        {loadLess ? loadLessText : loadMoreText}
        <span className="sr-only">
          {loadLess ? "Loads fewer items" : "Loads more items"}
        </span>
      </Button>
    </div>
  );
}

LoadAllOrLessPagination.propTypes = {
  loadLess: PropTypes.bool.isRequired,
  loadLessText: PropTypes.string.isRequired,
  loadMoreText: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  setLoadLess: PropTypes.func.isRequired,
};

export default LoadAllOrLessPagination;
