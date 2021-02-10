// SPDX-License-Identifier: MIT

pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2; // for "getLoan() returns(struct)"

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MFLoanOracle.sol";

contract MFLoan is ERC721 {
  struct Loan {
    uint id;
    address borrower;
    address lender;
    uint dateBorrowed;
    uint amountBorrowed;
    uint interestRate;
    uint amountOwedToPayback;
    uint dueDate;
  }

  mapping(address => Loan) loans;
  MFLoanOracle oracle;
  
  uint private _tokenIndexCursor;

  constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    oracle = new MFLoanOracle();
  }
  
  function confirmNewLoan(address _borrower, uint _amount) public payable returns (uint) {
    // Checks:
    require(_borrower != address(0) && msg.sender != address(0), "MFLoan: detected zero address");
    require(_amount > 0, "MFLoan: cannot borrow zero");
    require(loans[_borrower].amountOwedToPayback == 0, "MFLoan: borrower already has a loan");
    require(msg.value >= _amount, "MFLoan: insufficient value provided for loan amount");
    require(msg.sender.balance >= _amount, "MFLoan: insufficient lender balance");

    // Effects:
    uint _interestRate = oracle.getInterestRateTimes100();
    uint _tokenId = _tokenIndexCursor;
    _tokenIndexCursor++;
    Loan memory _newLoan = Loan({
      id: _tokenId,
      borrower: _borrower,
      lender: msg.sender,
      dateBorrowed: block.timestamp,
      amountBorrowed: _amount,
      interestRate: _interestRate,
      amountOwedToPayback: _amount + (_amount * _interestRate / 10000), // /100 for percentage, /100 for Times100()
      dueDate: block.timestamp + 7 days
    });
    loans[_borrower] = _newLoan;
    
    // Interactions:
    _safeMint(_borrower, _tokenId);
    (bool _success, ) = _borrower.call{ value: _amount, gas: gasleft() }("");
    require(_success, "MFLoan: failed to perform loan");
    
    assert(loans[_borrower].amountBorrowed == _amount);
    return _tokenId;
  }

  function paybackLoan(uint _amount) public payable {
    Loan storage _loan = loans[msg.sender];
    uint _owed = _loan.amountOwedToPayback;
    
    // Checks:
    require(_owed > 0 && balanceOf(msg.sender) > 0, "MFLoan: no loan to payback");
    require(msg.value >= _owed && _amount >= _owed, "MFLoan: insufficient value provided for owed amount");
    require(block.timestamp <= _loan.dueDate, "MFLoan: overdue payment, escalation required"); // document
    require(_owed - _amount < _owed, "MFLoan: invalid payback amount");
    
    // Effects:
    _loan.amountOwedToPayback -= _amount;
    assert(_loan.amountOwedToPayback == 0);
    _burn(_loan.id);
    
    // Interactions:
    (bool _success, ) = _loan.lender.call{ value: _amount, gas: gasleft() }("");
    require(_success, "MFLoan: cannot paybackLoan(), low-level call failed");
  }
  
  function getLoan(address _borrower) public view returns(Loan memory) {
      require(_borrower != address(0), "MFLoan: detected zero address");
      return loans[_borrower];
  }
  
  function getLoanOwedAmt(address _borrower) public view returns(uint) {
      require(_borrower != address(0), "MFLoan: detected zero address");
      return loans[_borrower].amountOwedToPayback;
  }
}
