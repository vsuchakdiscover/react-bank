import React from "react";
import PropTypes from "prop-types";

import FieldValue from "reusable/lib/FieldValue";
import dateUtils from "reusable/lib/dateUtils";
import ErrorIcon from "reusable/lib/ErrorIcon";
import { FAILED_STATUS_GROUP } from "../../utils/paymentStatuses";

import styles from "./DeliverByDateCell.module.scss";

function DeliverByDateCell({ cell }) {
  return (
    <FieldValue label="Deliver By" mobileOnlyLabel>
      {dateUtils.formatDateStringToMDY(cell.value)}
      {FAILED_STATUS_GROUP.includes(cell.row.original.status) && (
        <ErrorIcon className={styles.errorIcon} />
      )}
    </FieldValue>
  );
}

DeliverByDateCell.propTypes = {
  /** A react-table cell object */
  cell: PropTypes.object.isRequired,
};

export default DeliverByDateCell;
