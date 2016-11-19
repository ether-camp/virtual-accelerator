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
 * Testing for issue project DST token series:
 *
 *     1.  Enlist the APL token
 *     2.  Issue 1,000,000,000,000.000 APL tokens
 *     3.  [0x3a7e] Buy 250,000,000.000 APL => 25%
 *     4.  [0x2980] Buy 300,000,000.000 APL => 30%
 *     5.  [0x696b] Buy  50,000,000.000 APL =>  5%
 *     6.  [0xcd2a] Buy 400,000,000.000 APL => 40%
 *
 */

it('event-info-init', function() {


    log('');
    log(' ***************************');
    log('  initiate-tokens-test-2.js ');
    log(' ***************************');
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
    log(" (!) Action: [0x3a7e] buy [HKG] for 5000.000 Ether");

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);

          return true;
    })

});


it('buy-hkg-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy [HKG] for 5000.000 Ether");

    return workbench.sendTransaction({
      from: '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;

          log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);

          return true;
    })

});


it('buy-hkg-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy [HKG] for 5000.000 Ether");

    return workbench.sendTransaction({
      from: '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;

          log("[0x696b] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);

          return true;
    })

});


it('buy-hkg-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] buy [HKG] for 5000.000 Ether");

    return workbench.sendTransaction({
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;

          log("[0xcd2a] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);

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
            from : '0xcc49bea5129ef2369ff81b0c0200885893979b77'
        })

        .then(function(contract) {

          if (contract.address){
            dstContract_APL = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});

// ...
// [X] Action [VE] enlist not by the owner
// ...

it('enlist-not-by-the-owner', function() {
    log("");
    log(" [X] Action [VE] enlist not by the owner");

    return virtualExchange.enlist(dstContract_APL.address,
    {
       from : '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
    })

   .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {

      exist = virtualExchange.isExistByString(dstContract_APL.getDSTSymbol());

      log("[APL] => enlisted: " + exist);
      assert.equal(false, exist);

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

      exist = virtualExchange.isExistByString(dstContract_APL.getDSTSymbol());

      log("[APL] => enlisted: " + exist);
      assert.equal(true, exist);

      return true;
    })

});



it('approve-hkg-spend-on-exchange-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 1000000000,
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
        assert.equal(1000000, veTokens);

        return true;
    })
});


it('approve-hkg-spend-on-exchange-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 1000000000,
    {
       from : '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        veTokens = hackerGold.allowance('0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
                                          virtualExchange.address).toNumber() / 1000;

        log("[0x2980] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1000000, veTokens);

        return true;
    })
});


it('approve-hkg-spend-on-exchange-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 1000000000,
    {
       from : '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        veTokens = hackerGold.allowance('0x696ba93ef4254da47ff05b6caa88190db335f1c3',
                                          virtualExchange.address).toNumber() / 1000;

        log("[0x696b] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1000000, veTokens);

        return true;
    })
});



it('approve-hkg-spend-on-exchange-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 1000000000,
    {
       from : '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        veTokens = hackerGold.allowance('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
                                          virtualExchange.address).toNumber() / 1000;

        log("[0xcd2a] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1000000, veTokens);

        return true;
    })
});



// ...
// [X] Action [0xdedb] issue tokens for [APL] not by the owner .
// ...

it('issue-apl-tokens-not-by-the-owner', function() {
    log("");
    log(" [X] Action [0xdedb] issue tokens for [APL] not by the owner");

    return dstContract_APL.issuePreferedTokens(1000, 1000000000000,
    {
       from : '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
    })

    .then(function () {

        dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;

        log("[APL] => total supply: " + dst1Total.toFixed(3) + " APL");
        assert.equal("0.000", dst1Total.toFixed(3));

        veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert.equal("0.000", dst1Total.toFixed(3));

        return true;
    })
});



it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [APL] issue tokens on [VE] balance 1,000,000,000,000.000 APL");

    return dstContract_APL.issuePreferedTokens(1000, 1000000000000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;

        log("[APL] => total supply: " + dst1Total.toFixed(3) + " APL");
        assert.equal(1000000000, dst1Total);

        veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert.equal(1000000000, veTokens);

        return true;
    })
});


// ...
// [X] Action [0xdedb] buy [APL] tokens on [VE] with no HKG  .
// ...

it('buy-apl-by-3a7e', function() {
    log("");
    log(" [X] Action [0xdedb] buy [APL] tokens on [VE] with no HKG");


    return virtualExchange.buy('APL', 10000,
    {
       from : '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').toNumber() / 1000;

        log("[0xdedb] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(0, dst1Balance);

        return true;
    })
});



