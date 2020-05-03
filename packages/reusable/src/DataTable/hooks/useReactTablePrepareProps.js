/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo } from "react";

/**
 * Prepares passed props in accordance to React Table requirements:
 *   - data should be memoized via useMemo,
 *   - callbacks should be passed through useCallback
 */
export default function useReactTablePrepareProps({
  data,
  columns,
  fetchData,
  filterTypes,
  filterValues,
}) {
  return {
    preparedData: useMemo(() => {
      return [...data];
    }, [data]),
    preparedColumns: useMemo(
      () =>
        columns
          .map((column, index) => ({
            ...{
              order: index,
              show: true,
              showHeader: true,
              sortType: "ialphanumeric",
            },
            ...column,
          }))
          .sort(columnsByOrder),
      [columns]
    ),
    preparedFetchData: useCallback(fetchData, []),
    preparedFilterTypes: useMemo(() => ({ ...filterTypes }), [filterTypes]),
    preparedFilterValues: useMemo(() => {
      return Object.entries(filterValues).map(([id, value]) => ({
        id,
        value,
      }));
    }, [filterValues]),
  };
}

const columnsByOrder = (a, b) => (a.order > b.order ? 1 : -1);
