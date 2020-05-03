import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Button, { BUTTON_TYPES } from "reusable/lib/Button";
import SelectTypeahead from "reusable/lib/SelectTypeahead";
import Spinner from "reusable/lib/Spinner";
import styles from "./ManagePayees.module.scss";
import cx from "classnames";
import matchSorter from "match-sorter";
import PayeesTable from "./PayeesTable";
import { enrollmentStatusApi } from "../../api/";
import { discoverCardsApi, merchantsApi } from "../../api";
import AddCardCallout from "../reusable/AddCardCallout";
import AddCardModal from "../reusable/AddCardModal";
import { DeletedPayeeContext } from "./PayeesContext";
import ErrorBoundary from "../../ErrorBoundary";
import useAlert from "../../hooks/useAlert";
import LastFourMask from "reusable/lib/LastFourMask";
import useTrackPageLoad from "reusable/lib/useTrackPageLoad";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  ADD_CARD_DIALOG: "addCardDialog",
};

function ManagePayees({ payees, setPayees }) {
  useTrackPageLoad("bankac/billpay/managepayees");
  const history = useHistory();
  const [merchants, setMerchants] = useState([]);
  const [status, setStatus] = useState();
  const [discoverCreditCards, setDiscoverCreditCards] = useState([]);
  const { showAlert } = useAlert();

  const TypeAhead = () => {
    const [merchant, setMerchant] = useState();
    const [itemsToShow, setItemsToShow] = useState([]);
    const [items, setItems] = useState([]);

    // Transform merchant data
    useEffect(() => {
      setItems(
        merchants
          .map((m) => {
            return m.names.map((name) => ({
              id: m.id,
              name: name,
              zipRequired: m.zipRequired,
            }));
          })
          .reduce((acc, currValue) => {
            return acc.concat(currValue);
          }, [])
      );
    }, []);

    // Use input value to find matches
    const getItemsToShow = (value) => {
      return value
        ? matchSorter(items, value, {
            threshold: matchSorter.rankings.CONTAINS,
            keys: ["name"],
          })
        : items;
    };

    const itemToString = (item) => (item ? item.name : "");

    const handleChange = (item) => {
      //Set Merchant state to selected item
      setMerchant(item);
      history.push("/add-payee", { ...item });
    };

    const handleStateChange = (changes, downshiftState) => {
      if (changes.hasOwnProperty("inputValue")) {
        setItemsToShow(getItemsToShow(downshiftState.inputValue));
      }
    };

    return (
      <div className="d-flex flex-wrap">
        <div className={cx(styles.roundedBox)}>
          <SelectTypeahead
            onChange={handleChange}
            onStateChange={handleStateChange}
            labelClassName={cx(styles.labelOverride, "meta-web-bold")}
            selectWrapperClassName={styles.selectWrapperOverride}
            inputPlaceholder="Enter Company or Business Name"
            itemToString={itemToString}
            items={itemsToShow}
            labelPlaceholder="Add a Payee"
            minInputLength={2}
            notFoundText={
              <span className={styles.noTransform}>Payee not found</span>
            }
            value={merchant}
          />
        </div>
        <div className={cx(styles.roundedBox)}>
          <label
            className={cx(styles.labelOverride, "meta-web-bold")}
            required
            htmlFor="enterPayeeManually"
          >
            Add a Person or Business to Pay
          </label>
          <Button
            adobeEvent="MANAGE_PAYEE_ENTER_PAYEE_INFO_MANUALLY_BTN"
            id="enterPayeeManually"
            className={styles.enterPayeeBtn}
            buttonStyle={BUTTON_TYPES.GHOST}
            onClick={() => {
              history.push({
                pathname: "/add-payee",
                state: "",
              });
            }}
          >
            Enter Payee Details
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    async function init() {
      setStatus(STATUS.LOADING);
      try {
        const { data: status } = await enrollmentStatusApi.getStatus();
        if (
          !status.eligible ||
          !status.enrolledInDFS ||
          !status.enrolledInFIS ||
          !status.fundsAvailable
        ) {
          history.push("/"); // Since unenrolled, redirect to Make a Payment page which handles unenrolled cases.
        } else {
          getData(status);
        }
      } catch (err) {
        console.error(err);
        history.push("/tech-diff");
      }
    }

    async function getData(status) {
      try {
        const { data: merchants } = await merchantsApi.getMerchants();
        setPayees(status.payees);
        setMerchants(merchants);
        getCards();
      } catch (err) {
        console.error(err);
        history.push("/tech-diff");
      }
    }

    async function getCards() {
      try {
        const { data: cards } = await discoverCardsApi.getDiscoverCards();
        setDiscoverCreditCards(cards);
        setStatus(STATUS.IDLE);
      } catch {
        setStatus(STATUS.IDLE); //in this case we just don't show the cards banner, no need to tech diff
      }
    }

    init();
    // eslint-disable-next-line
  }, []); // just want to run this once on initial load, even though depending on history which mutates, so disabling eslint-check.

  if (status === STATUS.LOADING) return <Spinner />;

  const providerVal = {
    item: alert,
    deletePayeeFromState: (payeeId) => {
      setPayees(
        payees.filter((payee) => {
          return payee.id !== payeeId;
        })
      );
    },
  };

  return (
    <ErrorBoundary>
      <DeletedPayeeContext.Provider value={providerVal}>
        {status === STATUS.ADD_CARD_DIALOG && (
          <AddCardModal
            discoverCreditCards={discoverCreditCards}
            onClose={() => setStatus(STATUS.IDLE)}
            onSuccess={(resp) => {
              setPayees([...resp, ...payees]);
              const usedAccounts = resp.map((r) => r.accountNumber);
              setDiscoverCreditCards(
                discoverCreditCards.filter(
                  (d) => !usedAccounts.includes(d.accountNumber)
                )
              );
              showAlert(
                <p>
                  <b>
                    {resp.length > 1 ? (
                      "Your Discover Credit Cards have"
                    ) : (
                      <>
                        {resp[0].nickName}{" "}
                        <LastFourMask value={resp[0].accountNumber} /> has
                      </>
                    )}{" "}
                    been added.
                  </b>
                </p>
              );
            }}
            setDiscoverCreditCards={setDiscoverCreditCards}
          />
        )}
        {discoverCreditCards.length > 0 && (
          <AddCardCallout
            adobeEvent="MANAGE_PAYEE_CARD_ADD_NOW_BTN"
            className="mb-30"
            setShowAddCardDialog={() => setStatus(STATUS.ADD_CARD_DIALOG)}
          />
        )}
        <TypeAhead items={merchants} />
        <PayeesTable payees={payees} />
      </DeletedPayeeContext.Provider>
    </ErrorBoundary>
  );
}

ManagePayees.propTypes = {
  payees: PropTypes.array.isRequired,
  setPayees: PropTypes.func.isRequired,
};

export default ManagePayees;
