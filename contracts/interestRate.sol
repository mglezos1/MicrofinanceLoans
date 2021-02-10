// SPDX-License-Identifier: MIT

pragma solidity ^0.7.1;

contract interestRate {
address owner;
constructor() {
owner = msg.sender;
}

struct rate {
uint iRate;
uint date;
}

 mapping( uint => rate) rateQuote;

modifier onlyOwner {
require(
msg.sender == owner,
"Only owner can call this function."
);
_;
}
//interest rate
function getRate(uint iRate, uint date) onlyOwner public {

rate memory _Rate = rate({iRate: iRate, date: date});
rateQuote[date] = _Rate;
}
}