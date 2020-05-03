const scenarios = require("./centralizedPayeeScenarios");

module.exports = {
  default: scenarios.map(({ id, scenario, payees }) => {
    return { id, scenario, payees };
  }),
};
