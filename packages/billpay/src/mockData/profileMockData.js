module.exports = {
  default: [
    {
      id: "1",
      username: "mstoclag127",
      name: {
        givenName: "ROBERT",
        middleName: "E",
        familyName: "LABUZ",
        formatted: "ROBERT E LABUZ",
      },
      email: "mail.integration@gmail.com",
      phoneNumbers: {
        mobile: {
          category: "mobile",
          countryCode: "1",
          number: "6362395044",
          formatted: "636-239-5044",
          cell: true,
        },
        home: {
          category: "home",
          countryCode: "1",
          number: "6301348855",
          formatted: "630-134-8855",
          cell: false,
        },
        work: {
          category: "work",
          countryCode: "1",
          number: "2244055133",
          ext: "1234",
          formatted: "224-405-5133 Ext. 1234",
          cell: false,
        },
      },
    },
    // Only a work number and an email.
    {
      id: "2",
      username: "mstoclag127",
      name: {
        givenName: "ROBERT",
        middleName: "E",
        familyName: "LABUZ",
        formatted: "ROBERT E LABUZ",
      },
      email: "mail.integration@gmail.com",
      phoneNumbers: {
        work: {
          category: "work",
          countryCode: "1",
          number: "2244055133",
          ext: "1234",
          formatted: "224-405-5133 Ext. 1234",
          cell: false,
        },
      },
    },
  ],
};
