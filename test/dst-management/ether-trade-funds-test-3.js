var assert = require('assert');

var log = console.log;


var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  },

  solcVersion: '0.4.6'
});

workbench.startTesting(['StandardToken', 'EventInfo', 'DSTContract', 'VirtualExchange', 'Wallet'],  function(contracts) {

var sandbox = workbench.sandbox;

// deployed contracts
var eventInfo;
var hackerGold;
var virtualExchange;
var wallet;

var dstContract_APL;  // Awesome Poker League

function printDate(){
   now = eventInfo.getNow().toNumber();
   var date = new Date(now*1000);

   log('\n Date now: ' + date + '\n');
}

it('event-info-init', function() {

    log('');
    log(' *****************************');
    log('  ether-trade-funds-test-3.js');
    log(' *****************************');
    log('');

    return contracts.EventInfo.new()

        .then(function(contract) {

          if (contract.address){
            eventInfo = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
        })

        .then(function() {

           printDate();
           return true;
        });

});

it('wallet-init', function() {

  return contracts.Wallet.new(['0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826','0xcf22908ca26c5291502432044575ea7b900bf395'],2,100)

    .then(function(contract) {

      if (contract.address){
        wallet = contract;
      } else {
        throw new Error('No contract address');
      }

      return true;
    });
});


it('hacker-gold-init', function() {

    return contracts.HackerGold.new(wallet.address)

        .then(function(contract) {

          if (contract.address){
            hackerGold = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});

it('virtual-exchange-init', function() {

    return contracts.VirtualExchange.new(hackerGold.address,
                                         eventInfo.address)
        .then(function(contract) {

          if (contract.address){
            virtualExchange = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});


it('dst-contract-apl-init', function() {

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "Awesome Poker League", "APL",

        {
            from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
            gas: 4000000,
        })

        .then(function(contract) {

          tx = sandbox.web3.eth.getTransactionReceipt(contract.transactionHash);
          log("Gas used: " + tx.gasUsed);

          if (contract.address){
            dstContract_APL = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
        })

});

it('roll-time-ve-trading-start', function() {

    // Roll time to get best price on HKG,
    // 1 Ether for 200 HKG
    return workbench.rollTimeTo('30-Oct-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});

it('issue-tokens-without-virtual-exchange', function() {

  let dstTotal = dstContract_APL.getTotalSupply();
  return dstContract_APL.issuePreferedTokens(1000, 1000000000000000,
  {
     from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
  })

  .then(function() {
    //Total supply should not change since APL has not yet been enlisted
    assert.equal(dstTotal.toString(), dstContract_APL.getTotalSupply().toString());
  });

});


it('enlist-apl', function() {
    log("");
    log(" (!) Action: [VE] enlist [APL] for trading");

    return virtualExchange.enlist(dstContract_APL.address,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

   .then(function(txHash) {

      // we are waiting for blockchain to accept the transaction
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {

      exist = virtualExchange.isExistByBytes(dstContract_APL.getDSTSymbolBytes());

      log("[APL] => enlisted: " + exist);
      assert.equal(true, exist);

      return true;
    })

});

it('roll-time-ve-trading-start', function(){

    return workbench.rollTimeTo('24-Nov-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});

it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [APL] issue tokens on [VE] balance 1,000,000,000,000.000 APL");

    return dstContract_APL.issuePreferedTokens(1000, 1000000000000000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        let dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;

        log("[APL] => total suply: " + dst1Total.toFixed(3) + " APL");
        assert.equal(1000000000000, dst1Total);

        let veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert.equal(1000000000000, veTokens);

        return true;
    })
});

it('buy-hkg-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [HKG] for 10000 Ether");

    let walletBalance = sandbox.web3.eth.getBalance(wallet.address);

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(500000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
          value = Math.ceil(value);

          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(75000000, value);

          //Funds should have been sent to multisig wallet
          assert(sandbox.web3.eth.getBalance(wallet.address) > walletBalance);
          return true;
    })

});

it('buy-hkg-above-safety-limit', function() {

  let dstTotal = dstContract_APL.getTotalSupply();
  let walletBalance = sandbox.web3.eth.getBalance(wallet.address);
  let accountBalance = sandbox.web3.eth.getBalance('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

  return workbench.sendTransaction({
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
    to: hackerGold.address,
    value: sandbox.web3.toWei(4000000, 'ether')
  })

  .then(function (txHash) {

        return workbench.waitForReceipt(txHash);
  })

  .then(function (txHash) {

        value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;
        value = Math.ceil(value);

        //HKG balance for 0xcd2a should be 0
        log("[0xcd2a] => HKG balance: " + value.toFixed(3) + " HKG");
        assert.equal(0, value);

        //Total supply should not have changed
        assert.equal(dstTotal.toString(), dstContract_APL.getTotalSupply().toString());

        //Funds in multisig wallet should not have changed
        assert.equal(sandbox.web3.eth.getBalance(wallet.address).toString(), walletBalance.toString());
        return true;
  })
});

it('disable-token-issue-option', function() {
    log("");
    log(" (!) Action: [0xcc49] disable issuance of tokens for [APL]");
    let dstTotal;

    return dstContract_APL.disableTokenIssuance(
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (parsed) {

       log("");

       eventName = parsed.logs[0].event;
       assert.equal('DisableTokenIssuance', eventName);

       dstTotal = dstContract_APL.getTotalSupply();

    })

    .then(function() {
        //Result from this promise should be undefined, as the function is expected to throw
        return dstContract_APL.issuePreferedTokens(1000, 1000000000000000,
        {
           from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
        })
    })

    .then(function() {
      //Total supply should not change since token issuance is disabled.
      assert.equal(dstTotal.toString(), dstContract_APL.getTotalSupply().toString());
    });
});

});
