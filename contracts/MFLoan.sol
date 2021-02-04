// SPDX-License-Identifier: MIT

pragma solidity ^0.7.1;

import "./token/ERC721/ERC721.sol";

contract MFLoan is ERC721 {
  string private _name;
  string private _symbol;

  constructor(string memory name_, string memory symbol_) ERC721(_name, _symbol) {
    _name = name_;
    _symbol = symbol_;
  }
}