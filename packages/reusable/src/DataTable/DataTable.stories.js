/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import cx from "classnames";
import AccountNumberMask from "../AccountNumberMask";
import { SERVER_DATA, DataTableWithState } from "./testUtils";
import Button from "../Button";
import DataTable from "./DataTable";
import FieldValue from "./FieldValue";
import LinksList from "./LinksList";
import PencilIcon from "../Icons/PencilIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import MailIcon from "../Icons/MailIcon";
import ElectronicIcon from "../Icons/ElectronicIcon";
import TextInput from "../FormInputs/TextInput";
import Combobox from "../FormInputs/Combobox";

import styles from "./DataTableStyles.module.scss";
import { BUTTON_TYPES } from "../Button";
import ButtonGroup from "../ButtonGroup";

const getDeliveryMethodIcon = (deliveryMethod) => {
  const deliveryMethodToIconMap = {
    "Check by Mail": <MailIcon />,
    Electronic: <ElectronicIcon />,
  };
  return deliveryMethodToIconMap[deliveryMethod] ? (
    deliveryMethodToIconMap[deliveryMethod]
  ) : (
    <ElectronicIcon />
  );
};

const Row = ({ data }) => {
  return (
    <div className="row">
      <div className="col-md-4">
        <FieldValue label="Name">{data.name}</FieldValue>
        <FieldValue label="Delivery Method">
          {data.deliveryMethod} {getDeliveryMethodIcon(data.deliveryMethod)}
        </FieldValue>
      </div>
      <div className="col-md-4">
        <FieldValue label="Nickname">{data.nickName}</FieldValue>
      </div>
      <div className="col-md-4">
        <FieldValue label="Account Number">
          <AccountNumberMask value={data.accountNumber} />
        </FieldValue>
      </div>
    </div>
  );
};

const NameCell = ({ cell }) => cell.value;

const DeliveryMethodCell = ({ cell }) => (
  <>
    {getDeliveryMethodIcon(cell.row.original.deliveryMethod)} {cell.value}
  </>
);

const OperationsCell = ({ cell }) => (
  <LinksList>
    <a aria-label="Edit" href="/">
      <PencilIcon />
    </a>
    <a aria-label="Delete" href="/">
      <DeleteIcon />
    </a>
    {cell.row.original.verified && <a href="/">Enroll in eBills</a>}
  </LinksList>
);

export default { title: "DataTable" };

export const defaultState = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: cx(styles.alignRight, styles.hiddenMobile),
      },
    ]}
    data={SERVER_DATA}
  />
);

export const withoutData = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={[]}
  />
);

export const withoutDataButWithHeaders = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={[]}
    showHeaderWhenEmptyRows
  />
);

export const withoutDataAndWithCustomNoDataText = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={[]}
    emptyRowsText="I'm a custom no data found text."
  />
);

export const withCustomStyles = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
        className: styles.bold,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        Header: "Operations",
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
        headerClassName: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
  />
);

export const withColumnOrdering = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
        order: 0,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: cx(styles.alignRight, styles.hiddenMobile),
        order: -1,
      },
    ]}
    data={SERVER_DATA}
  />
);

export const withHiddenColumns = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
        show: false,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: cx(styles.alignRight, styles.hiddenMobile),
        show: false,
      },
    ]}
    data={SERVER_DATA}
  />
);

export const withExpandableRows = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
  />
);

export const withOnlyOddRowsExpandable = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    isRowExpandableCallback={({ index, data, row }) => {
      // Only odd rows are expandable.
      return index % 2 === 0;
    }}
  />
);

export const withCustomExpanderAriaLabel = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    expanderAriaLabelCallback={({ isExpanded, original }) =>
      `${isExpanded ? "Collapse" : "Expand"} ${
        original.name
      } (${original.accountNumber.substr(-4)}) data`
    }
  />
);

export const withoutHeadings = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    hasHeader={false}
  />
);

export const withSortableHeadings = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
        headerClassName: styles.width33,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
        headerClassName: styles.width33,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
        headerClassName: styles.width33,
        showHeader: false,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    hasSorting
  />
);

export const withInitialSorts = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
        headerClassName: styles.width33,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
        headerClassName: styles.width33,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
        headerClassName: styles.width33,
        showHeader: false,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    hasSorting
    initialSortBy={[{ id: "name", desc: true }]}
  />
);

export const withInMemoryLoadMorePagination = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    hasLoadMorePagination
    hasSorting
    pageSize={5}
  />
);

export const withCustomLoadMoreText = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    hasLoadMorePagination
    loadMoreText="Click me to load more rows"
    pageSize={5}
  />
);

export const withInMemoryPagination = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    hasPagination
    hasSorting
    pageSize={5}
  />
);

