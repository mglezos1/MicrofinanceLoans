var express = require("express");
var router = express.Router();

var connectionDB = require("./database");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET home page. */
router.post("/save", function (req, res, next) {
  console.log()
  let { body } = req;
  connectionDB().then(async (data) => {
    console.log(data.lender);
    const jane = await data.lender.create({
      lenderfirstName: body.valName,
      lenderlastName: body.valLastName,
      lenderEmail: body.valEmail,
    });
    console.log(`${body.valName} auto-generated ID:, ${jane.id}`);
    res.send({body});
  });
});

module.exports = router;
