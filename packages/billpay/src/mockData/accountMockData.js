module.exports = {
  default: [
    {
      id: 1,
      scenario: "Personal Checking",
      accounts: [
        {
          accountName: "Personal Checking",
          accountNumber: "******9815",
          availableBalance: 123.45,
          preferred: false,
          type: "CHECKING",
          id: "SM1326173",
          fundingId: "111",
        },
      ],
    },
    {
      id: 2,
      scenario: "Personal Checking and Money Market",
      accounts: [
        {
          accountName: "Personal Checking",
          accountNumber: "******9815",
          availableBalance: 123.45,
          preferred: true,
          type: "CHECKING",
          id: "SM1326173",
          fundingId: "111",
        },
        {
          accountName: "My Money Market",
          accountNumber: "******9811",
          availableBalance: 1131.51,
          preferred: false,
          type: "MONEYMARKET",
          id: "SM1326100",
          fundingId: "222",
        },
      ],
    },
    {
      id: 3,
      scenario: "Personal Checking and Money Market with low balances",
      accounts: [
        {
          accountName: "Personal Checking",
          accountNumber: "******9815",
          availableBalance: 1.45,
          preferred: true,
          type: "CHECKING",
          id: "SM1326173",
          fundingId: "111",
        },
        {
          accountName: "My Money Market",
          accountNumber: "******9811",
          availableBalance: 3.51,
          preferred: false,
          type: "MONEYMARKET",
          id: "SM1326100",
          fundingId: "222",
        },
      ],
    },
  ],
};
