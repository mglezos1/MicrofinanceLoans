const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");
const MFLoanOracle = artifacts.require("MFLoanOracle");

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
            assert.isTrue(rate > 0, "zero rate");
        })

        it('should set the interest rate', async()=>{
            const instance = await MFLoanOracle.deployed();
            const rate100Expected = 100 * 2;
            const rate100 = await instance.setRate(new BigNumber(rate100Expected), { from: accounts[0] });
            assert.isTrue(new BigNumber(rate100Expected).isEqualTo(rate100Expected), `rate100 ${rate100} not expected ${rate100Expected}`);
        })
    })
});