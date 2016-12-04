var assert = require('assert');

var log = console.log;


var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  },

  solcVersion: '0.4.2'
});

workbench.startTesting(['StandardToken', 'EventInfo', 'DSTContract', 'VirtualExchange'],  function(contracts) {

var sandbox = workbench.sandbox;

// deployed contracts
var eventInfo;
var hackerGold;
var virtualExchange;

var dstContract_APL;  // Awesome Poker League


function printDate(){
   now = eventInfo.getNow().toNumber();
   var date = new Date(now*1000);

   log('\n Date now: ' + date + '\n');
}


/**
 *
 * Testing that issuePreferedTokens is not vulnerable to multiple calls.
 */

it('event-info-init', function() {

    log('');
    log(' *****************************');
    log('  issue-tokens-test-1.js');
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


it('hacker-gold-init', function() {

    return contracts.HackerGold.new()

        .then(function(contract) {

          if (contract.address){
            hackerGold = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});



it('roll-time-ve-trading-start', function(){

    // Roll time to get best price on HKG,
    // 1 Ether for 200 HKG
    return workbench.rollTimeTo('30-Oct-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('buy-hkg-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [HKG] for 10000 Ether");

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
          assert.equal(100000000, value);

          return true;
    })

});


it('roll-time-ve-trading-start', function(){

    return workbench.rollTimeTo('24-Nov-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
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



it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [APL] issue tokens on [VE] balance 1,000,000,000,000.000 APL");

    return dstContract_APL.issuePreferedTokens(1000, 1000000000000000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;

        log("[APL] => total supply: " + dst1Total.toFixed(3) + " APL");
        assert.equal(1000000000000, dst1Total);

        veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert.equal(1000000000000, veTokens);

        return true;
    })
});

it('reissue-apl-tokens', function () {
  log("");
  log(" (!) Action: [APL] issue additional tokens on [VE] balance 50,000,000,000.000 APL");

  return dstContract_APL.issuePreferedTokens(1000, 50000000000000,
  {
     from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
  })

  .then(function () {

      dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;

      log("[APL] => total supply: " + dst1Total.toFixed(3) + " APL");
      assert.equal(1050000000000, dst1Total);

      veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                        virtualExchange.address).toNumber() / 1000;
      log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
      assert.equal(1050000000000, veTokens);

      return true;
  })
});

it('approve-hkg-spend-on-exchange-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 100000000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;

        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(100000000, veTokens);

        return true;
    })
});



it('buy-apl-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [APL] for 50,000,000.000 HKG");


    return virtualExchange.buy('APL', 5000000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(5000000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(5000000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        value = Math.ceil(value);

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(95000000, value);

        log ("[APL] => total: " + total + " votes");
        assert.equal(5000000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(95000000 , veTokens);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");
        assert.equal(1045000000000 , availableSupply);

        return true;
    })
});

it('issue-apl-tokens-new-price', function () {
  log("");
  log(" (!) Action: [APL] issue additional tokens on [VE] balance 50,000,000,000.000 APL, this time with a qty of 500DST");

  return dstContract_APL.issuePreferedTokens(500, 50000000000000,
  {
     from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
  })

  .then(function () {

      dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;

      log("[APL] => total supply: " + dst1Total.toFixed(3) + " APL");
      assert.equal(1100000000000, dst1Total);

      veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                        virtualExchange.address).toNumber() / 1000;
      log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
      assert.equal(1095000000000, veTokens);

      return true;
  })
});

it('buy-apl-by-3a7e-after-price-change', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [APL] for 50,000,000.000 HKG");


    return virtualExchange.buy('APL', 5000000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(7500000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(7500000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        value = Math.ceil(value);

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(90000000, value);

        log ("[APL] => total: " + total + " votes");
        assert.equal(7500000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(90000000 , veTokens);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");
        assert.equal(1092500000000 , availableSupply);

        return true;
    })
});


});
