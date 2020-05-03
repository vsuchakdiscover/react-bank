/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Button, { BUTTON_TYPES } from "../../Button";
import ConfirmModal from "./ConfirmModal";
import { text } from "@storybook/addon-knobs";
import styles from "../Modal.module.scss";

const Confirm = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        Commonly used Confirm Modal
      </Button>
      {showModal && (
        <ConfirmModal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          autoOpenModal={true}
          onCancelClick={() =>
            alert("Do something with the cancel button click")
          }
          onClose={() => setShowModal(false)}
          onConfirmClick={() =>
            alert("Do something with the confirm button click")
          }
        >
          <p className={styles.header}>Are you sure?</p>
          <p>Are you 100% sure?</p>
        </ConfirmModal>
      )}
    </>
  );
};

export default {
  title: "Modals/ConfirmModal",
  parameters: {
    info: {
      propTables: [ConfirmModal],
    },
  },
};

export const defaultExample = () => <Confirm />;
defaultExample.story = {
  parameters: {
    notes:
      "Use the Default Modal for single use modals that don't share dynamic content. If you find that you have more than a couple modals on the page it might make sense to use the dynamic modal set up instead, depending on the situation.",
  },
};
