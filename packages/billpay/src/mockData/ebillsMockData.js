module.exports = {
  default: [
    {
      id: "102271570",
      name: "Discover Credit Cards",
      nickName: "Discover Credit Cards",
      accountNumber: "************2502",
      ebillList: [
        {
          id: "208235164",
          type: "AGGREGATED",
          status: "PAID",
          paymentURIDetails:
            "https://bpm-uat.readiness.billdomain.com/csp/ShowPBillServlet?brid=7742&token=CBB3452979CA40609160471742D74B1F239900553336EF38E10E336A7FFBC2D5A4610B1F5439BA7EB6E7DF86E5714CF8&Pg=1",
          cycleStatus: "IN_CYCLE",
          payeeId: "102271570",
          dueDate: "2019-09-30",
          statementDate: "2019-08-31",
          receivedDate: "2019-09-20",
          totalDue: 110.95,
          minimumDue: 22,
        },
        {
          id: "208235163",
          type: "AGGREGATED",
          status: "UNPAID",
          paymentURIDetails:
            "https://bpm-uat.readiness.billdomain.com/csp/ShowPBillServlet?brid=7742&token=CBB3452979CA40609160471742D74B1F239900553336EF38E10E336A7FFBC2D5A4610B1F5439BA7EB6E7DF86E5714CF8&Pg=1",
          cycleStatus: "IN_CYCLE",
          payeeId: "102271570",
          dueDate: "2019-11-30",
          statementDate: "2019-10-31",
          receivedDate: "2019-11-20",
          totalDue: 117.95,
          minimumDue: 22,
        },
      ],
      ebillStatus: "ACTIVE",
    },
    {
      id: "102271569",
      name: "Salem Five Bank",
      nickName: "Salem Five Bank",
      accountNumber: "************0001",
      ebillList: [
        {
          id: "208235160",
          type: "DIRECT",
          status: "MARKED_PAID",
          paymentURIDetails:
            "https://bpm-uat.readiness.billdomain.com/csp/ShowPBillServlet?brid=7742&token=CBB3452979CA40609160471742D74B1F4FDBA9D235062E33315C3942CAF7C34290079383B79E62F3080E6633C4C26798&Pg=1",
          cycleStatus: "IN_CYCLE",
          payeeId: "102278398",
          dueDate: "2019-11-30",
          statementDate: "2019-10-31",
          receivedDate: "2019-11-20",
          totalDue: 117.95,
          minimumDue: 22,
        },
        {
          id: "208235161",
          type: "DIRECT",
          status: "UNPAID",
          paymentURIDetails:
            "https://bpm-uat.readiness.billdomain.com/csp/ShowPBillServlet?brid=7742&token=CBB3452979CA40609160471742D74B1F4FDBA9D235062E33315C3942CAF7C34290079383B79E62F3080E6633C4C26798&Pg=1",
          cycleStatus: "IN_CYCLE",
          payeeId: "102278398",
          dueDate: "2019-10-30",
          statementDate: "2019-09-31",
          receivedDate: "2019-10-20",
          totalDue: 105.95,
          minimumDue: 22,
        },
        {
          id: "208235162",
          type: "DIRECT",
          status: "PAID",
          paymentURIDetails:
            "https://bpm-uat.readiness.billdomain.com/csp/ShowPBillServlet?brid=7742&token=CBB3452979CA40609160471742D74B1F4FDBA9D235062E33315C3942CAF7C34290079383B79E62F3080E6633C4C26798&Pg=1",
          cycleStatus: "IN_CYCLE",
          payeeId: "102278398",
          dueDate: "2019-09-30",
          statementDate: "2019-08-31",
          receivedDate: "2019-09-20",
          totalDue: 125.95,
          minimumDue: 22,
        },
      ],
      ebillStatus: "PENDING_ACTIVATION",
    },
    {
      id: "102260911",
      name: "Wachovia Bank",
      nickName: "Wachovia Bank active ebill",
      accountNumber: "**3C",
      ebillList: [
        {
          id: "208235199",
          type: "AGGREGATED",
          status: "UNPAID",
          paymentURIDetails:
            "https://bpm-uat.readiness.billdomain.com/csp/ShowPBillServlet?brid=7742&token=CBB3452979CA40609160471742D74B1F239900553336EF38E10E336A7FFBC2D5A4610B1F5439BA7EB6E7DF86E5714CF8&Pg=1",
          cycleStatus: "IN_CYCLE",
          payeeId: "102260911",
          dueDate: "2019-11-30",
          statementDate: "2019-10-31",
          receivedDate: "2019-11-20",
          totalDue: 120,
          minimumDue: 10,
        },
      ],
      ebillStatus: "ACTIVE",
    },
  ],
};
