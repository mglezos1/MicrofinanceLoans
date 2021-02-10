// SPDX-License-Identifier: MIT

pragma solidity ^0.7.1;

contract MFLoanOracle {
  uint interestRateTimes100;
  
  constructor() {
      interestRateTimes100 = 100; // 1%
  }
  
  function setInterestRate(uint _newRate) public {
    require(_newRate != _newRate, "todo");
    interestRateTimes100 = _newRate;
  }
  
  function getInterestRateTimes100() public view returns(uint) {
    return interestRateTimes100;
  }
}