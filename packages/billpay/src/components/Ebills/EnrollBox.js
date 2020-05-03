import React, { useState, useEffect } from "react";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import { nickNameWithLastFour } from "reusable/lib/formattingUtils";
import ReadOnlyInput from "reusable/lib/ReadOnlyInput";
import styles from "./EnrollBox.module.scss";
import Combobox from "reusable/lib/Combobox";
import PropTypes from "prop-types";
import { clickTrack } from "reusable/lib/tracking";

const EnrollBox = ({ eligiblePayees }) => {
  const history = useHistory();
  const [enrollPayee, setEnrollPayee] = useState(null);
  const eligiblePayeeOptions = eligiblePayees.map((payee) => ({
    label: nickNameWithLastFour(payee),
    value: payee.id,
  }));

  useEffect(() => {
    if (eligiblePayees.length !== 0) {
      setEnrollPayee(eligiblePayees[0].id);
    }
  }, [eligiblePayees]);

  const onChange = (e) => {
    setEnrollPayee(e.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    clickTrack("MANAGE_EBILLS_ENROLL_NOW_LNK");
    history.push({
      pathname: "/manage-ebills/enroll",
      search: `?payeeId=${enrollPayee}`,
    });
  }

  return (
    <>
      <p className="mb-20">
        Sign up to have payee statements electronically delivered right to
        Discover and manage your bills in one place.
      </p>
      <div className="d-flex flex-wrap" data-testid="enrollBox">
        {eligiblePayees.length > 0 ? (
          <>
            <div className={cx(styles.roundedBox)}>
              <form onSubmit={handleSubmit}>
                <label
                  className={cx(
                    styles.labelOverride,
                    "meta-web-bold mb-0 text-center"
                  )}
                  required
                  htmlFor="enroll"
                >
                  Enroll Eligible Payees
                </label>

                <div
                  className={cx(
                    "d-lg-flex justify-content-between align-items-center",
                    styles.enrollBtnContainer,
                    {
                      [styles.flexColumn]: eligiblePayees.length === 1,
                    }
                  )}
                >
                  {eligiblePayees.length === 1 ? (
                    <ReadOnlyInput
                      label="Enroll Payee"
                      showLabel={false}
                      containerClass="mb-25 mt-25"
                      valueSpanClass={styles.readOnlySpan}
                      value={nickNameWithLastFour(eligiblePayees[0])}
                    />
                  ) : (
                    <Combobox
                      containerClassName={styles.eligiblePayeesCombobox}
                      id="enrollPayee"
                      label="Select an Eligible Payee"
                      aria-label="Select an Eligible Payee"
                      name="enrollPayee"
                      value={enrollPayee}
                      onChange={onChange}
                      required
                      options={eligiblePayeeOptions}
                    />
                  )}
                  <div>
                    <Button
                      type="submit"
                      id="enroll"
                      className={styles.enrollBtn}
                    >
                      Enroll
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            <div className={cx(styles.roundedBox)}>
              <label
                className={cx(
                  styles.labelOverride,
                  "meta-web-bold text-center"
                )}
                required
                htmlFor="managePayees"
              >
                Don&apos;t see a Payee?
              </label>
              <p className="text-center">
                Make sure they&apos;re eBill eligible and added to your list of
                Payees.{" "}
              </p>

              <Button
                adobeEvent="MANAGE_EBILLS_MANAGE_PAYEES_LNK"
                id="managePayees"
                className={styles.managePayeesBtn}
                buttonStyle={BUTTON_TYPES.GHOST}
                onClick={() => {
                  history.push({
                    pathname: "/manage-payees",
                    state: "",
                  });
                }}
              >
                Manage Payees
              </Button>
            </div>
          </>
        ) : (
          <div className={cx(styles.roundedBox, styles.roundedBoxSingle)}>
            <div>
              <label
                className={cx(styles.labelOverride, "meta-web-bold")}
                required
                htmlFor="managePayees"
              >
                Don&apos;t see a Payee?
              </label>
              <p className="mb-0">
                Make sure they&apos;re eBill eligible and added to your list of
                payees.{" "}
              </p>
            </div>

            <div>
              <Button
                id="managePayees"
                className={styles.managePayeesBtn}
                buttonStyle={BUTTON_TYPES.GHOST}
                onClick={() => {
                  history.push({
                    pathname: "/manage-payees",
                    state: "",
                  });
                }}
              >
                Manage Payees
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

EnrollBox.propTypes = {
  eligiblePayees: PropTypes.array.isRequired,
};

export default EnrollBox;
