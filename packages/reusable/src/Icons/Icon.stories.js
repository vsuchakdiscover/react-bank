import React from "react";
import { styled } from "@storybook/theming";
import Calendar7Icon from "./Calendar7Icon";
import CalendarCheckIcon from "./CalendarCheckIcon";
import CalendarIcon from "./CalendarIcon";
import ChevronDownIcon from "./ChevronDownIcon";
import CreditCardIcon from "./CreditCardIcon";
import DeleteIcon from "./DeleteIcon";
import EBillIcon from "./EBillIcon";
import EBillLinkIcon from "./EBillLinkIcon";
import EBillThinIcon from "./EBillThinIcon";
import ElectronicIcon from "./ElectronicIcon";
import ErrorIcon from "./ErrorIcon";
import InfoIcon from "./InfoIcon";
import InfoOpenIcon from "./InfoOpenIcon";
import MailIcon from "./MailIcon";
import MinusIcon from "./MinusIcon";
import MobilePhoneIcon from "./MobilePhoneIcon";
import MoneyMarketIcon from "./MoneyMarketIcon";
import PencilIcon from "./PencilIcon";
import PlusIcon from "./PlusIcon";
import PlusIconCircle from "./PlusIconCircle";
import PrintIcon from "./PrintIcon";
import RevolvingIcon from "./RevolvingIcon";
import SuccessIcon from "./SuccessIcon";
import WarningIcon from "./WarningIcon";
import GrayCalendarIcon from "./GrayCalendarIcon";
import ArrowLeftIcon from "./ArrowLeftIcon";
import ArrowRightIcon from "./ArrowRightIcon";
import H1 from "../Headers/H1";

const Meta = styled.div({
  color: "#333",
  fontSize: 16,
});

const Item = styled.div(
  {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    flex: "0 1 25%",
    boxSizing: "border-box",
    minWidth: 120,

    padding: "0px 7.5px 20px",

    "& svg": {
      marginRight: 10,
    },
  },
  ({ minimal }) =>
    minimal
      ? {
          flex: "none",
          minWidth: "auto",
          padding: 0,
          background: "#fff",
          border: "1px solid #666",

          "& svg": {
            display: "block",
            marginRight: 0,
            width: 48,
            height: 48,
          },
        }
      : {}
);

const List = styled.div({
  display: "flex",
  flexFlow: "row wrap",
});

export default { title: "Icons" };

export const singleIcon = () => <PencilIcon />;

export const allIcons = () => (
  <>
    <H1>All icons are displayed below at their default size.</H1>
    <p>
      <strong>NOTE:</strong> Some icons offer a size property with preset sizes
      for overriding the default size.
    </p>
    <List>
      <Item>
        <Calendar7Icon /> <Meta>Calendar7Icon</Meta>
      </Item>
      <Item>
        <CalendarCheckIcon /> <Meta>CalendarCheckIcon</Meta>
      </Item>
      <Item>
        <CalendarIcon /> <Meta>CalendarIcon</Meta>
      </Item>
      <Item>
        <ChevronDownIcon /> <Meta>ChevronDownIcon</Meta>
      </Item>
      <Item>
        <CreditCardIcon /> <Meta>CreditCardIcon</Meta>
      </Item>
      <Item>
        <DeleteIcon /> <Meta>DeleteIcon</Meta>
      </Item>
      <Item>
        <EBillIcon /> <Meta>EBillIcon</Meta>
      </Item>
      <Item>
        <EBillLinkIcon /> <Meta>EBillLinkIcon</Meta>
      </Item>
      <Item>
        <EBillThinIcon /> <Meta>EBillThinIcon</Meta>
      </Item>
      <Item>
        <ElectronicIcon /> <Meta>ElectronicIcon</Meta>
      </Item>
      <Item>
        <ErrorIcon /> <Meta>ErrorIcon</Meta>
      </Item>
      <Item>
        <InfoIcon /> <Meta>InfoIcon</Meta>
      </Item>
      <Item>
        <InfoOpenIcon /> <Meta>InfoOpenIcon</Meta>
      </Item>
      <Item>
        <MailIcon /> <Meta>MailIcon</Meta>
      </Item>
      <Item>
        <MinusIcon /> <Meta>MinusIcon</Meta>
      </Item>
      <Item>
        <MobilePhoneIcon /> <Meta>MobilePhoneIcon</Meta>
      </Item>
      <Item>
        <MoneyMarketIcon /> <Meta>MoneyMarketIcon</Meta>
      </Item>
      <Item>
        <PencilIcon /> <Meta>PencilIcon</Meta>
      </Item>
      <Item>
        <PlusIcon /> <Meta>PlusIcon</Meta>
      </Item>
      <Item>
        <PlusIconCircle /> <Meta>PlusIconCircle</Meta>
      </Item>
      <Item>
        <PrintIcon /> <Meta>PrintIcon</Meta>
      </Item>
      <Item>
        <RevolvingIcon /> <Meta>RevolvingIcon</Meta>
      </Item>
      <Item>
        <SuccessIcon /> <Meta>SuccessIcon</Meta>
      </Item>
      <Item>
        <WarningIcon /> <Meta>WarningIcon</Meta>
      </Item>
      <Item>
        <GrayCalendarIcon /> <Meta>GrayCalendarIcon</Meta>
      </Item>
      <Item>
        <ArrowLeftIcon /> <Meta>ArrowLeftIcon</Meta>
      </Item>
      <Item>
        <ArrowRightIcon /> <Meta>ArrowRightIcon</Meta>
      </Item>
    </List>
  </>
);
