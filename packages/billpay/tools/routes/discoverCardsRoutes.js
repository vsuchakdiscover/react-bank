module.exports = function init(server, db) {
  server.post("/cards/", function (req, res) {
    //remove the posted account from the mock card response
    const accountNumbers = req.body.map((r) => r.accountNumber);
    const cardsValue = db
      .get("cards")
      .filter((c) => !accountNumbers.includes(c.accountNumber))
      .value();
    db.set("cards", cardsValue).write();
    //return the response
    return res.status(200).json(req.body);
  });
};
