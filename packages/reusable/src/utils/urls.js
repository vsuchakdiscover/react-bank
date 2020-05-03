// This centralizes URLs to assure consistency and clean up call sites.
const URLS = {
  // Log the user out
  LOGOUT:
    "https://portal.discover.com/customersvcs/universalLogin/logoff?accounttype=none",

  // Display technical difficulties message
  TECH_DIFF: "https://bank.discover.com/bankac/pay/global/tech-diff",

  // Display technical difficulties message with RSA
  RSA_DENY: "https://bank.discover.com/bankac/loginreg/tmxdeny",

  // Account center homepage
  ACCOUNT_CENTER: "https://bank.discover.com/bankac/",

  // Create a new checking account
  CREATE_NEW_CHECKING_ACCOUNT:
    "https://bank.discover.com/newbankaccount/handShakeApply.do?prodType=Checking&sourceApplication=bankac",

  // Create a new savings account
  CREATE_NEW_SAVINGS_ACCOUNT:
    "https://bank.discover.com/newbankaccount/handShakeApply.do?prodType=OnlineSavings&sourceApplication=bankac",

  // Create a new money market account
  CREATE_NEW_MONEY_MARKET_ACCOUNT:
    "https://bank.discover.com/newbankaccount/handShakeApply.do?prodType=MM&sourceApplication=bankac",

  // Account center home page
  ACCOUNT_CENTER_HOME_PAGE:
    "https://bank.discover.com/bankac/achome/processachome",

  // Transfer funds
  TRANSFER_FUNDS:
    "https://bank.discover.com/bankac/transferfunds/loadtransferfunds",

  // View profile
  VIEW_PROFILE: "https://bank.discover.com/bankac/profile",

  // OOB index
  OOB_INDEX: "https://bank.discover.com/bankac/static/oob/index.html",

  //Account center portal
  PORTAL_LOGIN: "https://bank.discover.com/bankac/achome/bankportal",
};

export default URLS;
