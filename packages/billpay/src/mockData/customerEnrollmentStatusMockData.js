const scenarios = require("./centralizedPayeeScenarios");

module.exports = {
  default: scenarios.map(({ id, scenario, status, payees }) => {
    return {
      id,
      scenario,
      status: { ...status, payees },
    };
  }),
};
