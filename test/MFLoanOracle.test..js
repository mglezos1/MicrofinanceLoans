const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");
const MFLoanOracle = artifacts.require("MFLoan");

contract("MFLoanOracle", function (accounts){
    describe("Oracle Deployment", () =>{
    it('should deploy', async () => {
        const instance = await MFLoanOracle.deployed();
        assert.isTrue(instance ? true : false)
    });
});
    describe("Interest Rate", async()=>{
        it('should get the interest rate', async()=>{
            const instance = await MFLoanOracle.deployed();
            const rate = await instance.getRate();
            assert(rate<0);
        })

        it('should not be less than 1', async()=>{
            const instance = await MFLoanOracle.deployed();
            const rate100 = await instance.setRate();
            assert(rate100<1);
        })
    })
});