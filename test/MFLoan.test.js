const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");
const MFLoan = artifacts.require("MFLoan");

const zeroAddr = "0x0000000000000000000000000000000000000000";

const helpAreBNsEqual = (_left, _right) => {
  return new BigNumber(_left).isEqualTo(new BigNumber(_right));
};

const helpOwedAmt = _loanAmt => {
  interestRatePct = 1; // 1%
  return _loanAmt + (_loanAmt * interestRatePct / 100);
};

contract("MFLoan", function (accounts) {
  const addr0 = accounts[0];
  const addrBorrower = accounts[1];
  const addrBorrowerWrong = accounts[3];
  const addrLender = accounts[2];
  const loanAmt = 2e18; // 2 ETH
  const loanPaybackAmt = helpOwedAmt(loanAmt);
  const loanPaybackAmtTooLitte = 19e17; // 1.9 ETH
  const loanPaybackAmtTooMuch = 9e18; // 9 ETH
  const tokenIdExp = 0;
  const addrBorrowerBalExp = 1;
  const addrLenderBalExp = 0;

  describe("Initial Deployment", () => {
    it("should deploy and assert a truthy instance", async () => {
      const instance = await MFLoan.deployed();
      assert.isTrue(instance ? true : false);
    });
  });

  describe("Initial Functionality", () => {
    it("should confirmNewLoan()", async () => {
      const instance = await MFLoan.deployed();

      let tokenId;
      const tx = await instance.confirmNewLoan(addrBorrower, new BigNumber(loanAmt), { from: addrLender, value: new BigNumber(loanAmt) })
        .then(data => {
          tokenId = data.logs[0].args.tokenId;
          return data;
        })
      ;
      truffleAssert.eventEmitted(tx, "Transfer", {
        from: zeroAddr, // minted
        to: addrBorrower
      });
      assert.isTrue(helpAreBNsEqual(tokenId, tokenIdExp), `confirmNewLoan() tokenId '${tokenIdExp}' not expected '${tokenIdExp}'`);

      const addrBorrowerBal = await instance.balanceOf.call(addrBorrower, { from: addr0 });
      assert.equal(addrBorrowerBal, addrBorrowerBalExp, `borrower '${addrBorrower}' balanceOf '${addrBorrowerBal}' not expected '${addrBorrowerBalExp}'`);

      const addrLenderBal = await instance.balanceOf.call(addrLender, { from: addr0 });
      assert.equal(addrLenderBal, addrLenderBalExp, `lender '${addrLender}' balanceOf '${addrLenderBal}' not expected '${addrLenderBalExp}'`);
    });

    it("should getLoanOwedAmt()", async () => {
      const instance = await MFLoan.deployed();

      const loanOwedAmtExp = helpOwedAmt(loanAmt);
      const loanOwedAmt = await instance.getLoanOwedAmt.call(addrBorrower, { from: addr0 });
      assert.equal(loanOwedAmt, loanOwedAmtExp, `getLoanOwedAmt() '${loanOwedAmt}' not expected '${loanOwedAmtExp}'`);
    });
    
    it("should getLoan()", async () => {
      const instance = await MFLoan.deployed();

      const loanObjExp = {
        id: 0,
        borrower: addrBorrower,
        lender: addrLender,
        amountBorrowed: loanAmt,
        amountOwedToPayback: helpOwedAmt(loanAmt)
      };
      const loanObj = await instance.getLoan.call(addrBorrower, { from: addr0 })
        .then(data => ({
          id: data.id,
          borrower: data.borrower,
          lender: data.lender,
          amountBorrowed: data.amountBorrowed,
          amountOwedToPayback: data.amountOwedToPayback
        }))
      ;
      assert.equal(loanObj.id, loanObjExp.id, `getLoan() id '${loanObj.id}' not expected '${loanObjExp.id}'`);
      assert.equal(loanObj.borrower, loanObjExp.borrower, `getLoan() borrower '${loanObj.borrower}' not expected '${loanObjExp.borrower}'`);
      assert.equal(loanObj.lender, loanObjExp.lender, `getLoan() lender '${loanObj.lender}' not expected '${loanObjExp.lender}'`);
      assert.equal(loanObj.amountBorrowed, loanObjExp.amountBorrowed, `getLoan() amountBorrowed '${loanObj.amountBorrowed}' not expected '${loanObjExp.amountBorrowed}'`);
      assert.equal(loanObj.amountOwedToPayback, loanObjExp.amountOwedToPayback, `getLoan() amountOwedToPayback '${loanObj.amountOwedToPayback}' not expected '${loanObjExp.amountOwedToPayback}'`);
    });
  });

  describe("Reverts", () => {
    it("should be 'MFLoan: detected zero address'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.confirmNewLoan(zeroAddr, new BigNumber(loanAmt), { value: new BigNumber(loanAmt), from: addr0 }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: detected zero address"
      );
    });
    
    it("should be 'MFLoan: cannot borrow zero'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.confirmNewLoan(addr0, new BigNumber(0), { from: addr0 }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: cannot borrow zero"
      );
    });
    
    it("should be 'MFLoan: borrower already has a loan'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.confirmNewLoan(addrBorrower, new BigNumber(loanAmt), { value: new BigNumber(loanAmt), from: addrBorrower }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: borrower already has a loan"
      );
    });
    
    it("should be 'MFLoan: insufficient value provided for loan amount'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.confirmNewLoan(addr0, new BigNumber(loanAmt), { value: new BigNumber(loanPaybackAmtTooLitte), from: addr0 }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: insufficient value provided for loan amount"
      );
    });
    
    it("should be 'MFLoan: insufficient lender balance'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.confirmNewLoan(addr0, new BigNumber(98e18), { value: new BigNumber(98e18), from: addr0 }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: insufficient lender balance"
      );
    });
    
    it("should be 'MFLoan: no loan to payback'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.paybackLoan(new BigNumber(loanPaybackAmt), { value: new BigNumber(loanPaybackAmt), from: addrBorrowerWrong }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: no loan to payback"
      );
    });
    
    it("should be 'MFLoan: insufficient value provided for owed amount'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.paybackLoan(new BigNumber(loanPaybackAmtTooLitte), { value: new BigNumber(loanPaybackAmtTooLitte), from: addrBorrower }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: insufficient value provided for owed amount"
      );
    });

    it("should be 'MFLoan: invalid payback amount'", async () => {
      const instance = await MFLoan.deployed();

      await truffleAssert.fails(
        instance.paybackLoan(new BigNumber(loanPaybackAmtTooMuch), { value: new BigNumber(loanPaybackAmtTooMuch), from: addrBorrower }),
        truffleAssert.ErrorType.REVERT,
        "MFLoan: invalid payback amount"
      );
    });
  });

  describe("Payback Functionality", () => {
    it("should", async () => {
      const instance = await MFLoan.deployed();

      const tx = await instance.paybackLoan(new BigNumber(loanPaybackAmt), { value: new BigNumber(loanPaybackAmt), from: addrBorrower });
      truffleAssert.eventEmitted(tx, "Approval", {
        owner: addrBorrower,
        approved: zeroAddr // to burn
      });
      truffleAssert.eventEmitted(tx, "Transfer", {
        from: addrBorrower,
        to: zeroAddr // burnt
      });
    });
  });
});
