var express = require("express");
var router = express.Router();
const axios = require('axios');

var connectionDB = require("./database");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET home page. */
router.get('/rates',  async function(req, res, next) {
  axios.get('https://www.quandl.com/api/v3/datasets/FRED/DPRIME.json?api_key=sbVoyriisY6fszmUcehV')
  .then(response => {
    let stock = {};
    let dataNowDayRates =  response.data.dataset.data[0];
    stock.rate=dataNowDayRates[1];
    stock.date=dataNowDayRates[0];
    console.log('Rate',stock.rate)
    console.log('Date',stock.date)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(stock,1,4));
  })
  .catch(error => {
    console.log(error);
  });  
});

/* GET home page. 
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
});*/

module.exports = router;
