// SPDX-License-Identifier: MIT

pragma solidity ^0.7.1;

contract MFLoanOracle {
  address owner;
  uint256 iRate100;
  
  constructor() {
    iRate100 = 1;
  }

  function getRate() public view returns(uint256) {
    return iRate100;
  }

  function setRate(uint256 rate) public {
    require(rate > 0, "MFLoanOracle: must be more the zero");
    iRate100 = rate;
  }
}