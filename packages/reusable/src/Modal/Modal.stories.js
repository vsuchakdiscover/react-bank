/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Modal from "./Modal";
import Button, { BUTTON_TYPES } from "../Button";
import H3 from "../Headers/H3";
import { text } from "@storybook/addon-knobs";
import GrayCalendarIcon from "../Icons/GrayCalendarIcon";

var customHeaderStyles = {
  color: "red",
  fontFamily: "Meta Web Thin",
  fontSize: "30px",
};

const SimpleModal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        A Default Modal
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          onClose={() => setShowModal(false)}
        >
          <div className="meta-normal">
            <p className="overlayHeader">
              Header with className=&ldquo;overlayHeader&rdquo;.
            </p>
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

const Header = ({ header }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        A Modal with a header
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          header={header}
          onClose={() => setShowModal(false)}
        >
          <div className="meta-normal mt-15">
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

const MultipleTriggers = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        Trigger 1
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          onClose={() => setShowModal(false)}
        >
          <div className="meta-normal mt-25">
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
      <Button
        buttonStyle={BUTTON_TYPES.GHOST}
        onClick={() => setShowModal(true)}
      >
        Trigger 2
      </Button>
    </>
  );
};

const AutoOpenModal = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        A Default Modal
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          onClose={() => setShowModal(false)}
        >
          <div className="meta-normal mt-25">
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

const NoCloseBtnModal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        A Default Modal
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          onClose={() => setShowModal(false)}
          showCloseX={false}
        >
          <div className="meta-normal mt-25">
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

const NoDismissModal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        A Default Modal
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          noBodyDismiss={true}
          onClose={() => setShowModal(false)}
        >
          <div className="meta-normal mt-25">
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

const CustomCloseLabelModal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        A Default Modal
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Default Modal"
          )}
          closeXCopy={text("CloseX aria-label copy", "Custom close X text")}
          noBodyDismiss={true}
          onClose={() => setShowModal(false)}
        >
          <div className="meta-normal mt-25">
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

const BlueCircleIconModal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        buttonStyle={BUTTON_TYPES.LINK}
        onClick={() => setShowModal(true)}
      >
        Blue Circle Icon Modal
      </Button>
      {showModal && (
        <Modal
          aria-label={text(
            "Aria Label for Modal",
            "An example of a Fancy Modal"
          )}
          onClose={() => setShowModal(false)}
          blueCircleIconModal
          blueCircleIcon={<GrayCalendarIcon size={40} />}
        >
          <div className="meta-normal text-center">
            <p className="overlayHeader">I&rsquo;m a fancy modal.</p>
            <p>This content can be anything.</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default { title: "Modals/SimpleModals" };

export const defaultExample = () => <SimpleModal />;
defaultExample.story = {
  parameters: {
    notes:
      "Use the Default Modal for single use modals that don't share dynamic content. If you find that you have more than a couple modals on the page it might make sense to use the dynamic modal set up instead, depending on the situation.",
  },
};

export const withHeader = () => <Header header="Example Header" />;
withHeader.story = {
  parameters: {
    notes: "Use the header prop to set a styled header above the body.",
  },
};

export const withCustomJsxHeader = () => (
  <Header header={<H3 style={customHeaderStyles}>Example header</H3>} />
);
withCustomJsxHeader.story = {
  name: "With Custom JSX Header",
  parameters: {
    notes: "Use the header prop to set a styled header above the body.",
  },
};

export const autoOpen = () => <AutoOpenModal />;
autoOpen.story = {
  parameters: {
    notes: "Default Simple Modal with autoOpen={true}",
  },
};

export const noBodyDismiss = () => <NoDismissModal />;
noBodyDismiss.story = {
  parameters: {
    notes:
      "Default Simple Modal with noBodyDismiss attribute. The modal will not close when clicking outside of it.",
  },
};

export const noCloseButton = () => <NoCloseBtnModal />;
noCloseButton.story = {
  parameters: {
    notes: "Simple Modal with no close 'X' button.",
  },
};

export const multipleTriggers = () => <MultipleTriggers />;
multipleTriggers.story = {
  parameters: {
    notes: "Use multiple triggers to open the same modal.",
  },
};

export const customCloseLabel = () => <CustomCloseLabelModal />;
customCloseLabel.story = {
  parameters: {
    notes:
      "Default Simple Modal with custom CloseX aria label copy. Not commonly used.",
  },
};

export const blueCicleIconModal = () => <BlueCircleIconModal />;
customCloseLabel.story = {
  parameters: {
    notes: "BillPay Style 'Fancy' Modal with Blue horizontal header and icon",
  },
};
