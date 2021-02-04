const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");
const MFLoan = artifacts.require("MFLoan");

contract("MFLoan", function (accounts) {
  describe("Initial Deployment", async () => {
    it("should deploy and assert a truthy instance", async () => {
      const instance = await MFLoan.deployed();
      assert.isTrue(instance ? true : false);
    });
  });
});