export const withServerSideRegularPagination = () => (
  <DataTableWithState pageSize={5}>
    {({ data, fetchData, pageCount, loading, handleSort, pageSize }) => (
      <DataTable
        columns={[
          {
            Header: "Pay To",
            accessor: "name",
            Cell: NameCell,
          },
          {
            Header: "Delivery method",
            accessor: "deliveryMethod",
            Cell: DeliveryMethodCell,
          },
          {
            accessor: "operations",
            Cell: OperationsCell,
            className: styles.alignRight,
          },
        ]}
        data={data}
        expandableRow={Row}
        fetchData={fetchData}
        hasPagination
        hasSorting
        loading={loading}
        onSort={handleSort}
        pageCount={pageCount}
        pageSize={pageSize}
      />
    )}
  </DataTableWithState>
);

export const withLoadAllOrLessPagination = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: styles.alignRight,
      },
    ]}
    data={SERVER_DATA}
    expandableRow={Row}
    hasLoadAllOrLessPagination
    hasSorting
    loadLessText="View Less"
    loadMoreText="View All"
    pageSize={5}
  />
);

export const withSlicedData = () => (
  <DataTable
    columns={[
      {
        Header: "Pay To",
        accessor: "name",
        Cell: NameCell,
      },
      {
        Header: "Delivery method",
        accessor: "deliveryMethod",
        Cell: DeliveryMethodCell,
      },
      {
        accessor: "operations",
        Cell: OperationsCell,
        className: cx(styles.alignRight, styles.hiddenMobile),
      },
    ]}
    data={SERVER_DATA}
    pageSize={3}
  />
);

export const withFilters = () => {
  const DataTableWithFilters = () => {
    const [filterValues, setFilterValues] = useState({});

    function FilterForm({ values = {}, onSubmit }) {
      const [form, setForm] = useState(values);

      useEffect(() => {
        setForm(values);
      }, [values]);

      function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
      }

      function handleSubmit(e) {
        e.preventDefault();
        onSubmit(form);
      }

      function handleReset(e) {
        e.preventDefault();
        onSubmit({});
      }

      return (
        <form onSubmit={handleSubmit}>
          <TextInput
            id="name"
            label="By name (contains)"
            name="name"
            onChange={handleChange}
            value={form.name || ""}
          />

          <TextInput
            id="name"
            label="By acc number (starts with)"
            name="accountNumber"
            onChange={handleChange}
            value={form.accountNumber || ""}
          />

          <Combobox
            id="deliveryMethod"
            label="By delivery method (exact)"
            name="deliveryMethod"
            onChange={handleChange}
            options={[
              { value: "Check by Mail", label: "Check by mail" },
              { value: "Electronic", label: "Electronic payment" },
            ]}
            value={form.deliveryMethod}
          />

          <ButtonGroup>
            <Button type="submit">Filter</Button>
            <Button buttonStyle={BUTTON_TYPES.LINK} onClick={handleReset}>
              Reset
            </Button>
          </ButtonGroup>
        </form>
      );
    }

    return (
      <>
        <FilterForm onSubmit={setFilterValues} values={filterValues} />
        <DataTable
          columns={[
            {
              Header: "Pay To",
              accessor: "name",
              Cell: NameCell,
              // Sets the filter type for the column.
              filter: "contains",
            },
            {
              Header: "Account number",
              accessor: "accountNumber",
              // Sets the filter type for the column.
              filter: "startsWith",
            },
            {
              Header: "Delivery method",
              accessor: "deliveryMethod",
              Cell: DeliveryMethodCell,
              // Sets the filter type for the column.
              filter: "exact",
            },
          ]}
          data={SERVER_DATA}
          filterTypes={{
            // Adds a custom "startsWith filter"
            startsWith: (rows, id, filterValue) => {
              return rows.filter((row) => {
                const rowValue = row.values[id];
                return rowValue !== undefined
                  ? String(rowValue)
                      .toLowerCase()
                      .startsWith(String(filterValue).toLowerCase())
                  : true;
              });
            },
          }}
          filterValues={filterValues}
        />
      </>
    );
  };

  return <DataTableWithFilters />;
};

export const withTableCaptionCallback = () => {
  return (
    <DataTable
      columns={[
        {
          Header: "Pay To",
          accessor: "name",
          Cell: NameCell,
        },
        {
          Header: "Delivery method",
          accessor: "deliveryMethod",
          Cell: DeliveryMethodCell,
        },
        {
          accessor: "operations",
          Cell: OperationsCell,
          className: cx(styles.alignRight, styles.hiddenMobile),
        },
      ]}
      data={SERVER_DATA}
      caption={({ tableRows }) => `${tableRows.length} payment records`}
    />
  );
};
