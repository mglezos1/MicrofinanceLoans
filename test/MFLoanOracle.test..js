//not done just wanted to push something before going to bed

const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");
const MFOracle = artifacts.require("MFLoadOracle");

contract("interestRate", (accounts)=>{
    it('should deploy', async () => {
        const interestInstance = await interestRate.deployed();
        assert.isTrue(instance ? true : false)
      });
    it('should get the interest rate', async()=>{
        const insertInstance = await interestRate.deployed();
    })
})