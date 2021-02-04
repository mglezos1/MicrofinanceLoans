const MFLoan = artifacts.require("./MFLoan.sol");

module.exports = (deployer) => {
  deployer.deploy(MFLoan, "New Loan", "LOAN");
}