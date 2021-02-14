const MFLoanOracle = artifacts.require("./MFLoanOracle.sol");
const MFLoan = artifacts.require("./MFLoan.sol");

module.exports = (deployer) => {
  deployer.deploy(MFLoanOracle);
  deployer.deploy(MFLoan, "New Loan", "LOAN");
}