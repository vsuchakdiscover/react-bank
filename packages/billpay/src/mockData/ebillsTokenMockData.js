module.exports = {
  default: [
    {
      id: "102265895",
      scenario: "without session key",
      body: {
        id: "102265895",
        name: "Salem Five Bank",
        nickName: "salem ebill",
        accountNumber: "************0022",
        ebillsTokenList: [
          {
            tokenID: "54529",
            label: "Up to 11 Digit Loan Account Number",
            name: "Account Number",
            format: "0",
            formatType: "First 11 Digits of the Pay FI Account Number",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54530",
            label: "Up to 5 Digit Loan Note Number",
            name: "Note Number",
            format: "0",
            formatType: "Digits 12 to 16 of the Pay FI Account Number",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
    },
    {
      id: "102260910",
      scenario: "with session key",
      body: {
        id: "102260910",
        name: "Discover Credit Cards",
        nickName: "DiscoverCard",
        accountNumber: "************4065",
        sessionKey: "1020827",
        ebillsTokenList: [
          {
            tokenID: "Q1",
            label: "User ID or Acct Number",
            name: "User ID or Acct Number",
            formatType: "TextBox",
            valueRequired: true,
          },
          {
            tokenID: "Q2",
            label: "Password",
            name: "Password",
            formatType: "PASSWORD",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {},
    },
    {
      id: "102278421",
      scenario: "Cox Communications",
      body: {
        id: "102278421",
        name: "Cox Communications",
        nickName: "cox com",
        accountNumber: "************7980",
        ebillsTokenList: [
          {
            tokenID: "54078",
            label: " http://www.cox.com/policy/papersuppression.asp",
            name: " http://www.cox.com/policy/papersuppression.asp",
            format: "0",
            formatType: "CHECKBOX",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278421",
        name: "Cox Communications",
        nickName: "cox com",
        accountNumber: "************7980",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "102278437",
      scenario: "Mid Continent Communications",
      body: {
        id: "102278437",
        name: "Mid Continent Communications",
        nickName: "mid com",
        accountNumber: "*****7898",
        ebillsTokenList: [
          {
            tokenID: "54504",
            label: "Your Account Number as listed on bill",
            name: "Account Number",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54505",
            label: "Enter Your Zip Code as it appears on your bill",
            name: "Zip Code",
            format: "0",
            formatType: "ZIP",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278437",
        name: "Mid Continent Communications",
        nickName: "mid com",
        accountNumber: "*****7898",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "102278440",
      scenario: "Verizon Wireless",
      body: {
        id: "102278440",
        name: "Verizon Wireless",
        nickName: "Verizon Wireless",
        accountNumber: "******7898",
        ebillsTokenList: [
          {
            tokenID: "54298",
            label: "10-digit mobile phone number<br>(numbers only)",
            name: "Phone Number",
            format: "0",
            formatType: "PHONE",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54299",
            label: "5-digit zip code where you receive your bill",
            name: "ZIP Code",
            format: "0",
            formatType: "ZIP",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54300",
            label: "Last 4 digits of Social Security number or Tax ID",
            name: "Last 4 of SSN",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54613",
            label:
              "http://www.verizonwireless.com/b2c/globalText?textName=CUSTOMER_AGREEMENT&jspName=footer/customerAgreement.jsp",
            name: "TandCCheckbox",
            format: "0",
            formatType: "CHECKBOX",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278440",
        name: "Verizon Wireless",
        nickName: "Verizon Wireless",
        accountNumber: "******7898",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "102278397",
      scenario: "Nissan Motor Acceptance",
      body: {
        id: "102278397",
        name: "Nissan Motor Acceptance",
        nickName: "Nissan Motor Acceptance",
        accountNumber: "*************0001",
        ebillsTokenList: [
          {
            tokenID: "54255",
            label: "User ID",
            name: "Login Name",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54256",
            label: "Password",
            name: "Login Password",
            format: "0",
            formatType: "PASSWORD",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278397",
        name: "Nissan Motor Acceptance",
        nickName: "Nissan Motor Acceptance",
        accountNumber: "*************0001",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "102278398",
      scenario: "Salem Five Bank",
      body: {
        id: "102278398",
        name: "Salem Five Bank",
        nickName: "Salem Five Bank",
        accountNumber: "************0001",
        ebillsTokenList: [
          {
            tokenID: "54529",
            label: "Up to 11 Digit Loan Account Number",
            name: "Account Number",
            format: "0",
            formatType: "First 11 Digits of the Pay FI Account Number",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54530",
            label: "Up to 5 Digit Loan Note Number",
            name: "Note Number",
            format: "0",
            formatType: "Digits 12 to 16 of the Pay FI Account Number",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278398",
        name: "Salem Five Bank",
        nickName: "Salem Five Bank",
        accountNumber: "************0001",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "102278443",
      scenario: "Wells Fargo Home Mortgage",
      body: {
        id: "102278443",
        name: "Wells Fargo Home Mortgage",
        nickName: "Wells Fargo Home Mortgage",
        accountNumber: "******4789",
        ebillsTokenList: [
          {
            tokenID: "53468",
            label: "Password",
            name: "Login Password",
            format: "0",
            formatType: "PASSWORD",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "53469",
            label: "User ID",
            name: "Login Name",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54137",
            label:
              '(Optional) Please select the same security questions and answers that you originally set up on the Wells Fargo website.  If you have forgotten your questions and answers, please log in to the Wells Fargo website, and click the "Challenge Questions" link.',
            name: "Security Instructional Text",
            format: "0",
            formatType: "SITE KEY INSTRUCTIONAL TEXT Format Type",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54138",
            label: "1.",
            name:
              " - -  Select a question  - -|In what city did your spouse attend college?|In what city was your father born?|In what city was your paternal grandmother (father's mother) born?|What is name of the hospital in which you were born?|What is the date of your wedding anniversary? (MMDD)|What is the first name of your best friend from college?|What is the first name of your first roommate in college?|What is the first name of your maternal grandfather (mother's father)?|What is the first name of your paternal grandfather (father's father)?|What is the last name of your favorite historical figure?|What is the name of the first elementary/grade school you attended?|What is the name of the high school you attended?|What is the name of the street that you grew up on as a child?|What is the name of the street your best friend from high school lived on?|What is the name of your favorite pet?|What is the name of your favorite restaurant?|What is the name of your first pet?|What is the profession of your maternal grandfather (mother's father)?|What is your all-time favorite book?|What is your best friend's first name?|What is your dream occupation?|What is your father's middle name?|What is your favorite city other than where you live now?|What is your favorite place to visit?|What is your first child's birthday? (MMDD)|What is your first child's nickname?|What is your mother's birthday? (MMDD)|What is your mother's middle name?|What is your oldest sibling's middle name?|What is your sister's middle name?|What is your spouse's middle name?|What is your spouse's nickname?|What sports team do you love to see lose?|What was the first thing you saved up to buy?|What was the model of your first car?|What was the name of your elementary school?|What was your first job?|What was your high school mascot?|What was your most memorable gift as a child?|What year did you get your first job? (YYYY)|What year did you graduate from elementary/grade school? (YYYY)|What year did you graduate from highschool? (YYYY)|What year did you start high school? (YYYY)|What year did you start junior high/middle school? (YYYY)|Where did you go on your first date? (Restaurant, movie, park, etc.)",
            format: "0",
            formatType: "SECURITY QUESTION List Box Format Type",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54139",
            label: "Answer",
            name: "Security Answer",
            format: "0",
            formatType: "SECURITY ANSWER TEXT Format Type",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54140",
            label: "2.",
            name:
              " - -  Select a question  - -|\nIn what city did you attend high school?|In what city did you meet your spouse?|In what city did your parents meet?|In what city was your father born?|In what city was your maternal grandfather (mother's father) born?|In what city was your maternal grandmother (mother's mother) born?|In what city was your paternal grandfather (father's father) born?|The first time you flew in an airplane, what was your destination?|What is name of the hospital in which you were born?|What is the date of your parent's wedding anniversary? (MMDD)|What is the first name of the best man at your wedding?|What is the first name of your best friend from high school?|What is the first name of your paternal grandmother (father's mother)?|What is the last name of your  favorite historical figure?|What is the last name of your all-time favorite fictional character?|What is the last name of your favorite sports hero?|What is the last name of your favorite teacher?|What is the name of the first elementary/grade school you attended?|What is the name of the first foreign country you visited|What is the name of the high school you attended?|What is the name of the junior high/middle school you attended?|What is the name of the street your best friend from high school lived on?|What is the name of your favorite childhood superhero?|What is your all-time favorite movie?|What is your father's birthday (mm/dd)?|What is your father's middle name?|What is your favorite animal?|What is your favorite hobby?|What is your favorite musical instrument?|What is your mother's birthday (mm/dd)?|What is your oldest sibling's birthday? (MMDD)|What is your spouse's birthday? (MMDD)|What was the first thing you saved up to buy?|What was your favorite place to visit as a child? (Park, vacation city, etc.)|What year did you get your first job? (YYYY)|What year did you graduate from high school? (YYYY)|What year did you start college? (YYYY)|What year did you start elementary/grade school? (YYYY)|What year did your first child start school? (YYYY)|Where did you go on your first date? (Restaurant, movie, park, etc.)|Where was your first job?|Who is your favorite comic book or cartoon character?|Who is your favorite musician or band?",
            format: "0",
            formatType: "SECURITY QUESTION List Box Format Type",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54141",
            label: "Answer",
            name: "Security Answer",
            format: "0",
            formatType: "SECURITY ANSWER TEXT Format Type",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54142",
            label: "3.",
            name:
              " - -  Select a question  - -|In what city did you attend high school?|In what city did your parents meet?|In what city was your mother born?|In what city was your paternal grandmother (father's mother) born?|What city were you in to celebrate the year 2000?|What is the date of your parent's wedding anniversary? (MMDD)|What is the date of your wedding anniversary? (MMDD)|What is the first name of the best man at your wedding?|What is the first name of the maid of honor at your wedding?|What is the first name of your first girlfriend/boyfriend?|What is the first name of your first roommate in college?|What is the first name of your oldest nephew/niece?|What is the first name of your spouse's father?|What is the first name of your spouse's mother?|What is the last name of your all-time favorite athlete?|What is the last name of your favorite author?|What is the last name of your favorite teacher?|What is the name of the first elementary/grade school you attended?|What is the name of the first foreign country you visited?|What is the name of your best friend from highschool?|What is the name of your favorite city?|What is the name of your first pet?|What is the profession of your maternal grandfather (mother's father)?|What is the profession of your paternal grandfather (father's father)?|What is your all-time favorite book?|What is your all-time favorite movie?|What is your brother's middle name?|What is your father's birthday? (MMDD)|What is your father's middle name?|What is your favorite city other than where you live now?|What is your favorite food?|What is your favorite game?|What is your first child's birthday? (MMDD)|What is your mother's birthday? (MMDD)|What is your oldest sibling's nickname?|What was the first thing you saved up to buy?|What was your first phone number? (Example: 123-456-7890)|What was your high school mascot?|What was your most memorable gift as a child?|What year did you graduate from high school? (YYYY)|What year did you start elementary/grade school? (YYYY)|What year did you start high school? (YYYY)|What year did you start junior high/middle school? (YYYY)|Where did you go on your first date? (Restaurant, movie, park, etc.)",
            format: "0",
            formatType: "SECURITY QUESTION List Box Format Type",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54143",
            label: "Answer",
            name: "Security Answer",
            format: "0",
            formatType: "SECURITY ANSWER TEXT Format Type",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278443",
        name: "Wells Fargo Home Mortgage",
        nickName: "Wells Fargo Home Mortgage",
        accountNumber: "******4789",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "102260919",
      scenario: "Time Warner Cable",
      body: {
        id: "102260919",
        name: "Time Warner Cable",
        nickName: "Time Warner Cable",
        accountNumber: "************3454",
        ebillsTokenList: [
          {
            tokenID: "54529",
            label: "Up to 11 Digit Loan Account Number",
            name: "Account Number",
            format: "0",
            formatType: "First 11 Digits of the Pay FI Account Number",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "54530",
            label: "Up to 5 Digit Loan Note Number",
            name: "Note Number",
            format: "0",
            formatType: "Digits 12 to 16 of the Pay FI Account Number",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
    },
    {
      id: "102278422",
      scenario: "Citi Cards",
      body: {
        id: "102278422",
        name: "Citi Cards",
        nickName: "Citi Cards",
        accountNumber: "*****3333",
        ebillsTokenList: [
          {
            tokenID: "62179",
            label: "Last Name on Primary Accounts",
            name: "OTHER",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "62180",
            label: "Last 4 Primary Acct Holders SSN",
            name: "OTHER",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "62181",
            label:
              "https://online.citi.com/US/JRS/portal/template.do?ID=EbillTerms",
            name: "Terms and Conditions",
            format: "0",
            formatType: "CHECKBOX",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "62233",
            label:
              "Please ensure the Name and SSN entered is for the PRIMARY Cardholder. Other users cannot enroll in eBill and will be declined.",
            name: "HELP TEXT",
            format: "0",
            formatType: "HELP TEXT",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "102278437",
        name: "Mid Continent Communications",
        nickName: "mid com",
        accountNumber: "*****7898",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "289911313",
      scenario: "Burlington Credit Card",
      body: {
        id: "289911313",
        name: "Burlington Credit Card",
        nickName: "Burlington Credit Card",
        accountNumber: "************2160",
        ebillsTokenList: [
          {
            tokenID: "62295",
            label:
              "https://bde-svcs.prod.local/bde/ShowTermsAndConditions?billerId=633482",
            name: "Terms and Conditions",
            format: "0",
            formatType: "CHECKBOX",
            delimiter: "|",
            valueRequired: true,
          },
        ],
        ebillStatus: "AVAILABLE",
      },
      submissionResponse: {
        id: "289911313",
        name: "Burlington Credit Card",
        nickName: "Burlington Credit Card",
        accountNumber: "************2160",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
    {
      id: "290903392",
      scenario: "Citibank Credit Cards",
      body: {
        id: "290903392",
        name: "Citibank Credit Cards",
        nickName: "Citibank Credit Cards",
        accountNumber: "************5516",
        ebillStatus: "AVAILABLE",
        ebillsTokenList: [
          {
            tokenID: "62179",
            label: "Last Name on Primary Accounts",
            name: "OTHER",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "62180",
            label: "Last 4 Primary Acct Holders SSN",
            name: "OTHER",
            format: "0",
            formatType: "OTHER",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "62181",
            label:
              "https://online.citi.com/US/JRS/portal/template.do?ID=EbillTerms",
            name: "Terms and Conditions",
            format: "0",
            formatType: "CHECKBOX",
            delimiter: "|",
            valueRequired: true,
          },
          {
            tokenID: "62233",
            label:
              "Please ensure the Name and SSN entered is for the PRIMARY Cardholder. Other users cannot enroll in eBill and will be declined.",
            name: "HELP TEXT",
            format: "0",
            formatType: "HELP TEXT",
            delimiter: "|",
            valueRequired: true,
          },
        ],
      },
      submissionResponse: {
        id: "290903392",
        name: "Citibank Credit Cards",
        nickName: "Citibank Credit Cards",
        accountNumber: "************5516",
        ebillStatus: "PENDING_ACTIVATION",
      },
    },
  ],
};
