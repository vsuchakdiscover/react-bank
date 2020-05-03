/* eslint-disable react/prop-types */
import React from "react";

import {
  cleanup,
  fireEvent,
  render,
  waitForDomChange,
} from "@testing-library/react";

import DataTable from "./DataTable";

import {
  DataTableWithState,
  TEST_DATA,
  TEST_COLUMNS,
  getColumnValue,
} from "./testUtils";

afterEach(cleanup);

describe("DataTable", () => {
  it("should render a table when columns and data provided", () => {
    const { getByText, getAllByText } = render(
      <DataTable columns={TEST_COLUMNS} data={TEST_DATA} />
    );

    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Id")).toBeTruthy();
    expect(getByText("Date")).toBeTruthy();
    expect(getAllByText("Tamika")).toBeTruthy();
    expect(getAllByText("1")).toBeTruthy();
    expect(getAllByText("2019-08-06")).toBeTruthy();
  });

  it("should render a caption when provided", () => {
    const captionText = "This is a test table";
    const { container } = render(
      <DataTable
        caption={captionText}
        columns={TEST_COLUMNS}
        data={TEST_DATA}
      />
    );

    const caption = container.querySelector("caption");

    expect(caption.textContent).toBe(captionText);
  });

  it("should render a table without a header when there are no records", () => {
    const { container } = render(
      <DataTable columns={TEST_COLUMNS} data={[]} />
    );

    expect(container.querySelector("thead")).toBeNull();
  });

  it("should render a table with a header when there are no records and showHeaderWhenEmptyRows prop is set to true", () => {
    const { container } = render(
      <DataTable columns={TEST_COLUMNS} data={[]} showHeaderWhenEmptyRows />
    );

    expect(container.querySelector("thead")).toBeTruthy();
  });

  it("should render expandable handle when expandableRow is set", () => {
    const { getAllByLabelText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        expandableRow={({ data }) => {
          return <h2>{data.rowContent}</h2>;
        }}
      />
    );

    expect(getAllByLabelText("Expand row")).toBeTruthy();
  });

  it("should show expandable rows when expander is clicked", () => {
    const { getByLabelText, container } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        expandableRow={({ data }) => {
          return <h2>{data.rowContent}</h2>;
        }}
        expanderAriaLabelCallback={({ isExpanded, index }) =>
          `${isExpanded ? "Collapse" : "Expand"} row ${index}`
        }
      />
    );

    // Ensure row is not expanded yet.
    expect(container.querySelector("tr[aria-expanded=true]")).toBeNull();

    // Click the first row.
    fireEvent.click(getByLabelText("Expand row 1"));

    expect(container.querySelector("tr[aria-expanded=true]")).toBeTruthy();
  });

  it("should add aria-controls which equals expandable row id to expander control when expandableRow is set", () => {
    const { getByLabelText, container } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        expandableRow={({ data }) => {
          return <h2>{data.rowContent}</h2>;
        }}
        expanderAriaLabelCallback={({ isExpanded, index }) =>
          `${isExpanded ? "Collapse" : "Expand"} row ${index}`
        }
      />
    );

    const expander = getByLabelText("Expand row 1");
    fireEvent.click(expander);

    expect(container.querySelector("tr[aria-expanded=true]")).toBeTruthy();
  });

  it("should show only the second row as expandable when a specific isRowExpandableCallback is provided", () => {
    const { getByLabelText, queryByLabelText } = render(
      <DataTable
        columns={[
          { Header: "name", accessor: "name" },
          { Header: "id", accessor: "id" },
        ]}
        data={[
          {
            name: "Row 1",
            id: "1",
          },
          {
            name: "Row 2",
            id: "2",
          },
          {
            name: "Row 3",
            id: "3",
          },
        ]}
        expandableRow={({ data }) => {
          return <h2>{data.rowContent}</h2>;
        }}
        expanderAriaLabelCallback={({ original }) => `Expand ${original.name}`}
        // Show only the second row as expandable.
        isRowExpandableCallback={({ index }) => index === 1}
      />
    );

    expect(queryByLabelText("Expand Row 1")).toBeNull();
    expect(getByLabelText("Expand Row 2")).toBeTruthy();
    expect(queryByLabelText("Expand Row 3")).toBeNull();
  });

  it("should render table without headings when hasHeader is set to 'false'", () => {
    const { getByText, queryByText } = render(
      <DataTable columns={TEST_COLUMNS} data={TEST_DATA} hasHeader={false} />
    );

    expect(queryByText("Name")).toBeNull();
    expect(queryByText("Id")).toBeNull();
    expect(queryByText("Date")).toBeNull();

    expect(getByText("Tamika")).toBeTruthy();
    expect(getByText("Annamarie")).toBeTruthy();
  });

  it("should sort table when clicked on sortable heading", () => {
    const { getByText, container } = render(
      <DataTable columns={TEST_COLUMNS} data={TEST_DATA} hasSorting />
    );

    // First sort is ascending.
    fireEvent.click(getByText("Name"));
    expect(getColumnValue(container)).toEqual([
      "Annamarie",
      "Olympia",
      "Tamika",
      "Tod",
      "Winston",
    ]);

    // Second sort is descending.
    fireEvent.click(getByText("Name"));
    expect(getColumnValue(container)).toEqual([
      "Winston",
      "Tod",
      "Tamika",
      "Olympia",
      "Annamarie",
    ]);

    // Third sort is initial order.
    fireEvent.click(getByText("Name"));
    expect(getColumnValue(container)).toEqual([
      "Tamika",
      "Annamarie",
      "Winston",
      "Tod",
      "Olympia",
    ]);
  });

  it.each`
    pageSize
    ${1}
    ${2}
    ${3}
    ${4}
    ${5}
  `(
    "should show $pageSize rows when pageSize is set to $pageSize",
    ({ pageSize }) => {
      const { container } = render(
        <DataTable
          columns={TEST_COLUMNS}
          data={TEST_DATA}
          hasLoadMorePagination
          pageSize={pageSize}
        />
      );

      expect(container.querySelectorAll("tbody tr").length).toBe(pageSize);
    }
  );

  it("should sort table when initialSortBy is provided", () => {
    const { container } = render(
      <DataTable
        columns={[
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Id",
            accessor: "id",
          },
        ]}
        data={[
          {
            name: "A name",
            id: "1",
          },
          {
            name: "C name",
            id: "3",
          },
          {
            name: "B name",
            id: "2",
          },
        ]}
        hasSorting
        initialSortBy={[{ id: "name", desc: true }]}
      />
    );

    expect(getColumnValue(container, 1)).toEqual([
      "C name",
      "B name",
      "A name",
    ]);
  });

  it("should perform sorts in a case-insensitive manner", () => {
    const { container } = render(
      <DataTable
        columns={[
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Id",
            accessor: "id",
          },
        ]}
        data={[
          {
            name: "A name",
            id: "1",
          },
          {
            name: "b name",
            id: "2",
          },
          {
            name: "c name",
            id: "3",
          },
          {
            name: "D name",
            id: "4",
          },
        ]}
        hasSorting
        initialSortBy={[{ id: "name", desc: false }]}
      />
    );

    expect(getColumnValue(container, 1)).toEqual([
      "A name",
      "b name",
      "c name",
      "D name",
    ]);
  });

  it("should append rows when load more is clicked", () => {
    const { container, getByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasLoadMorePagination
        pageSize={2}
      />
    );

    fireEvent.click(getByText("View more"));
    expect(container.querySelectorAll("tbody tr").length).toBe(4);

    fireEvent.click(getByText("View more"));
    expect(container.querySelectorAll("tbody tr").length).toBe(5);
  });

  it("should paginate next when pager is clicked", () => {
    const { container, getByText, getByLabelText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasPagination
        pageSize={2}
      />
    );

    fireEvent.click(getByLabelText("Go to next page"));

    expect(container.querySelectorAll("tbody tr").length).toBe(2);
    expect(getByText("Winston")).toBeTruthy();
    expect(getByText("Tod")).toBeTruthy();

    fireEvent.click(getByLabelText("Go to next page"));
    expect(container.querySelectorAll("tbody tr").length).toBe(1);
    expect(getByText("Olympia")).toBeTruthy();
  });

  it("should server-sider paginate next and previous when pager is clicked", async () => {
    const { container, getByText, getByLabelText } = render(
      <DataTableWithState pageSize={2} serverData={TEST_DATA}>
        {({ data, fetchData, pageCount, loading, pageSize }) => (
          <DataTable
            columns={TEST_COLUMNS}
            data={data}
            fetchData={fetchData}
            hasPagination
            loading={loading}
            pageCount={pageCount}
            pageSize={pageSize}
          />
        )}
      </DataTableWithState>
    );

    fireEvent.click(getByLabelText("Go to next page"));
    await waitForDomChange({ container });
    expect(container.querySelectorAll("tbody tr").length).toBe(2);
    expect(getByText("Winston")).toBeTruthy();
    expect(getByText("Tod")).toBeTruthy();

    fireEvent.click(getByLabelText("Go to next page"));
    await waitForDomChange({ container });
    expect(container.querySelectorAll("tbody tr").length).toBe(1);
    expect(getByText("Olympia")).toBeTruthy();

    fireEvent.click(getByLabelText("Go to previous page"));
    await waitForDomChange({ container });
    expect(getByText("Winston")).toBeTruthy();
    expect(getByText("Tod")).toBeTruthy();
  });

  it("should go to the previous page when previous is clicked", () => {
    const { getByText, getByLabelText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasPagination
        pageSize={2}
      />
    );

    fireEvent.click(getByLabelText("Go to next page"));
    expect(getByText("Winston")).toBeTruthy();
    expect(getByText("Tod")).toBeTruthy();

    fireEvent.click(getByLabelText("Go to previous page"));
    expect(getByText("Tamika")).toBeTruthy();
    expect(getByText("Annamarie")).toBeTruthy();
  });

  it("should show initial number of rows when load more is clicked and sort is clicked", async () => {
    const { container, getByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasLoadMorePagination
        hasSorting
        pageSize={2}
      />
    );

    fireEvent.click(getByText("View more"));
    expect(container.querySelectorAll("tbody tr").length).toBe(4);

    fireEvent.click(getByText("Id"));
    expect(container.querySelectorAll("tbody tr").length).toBe(2);
    expect(getColumnValue(container, 2)).toEqual(["1", "2"]);
  });

  it("should show all rows and show less rows when load all or less pagination is toggled", () => {
    const { container, getByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasLoadAllOrLessPagination
        loadLessText="View less"
        loadMoreText="View all"
        pageSize={3}
      />
    );

    fireEvent.click(getByText("View all"));
    expect(container.querySelectorAll("tbody tr").length).toBe(5);

    fireEvent.click(getByText("View less"));
    expect(container.querySelectorAll("tbody tr").length).toBe(3);
  });

  it("should not show 'View all' pager when dataset is smaller that the pageSize", () => {
    const { queryByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasLoadAllOrLessPagination
        loadMoreText="View all"
        pageSize={10}
      />
    );

    expect(queryByText("View all")).toBeNull();
  });

  it("should not fail when no data object is provided", async () => {
    const { getByText } = render(
      <DataTable columns={TEST_COLUMNS} hasPagination pageSize={2} />
    );

    expect(getByText("No records.")).toBeTruthy();
  });

  it("should show no data text when data is empty", async () => {
    const { getByText } = render(
      <DataTable columns={TEST_COLUMNS} data={[]} hasPagination pageSize={2} />
    );

    expect(getByText("No records.")).toBeTruthy();
  });

  it("should show custom no data text when data is empty", async () => {
    const { getByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={[]}
        emptyRowsText="It's a custom no data text"
        hasPagination
        pageSize={2}
      />
    );

    expect(getByText("It's a custom no data text")).toBeTruthy();
  });

  it("should show noResultsText when data is filtered and there's no results", async () => {
    const noResultsText =
      "There are no records found. Please modify your filter criteria and try again.";

    const { getByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        filterValues={{ name: "Non existing name" }}
        noResultsText={noResultsText}
      />
    );

    expect(getByText(noResultsText)).toBeTruthy();
  });

  it("should filter data when filters applied", async () => {
    const { getByText, queryByText } = render(
      <DataTable
        columns={[
          { Header: "Name", accessor: "name" },
          {
            Header: "Delivery method",
            accessor: "deliveryMethod",
            filter: "exact",
          },
        ]}
        data={[
          { name: "Payee 1 Mail Check", deliveryMethod: "MAIL_CHECK" },
          { name: "Payee 2 Mail Check", deliveryMethod: "MAIL_CHECK" },
          { name: "Payee 3 Electronic", deliveryMethod: "ELECTRONIC" },
          { name: "Payee 4 Mail Check", deliveryMethod: "MAIL_CHECK" },
          { name: "Payee 5 Electronic", deliveryMethod: "ELECTRONIC" },
          { name: "Payee 6 Mail Check", deliveryMethod: "MAIL_CHECK" },
          { name: "Payee 7 Electronic", deliveryMethod: "ELECTRONIC" },
          { name: "Payee 8 Electronic", deliveryMethod: "ELECTRONIC" },
        ]}
        filterValues={{ deliveryMethod: "MAIL_CHECK" }}
      />
    );

    // Rows that match the filter are visible
    expect(getByText("Payee 1 Mail Check")).toBeTruthy();
    expect(getByText("Payee 2 Mail Check")).toBeTruthy();
    expect(getByText("Payee 4 Mail Check")).toBeTruthy();
    expect(getByText("Payee 6 Mail Check")).toBeTruthy();

    // Rows that don't match the filter aren't visible
    expect(queryByText("Payee 3 Electronic")).toBeNull();
    expect(queryByText("Payee 5 Electronic")).toBeNull();
    expect(queryByText("Payee 7 Electronic")).toBeNull();
    expect(queryByText("Payee 8 Electronic")).toBeNull();
  });

  it("should show custom load more text when loadMoreText prop is set", async () => {
    const { getByText } = render(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        hasLoadMorePagination
        loadMoreText="Custom load more label"
        pageSize={3}
      />
    );

    expect(getByText("Custom load more label")).toBeTruthy();
  });

  it("should add css class names to TH and TD when headerClassName and className are set", async () => {
    const { container } = render(
      <DataTable
        columns={[
          {
            Header: "Name",
            accessor: "name",
            headerClassName: "firstHeaderClass",
          },
          {
            Header: "Id",
            accessor: "id",
            headerClassName: "secondHeaderClass",
            className: "secondColumnClassName",
          },
          {
            Header: "Date",
            accessor: "date",
            className: "thirdColumnClassName",
          },
        ]}
        data={TEST_DATA}
        hasLoadMorePagination
        loadMoreText="Custom load more label"
        pageSize={3}
      />
    );

    expect(container.querySelector("th.firstHeaderClass")).toBeTruthy();
    expect(container.querySelector("th.secondHeaderClass")).toBeTruthy();
    expect(container.querySelector("td.secondColumnClassName")).toBeTruthy();
    expect(container.querySelector("td.thirdColumnClassName")).toBeTruthy();
  });

  it("should bring to page 1 when server side pager is clicked and sort is clicked", async () => {
    const { container, getByText, getByLabelText } = render(
      <DataTableWithState pageSize={2} serverData={TEST_DATA}>
        {({ data, fetchData, pageCount, pageSize }) => (
          <DataTable
            columns={TEST_COLUMNS}
            data={data}
            fetchData={fetchData}
            hasPagination
            hasSorting
            pageCount={pageCount}
            pageSize={pageSize}
          />
        )}
      </DataTableWithState>
    );

    fireEvent.click(getByLabelText("Go to next page"));
    await waitForDomChange({ container });

    fireEvent.click(getByText("Name"));
    await waitForDomChange({ container });

    expect(getByText("Annamarie")).toBeTruthy();
    expect(getByText("Olympia")).toBeTruthy();
  });

  it("should not show column when its show property is set to 'false'", async () => {
    const { getByText, queryByText } = render(
      <DataTable
        columns={[
          {
            Header: "Name",
            accessor: "name",
            show: false,
          },
          {
            Header: "Index",
            accessor: "index",
          },
        ]}
        data={[
          { name: "One", index: "First row" },
          { name: "Two", index: "Second row" },
          { name: "Three", index: "Third row" },
        ]}
      />
    );

    // Name column header should be hidden
    expect(queryByText("Name")).toBeNull();

    // Name column values should be hidden
    expect(queryByText("One")).toBeNull();
    expect(queryByText("Two")).toBeNull();
    expect(queryByText("Three")).toBeNull();

    // Index column header should be visible
    expect(getByText("Index")).toBeTruthy();

    // Index column values should be visible
    expect(getByText("Second row")).toBeTruthy();
    expect(getByText("Third row")).toBeTruthy();
    expect(getByText("Third row")).toBeTruthy();
  });
});
