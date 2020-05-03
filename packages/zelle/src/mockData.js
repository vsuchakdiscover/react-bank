const profiles = [
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
];

const genarateTMXId = {
  tmxId: "7afb3eb1-3d4e-4454-8b6d-448fe7adcd7-1564417534794",
};

// Using CommonJS style export so we can consume via Node (without using Babel-node)
module.exports = {
  // Note, production API uses plural profiles in URL, so this matches prod.
  profiles,
  genarateTMXId,
};
