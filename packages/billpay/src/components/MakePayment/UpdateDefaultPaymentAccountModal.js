import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "reusable/lib/Modal";
import Combobox from "reusable/lib/Combobox";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import ButtonGroup from "reusable/lib/ButtonGroup";
import { useLazyApi } from "reusable/lib/useApi";
import SpinnerWrapper from "reusable/lib/SpinnerWrapper";
import { accountsApi } from "../../api";
import ErrorOverlay from "../../components/reusable/ErrorOverlay";
import DebitCard from "../../images/icon-cashback-debit.png";
import MoneyMarketIcon from "reusable/lib/MoneyMarketIcon";
import styles from "./UpdateDefaultPaymentAccountModal.module.scss";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";
import { clickTrack } from "reusable/lib/tracking";

function UpdateDefaultPaymentAccountModal({
  dispatch,
  accounts,
  currentAccount,
  onClose,
}) {
  useTrackPageLoad("bankac/billpay/makePayments/managePreferredAcctOverlay");
  const [account, setAccount] = useState(currentAccount.id);
  const [
    showAlreadyDefaultPaymentAccountModal,
    setShowAlreadyDefaultPaymentAccountModal,
  ] = useState(false);
  const [settingPreferredFailed, setSettingPreferredFailed] = useState(false);
  const { loading, error, callApi: setPreferredAccount } = useLazyApi(
    accountsApi.setPreferred
  );

  async function handleSave(e) {
    e.preventDefault();
    clickTrack(
      "MAKE_BILL_PAYMENTS_MANAGE_PREFERRED_ACCT_OVERLAY_SAVE_CHANGES_BTN"
    );
    if (account === currentAccount.id) {
      return setShowAlreadyDefaultPaymentAccountModal(true);
    }

    const { data } = await setPreferredAccount(account);
    if (data.preferred) {
      dispatch(["saveDefaultPaymentAccount", account]);
      onClose();
    } else {
      setSettingPreferredFailed(true);
    }
  }

  return (
    <Modal
      aria-label="Manage your default payment account."
      onClose={onClose}
      blueCircleIconModal
      blueCircleIcon={
        currentAccount.type === "CHECKING" ? (
          <img height="40" src={DebitCard} alt="Bank Account Card" />
        ) : (
          <MoneyMarketIcon />
        )
      }
    >
      {showAlreadyDefaultPaymentAccountModal ? (
        <>
          <p className="overlayHeader text-center">
            This is already your default payment account
          </p>
          <p className="mb-30">
            If you want to update your default payment account, please choose a
            different account from the list.
          </p>
          <ButtonGroup>
            <Button
              onClick={() => setShowAlreadyDefaultPaymentAccountModal(false)}
            >
              Got It
            </Button>
            <ButtonGroup.Link>
              <Button onClick={onClose} buttonStyle={BUTTON_TYPES.LINK}>
                Cancel
              </Button>
            </ButtonGroup.Link>
          </ButtonGroup>
        </>
      ) : (
        <>
          {error || settingPreferredFailed ? (
            <ErrorOverlay onClose={onClose} />
          ) : (
            <SpinnerWrapper isLoading={loading}>
              <form onSubmit={handleSave}>
                <p className="overlayHeader text-center">
                  Manage your default payment account
                </p>
                <p className="text-center">
                  Please select the account you prefer to use for bill payments.
                </p>
                <Combobox
                  id="account"
                  name="account"
                  label="Default Payment Account"
                  onChange={({ target }) => setAccount(target.value)}
                  options={accounts}
                  showLabel={false}
                  value={currentAccount.id}
                  required
                  containerClassName={styles.centerDropdown}
                />

                <ButtonGroup className="mt-30">
                  <Button type="submit">Save Changes</Button>
                  <ButtonGroup.Link>
                    <Button
                      adobeEvent="MAKE_BILL_PAYMENTS_MANAGE_PREFERRED_ACCT_OVERLAY_CANCEL_LNK"
                      onClick={onClose}
                      aria-label="Close Overlay"
                      buttonStyle={BUTTON_TYPES.LINK}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup.Link>
                </ButtonGroup>
              </form>
            </SpinnerWrapper>
          )}
        </>
      )}
    </Modal>
  );
}

UpdateDefaultPaymentAccountModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  currentAccount: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateDefaultPaymentAccountModal;
