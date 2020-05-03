import {
  shape,
  string,
  func,
  oneOfType,
  node,
  number,
  bool,
  oneOf,
} from "prop-types";

export const columnType = shape({
  /**
   * A column data accessor.
   *
   * - This string/function is used to build the data model for your column.
   * - The data returned by an accessor should be **primitive** and sortable.
   * - If a string is passed, the column's value will be looked up on the original row via that key, eg. If your column's accessor is `firstName` then its value would be read from `row['firstName']`. You can also specify deeply nested values with accessors like `info.hobbies` or even `address[0].street`
   * - If a function is passed, the column's value will be looked up on the original row using this accessor function, eg. If your column's accessor is `row => row.firstName`, then its value would be determined by passing the row to this function and using the resulting value.
   */
  accessor: oneOfType([string, func]),

  /**
   * A column id.
   *
   * - **Required if `accessor` is a function**
   * - This is the unique ID for the column. It is used by reference in things like sorting, grouping, filtering etc.
   * - If a **string** accessor is used, it defaults as the column ID, but can be overridden if necessary.
   */
  id: string,

  /**
   * A Table cell component. Responsible for displaying a cell (td).
   *
   * - Defaults to `({ cell: { value } }) => String(value)`
   * - Receives the table instance and cell model as props
   * - Must return valid JSX
   * - This function (or component) is primarily used for formatting the column value, eg. If your column accessor returns a date object, you can use a `Cell` function to format that date to a readable format.
   */
  Cell: oneOfType([func, node]),

  /** Class name for a table cell (td). */
  className: string,

  /**
   * The resolved function from the string/function will be used to filter the this column's data.
   * - If a string is passed, the function with that name located on either the custom filterTypes option or the built-in filtering types object will be used.
   * Built-in filter types are: text, exactText, exactTextCase, includes, includesAll, exact, equals, between.
   * For more info check ./node_modules/react-table/src/filterTypes.js
   * - If a function is passed, it will be used directly.
   * */
  filter: oneOfType([func, string]),

  /** Class name for a header cell (th). */
  headerClassName: string,

  /**
   * A Header cell component. Responsible for displaying a header cell (th).
   * - Defaults to `() => null`
   * - Receives the table instance and column model as props
   * - Must either be a **string or return valid JSX**
   * - If a function/component is passed, it will be used for formatting the header value, eg. You can use a `Header` function to dynamically format the header using any table or column state.
   */
  Header: oneOfType([string, func, node]),

  /** A column order. */
  order: number,

  /**
   * A column visibility toggle.
   *
   * - If set to `false`, the column will be hidden.
   * - If set to a `function`, it will be called with the current table instance and can then return `true` or `false`.
   * - The data model for hidden columns is still calculated including sorting, filters, and grouping.
   */
  show: oneOfType([bool, func]),

  /** A column header visibility toggle. Default is 'true', if set to false, header label is not displayed. */
  showHeader: bool,

  /**
   * Specifies a sortType for the column. Used to compare 2 rows of data and order them correctly.
   *
   * - String options: basic, datetime, alphanumeric, ialphanumeric. Defaults to ialphanumeric
   * - If a function is passed, it will be used for the sorting.
   */
  sortType: oneOfType([
    oneOf(["basic", "datetime", "alphanumeric", "ialphanumeric"]),
    func,
  ]),
});
