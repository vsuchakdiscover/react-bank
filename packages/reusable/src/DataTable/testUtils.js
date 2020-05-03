import { useState } from "react";

export const SERVER_DATA = [
  {
    id: "102258633",
    name: "Discover Credit Cards",
    nickName: "New Disc",
    accountNumber: "6011000016688631",
    status: "ACTIVE",
    verified: true,
    earliestPaymentDate: "2019-08-05",
    address: {
      postalCode: "601976103",
      formatted: "PO BOX 6103  \nCAROL STREAM IL 601976103\n USA",
    },
    leadDays: 2,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256443",
    name: "Test Payee 11",
    nickName: "Test Payee 11",
    accountNumber: "2222",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256445",
    name: "another payee",
    nickName: "Another payee",
    accountNumber: "2222",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Check by Mail",
  },
  {
    id: "102256448",
    name: "Another payee 2",
    nickName: "Another payee 2",
    accountNumber: "33332222",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256450",
    name: "Another payee 3",
    nickName: "Another payee 3",
    accountNumber: "44445555",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256450",
    name: "Another payee 4",
    nickName: "Another payee 4",
    accountNumber: "44445555",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Check by Mail",
  },
  {
    id: "102256450",
    name: "Another payee 5",
    nickName: "Another payee 5",
    accountNumber: "44445555",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256450",
    name: "Another payee 6",
    nickName: "Another payee 6",
    accountNumber: "44445555",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256450",
    name: "Another payee 7",
    nickName: "Another payee 7",
    accountNumber: "44445555",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
  {
    id: "102256450",
    name: "Payee 8",
    nickName: "Payee 8",
    accountNumber: "44445555",
    status: "ACTIVE",
    verified: false,
    earliestPaymentDate: "2019-08-06",
    phoneNumber: {
      number: "8003222265",
      formatted: "800-322-2265",
    },
    address: {
      streetAddress: "325 OAK CREEK DR",
      locality: "test",
      region: "IL",
      postalCode: "60090",
      formatted: "325 OAK CREEK DR  \ntest IL 60090\n USA",
    },
    leadDays: 4,
    cutOffTime: "13:00:00",
    deliveryMethod: "Electronic",
  },
];

export const TEST_DATA = [
  {
    name: "Tamika",
    id: "1",
    date: "2019-08-06",
    rowContent: "Tamika content",
  },
  {
    name: "Annamarie",
    id: "2",
    date: "2019-07-05",
    rowContent: "Annamarie content",
  },
  {
    name: "Winston",
    id: "3",
    date: "2019-03-02",
    rowContent: "Winston content",
  },
  {
    name: "Tod",
    id: "4",
    date: "2019-10-04",
    rowContent: "Tod content",
  },
  {
    name: "Olympia",
    id: "5",
    date: "2019-05-01",
    rowContent: "Olympia content",
  },
];

export const TEST_COLUMNS = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Date",
    accessor: "date",
  },
];

export const getColumnValue = (container, columnNumber = 1) =>
  Array.from(
    container.querySelectorAll(`tbody tr td:nth-child(${columnNumber})`)
  ).map((e) => e.textContent);

export const DataTableWithState = ({ pageSize = 2, children, serverData }) => {
  const [data, setData] = useState(serverData.slice(0, pageSize));
  const [pageCount, setPageCount] = useState(
    Math.ceil(serverData.length / pageSize)
  );
  const [loading, setLoading] = useState(false);

  /**
   * We fake a server request here.
   */
  const fetchData = ({ pageSize, pageIndex, sortBy }) => {
    const compare = (name, a, b) => {
      if (a[name] < b[name]) {
        return -1;
      }
      if (a[name] > b[name]) {
        return 1;
      }
      return 0;
    };

    const descCompare = (name, a, b) => compare(name, a, b) * -1;

    // Set the loading state
    setLoading(true);

    // We'll even set a delay to simulate a server here
    setTimeout(() => {
      const startRow = pageSize * pageIndex;
      const endRow = startRow + pageSize;

      let data = [...serverData];

      if (sortBy) {
        sortBy.forEach(({ id, desc }) => {
          data.sort((a, b) =>
            desc === true ? descCompare(id, a, b) : compare(id, a, b)
          );
        });
      }

      setData(data.slice(startRow, endRow));

      // Your server could send back total page count.
      // For now we'll just fake it, too
      setPageCount(Math.ceil(serverData.length / pageSize));

      setLoading(false);
    }, 300);
  };

  return children({
    data,
    fetchData,
    pageCount,
    loading,
    pageSize,
  });
};

DataTableWithState.defaultProps = {
  serverData: SERVER_DATA,
};