it('buy-apl-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [APL] for 250,000.000 HKG");


    return virtualExchange.buy('APL', 250000000,
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
        assert.equal(250000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(250000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(750000, value);

        log ("[APL] => total: " + total + " votes");
        assert.equal(250000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(750000 , veTokens);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");
        assert.equal(750000000 , availableSupply);

        return true;
    })
});




it('buy-apl-by-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy tokens [APL] for 300,000.000 HKG");


    return virtualExchange.buy('APL', 300000000,
    {
       from : '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;

        log("[0x2980] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(300000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');

        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(300000000000 , voting);

        value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;

        log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(700000, value);

        log ("[APL] => total: " + total + " votes");

        veTokens = hackerGold.allowance('0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x2980] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(700000 , veTokens);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");

        return true;
    })
});



it('buy-apl-by-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy tokens [APL] for 50,000.000 HKG");


    return virtualExchange.buy('APL', 50000000,
    {
       from : '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;

        log("[0x696b] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(50000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3');

        log ("[0x696b] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(50000000000 , voting);

        value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;

        log("[0x696b] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(950000, value);

        log ("[APL] => total: " + total + " votes");

        veTokens = hackerGold.allowance('0x696ba93ef4254da47ff05b6caa88190db335f1c3',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x2980] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(950000 , veTokens);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");

        return true;
    })
});



it('buy-apl-by-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] buy tokens [APL] for 400,000.000 HKG");


    return virtualExchange.buy('APL', 400000000,
    {
       from : '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;

        log("[0xcd2a] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(400000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

        log ("[0xcd2a] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(400000000000 , voting);

        value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;

        log("[0xcd2a] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(600000, value);

        log ("[APL] => total: " + total + " votes");

        veTokens = hackerGold.allowance('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0xcd2a] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(600000, veTokens);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");

        return true;
    })

    .then(function (txHash) {

        log("");
        log(" Voting Summary: ");
        log(" =============== ");

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(25, voting / total * 100);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');

        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(30, voting / total * 100);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3');

        log ("[0x696b] => voting: " + voting + "  votes - " + voting / total * 100 + "%");
        assert.equal(5, voting / total * 100);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

        log ("[0xcd2a] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(40, voting / total * 100);

        log ("[APL] => total: " + total + " votes");
        assert.equal(1000000000000, total);

        availableSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + availableSupply + " APL");
        assert.equal(0, availableSupply);


        etherCollected =
          dstContract_APL.getEtherValue().toNumber() / 1000000000000000000;
        log("[APL] => balance: " + etherCollected + " Ether");
        assert.equal(0, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(1000000, hkgCollected);

        return true;

    })


});



it('roll-time-event-stops', function(){

    return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});




it('issue-apl-tokens-seria-2', function() {
    log("");
    log(" (!) Action: [APL] issue tokens: 1000000.000 APL");

    return dstContract_APL.issueTokens(100, 1000000000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;
        log("[APL] => total: " + dst1Total.toFixed(3) + " APL");
        assert.equal(1001000000 , dst1Total);

        issued = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available supply: " + issued.toFixed(3) + " APL");
        assert.equal(1000000 , issued);

        return true;
    })
});



it('buy-all-apl-supply-seria-2', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [APL] tokens for: 10000.000 Ether");

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: dstContract_APL.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract_APL.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        log("[0x3a7e] => balance: " + dst1Total + " APL");
        assert.equal(251000000 , dst1Total);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(25, voting / total * 100);

        tokensSupply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber();
        log("[APL] => available supply: " + tokensSupply + " APL");
        assert.equal(0, tokensSupply);

        log("");

        etherCollected =
          dstContract_APL.getEtherValue().toNumber() / 1000000000000000000;
        log("[APL] => balance: " + etherCollected + " Ether");
        assert.equal(10000, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(1000000, hkgCollected);


        return true;
    })

});


// ...
// [X] Action [0x36ce] buy with ether [APL] non existing tokens
// ...

it('buy-tokens-with-no-ether', function() {
    log("");
    log(" [X] Action [0x36ce] buy with ether [APL] non existing tokens.");

    return workbench.sendTransaction({
      from: '0x36cef404bd674e1aa6ba6b444c9ef458460c9871',
      to: dstContract_APL.address,
      value: sandbox.web3.toWei(1, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract_APL.balanceOf('0x36cef404bd674e1aa6ba6b444c9ef458460c9871').toNumber() / 1000;
        log("[0x36ce] => balance: " + dst1Total + " APL");
        assert.equal(0, dst1Total);

        return true;
    })

});



it('disable-token-issuance', function() {
    log("");
    log(" (!) Action: [0x3a7e] disable [APL] tokens issueance option");

   return dstContract_APL.disableTokenIssuance(
   {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
   })

   .then(function () {

        etherCollected =
          dstContract_APL.getEtherValue().toNumber() / 1000000000000000000;
        log("[APL] => balance: " + etherCollected + " Ether");
        assert.equal(10000, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(1000000, hkgCollected);

        return true;
   })
});


});
