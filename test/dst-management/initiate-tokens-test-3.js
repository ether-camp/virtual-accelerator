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
var dstContract_FBX;  // Filmbox
var dstContract_GOG;  // Gog and Magog
var dstContract_AMZ;  // Auto Motor Zone

function printDate(){
   now = eventInfo.getNow().toNumber();
   var date = new Date(now*1000);

   log('\n Date now: ' + date + '\n');
}


/**
 *
 * Testing for issue project token series:
 *
 *     1.
 *     2.
 *     3.
 *
 *    ... todo detailed description
 */

it('event-info-init', function() {


    log('');
    log(' ***************************');
    log('  initiate-tokens-test-3.js ');
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
    log(" (!) Action: [0x3a7e] buy [HKG] for 10000 Ether");

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);

          return true;
    })

});


it('buy-hkg-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy [HKG] for 10,000.000 Ether");

    return workbench.sendTransaction({
      from: '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;

          log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);

          return true;
    })

});


it('buy-hkg-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy [HKG] for 5000.000 Ether");

    return workbench.sendTransaction({
      from: '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;

          log("[0x696b] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);

          return true;
    })

});


it('buy-hkg-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] buy [HKG] for 5000.000 Ether");

    return workbench.sendTransaction({
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;

          log("[0xcd2a] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);

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


it('dst-contract-fbx-init', function() {

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "Filmbox", "FBX",

        {
            from : '0xcf22908ca26c5291502432044575ea7b900bf395'
        })

        .then(function(contract) {

          if (contract.address){
            dstContract_FBX = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});



it('dst-contract-gog-init', function() {

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "Gog and Magog", "GOG",

        {
            from : '0xba33cc5dd6a60c891bcf93fbac8f13ee7512435f'
        })

        .then(function(contract) {

          if (contract.address){
            dstContract_GOG = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});

it('dst-contract-amz-init', function() {

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "Gog and Maamz", "AMZ",

        {
            from : '0xdb5918d9282f0b280aac6bde061b92e903e11d18'
        })

        .then(function(contract) {

          if (contract.address){
            dstContract_AMZ = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
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

      exist = virtualExchange.isExistByString(dstContract_APL.getDSTSymbol());

      log("[APL] => enlisted: " + exist);
      assert.equal(true, exist);

      return true;
    })

});


it('enlist-fbx', function() {
    log("");
    log(" (!) Action: [VE] enlist [FBX] for trading");

    return virtualExchange.enlist(dstContract_FBX.address,
    {
       from : '0xcf22908ca26c5291502432044575ea7b900bf395',
    })

   .then(function(txHash) {

      // we are waiting for blockchain to accept the transaction
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {

      exist = virtualExchange.isExistByString(dstContract_FBX.getDSTSymbol());

      log("[FBX] => enlisted: " + exist);
      assert.equal(true, exist);

      return true;
    })

});


it('enlist-gog', function() {
    log("");
    log(" (!) Action: [VE] enlist [GOG] for trading");

    return virtualExchange.enlist(dstContract_GOG.address,
    {
       from : '0xba33cc5dd6a60c891bcf93fbac8f13ee7512435f',
    })

   .then(function(txHash) {

      // we are waiting for blockchain to accept the transaction
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {

      exist = virtualExchange.isExistByString(dstContract_GOG.getDSTSymbol());

      log("[GOG] => enlisted: " + exist);
      assert.equal(true, exist);

      return true;
    })

});



it('enlist-amz', function() {
    log("");
    log(" (!) Action: [VE] enlist [AMZ] for trading");

    return virtualExchange.enlist(dstContract_AMZ.address,
    {
       from : '0xdb5918d9282f0b280aac6bde061b92e903e11d18',
    })

   .then(function(txHash) {

      // we are waiting for blockchain to accept the transaction
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {

      exist = virtualExchange.isExistByString(dstContract_AMZ.getDSTSymbol());

      log("[AMZ] => enlisted: " + exist);
      assert.equal(true, exist);

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

        log("[APL] => total suply: " + dst1Total.toFixed(3) + " APL");
        assert(1000000000000, dst1Total);

        veTokens = dstContract_APL.allowance(dstContract_APL.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert(1000000000000, veTokens);

        return true;
    })
});


it('issue-fbx-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [FBX] issue tokens on [VE] balance 1,000,000,000,000.000 FBX");

    return dstContract_FBX.issuePreferedTokens(1000, 1000000000000,
    {
       from : '0xcf22908ca26c5291502432044575ea7b900bf395',
    })

    .then(function () {

        dst1Total = dstContract_FBX.getTotalSupply().toNumber() / 1000;

        log("[FBX] => total suply: " + dst1Total.toFixed(3) + " FBX");
        assert(1000000000000, dst1Total);

        veTokens = dstContract_FBX.allowance(dstContract_FBX.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[FBX] => total on VirtualExchange: " + veTokens.toFixed(3) + " FBX");
        assert(1000000000000, veTokens);

        return true;
    })
});


it('issue-gog-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [GOG] issue tokens on [VE] balance 1,000,000,000,000.000 GOG");

    return dstContract_GOG.issuePreferedTokens(1000, 1000000000000,
    {
       from : '0xba33cc5dd6a60c891bcf93fbac8f13ee7512435f',
    })

    .then(function () {

        dst1Total = dstContract_GOG.getTotalSupply().toNumber() / 1000;

        log("[GOG] => total suply: " + dst1Total.toFixed(3) + " GOG");
        assert(1000000000000, dst1Total);

        veTokens = dstContract_GOG.allowance(dstContract_GOG.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[GOG] => total on VirtualExchange: " + veTokens.toFixed(3) + " GOG");
        assert(1000000000000, veTokens);

        return true;
    })
});




it('issue-amz-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [AMZ] issue tokens on [VE] balance 1,000,000,000,000.000 AMZ");

    return dstContract_AMZ.issuePreferedTokens(1000, 1000000000000,
    {
       from : '0xdb5918d9282f0b280aac6bde061b92e903e11d18',
    })

    .then(function () {

        dst1Total = dstContract_AMZ.getTotalSupply().toNumber() / 1000;

        log("[AMZ] => total suply: " + dst1Total.toFixed(3) + " AMZ");
        assert(1000000000000, dst1Total);

        veTokens = dstContract_AMZ.allowance(dstContract_AMZ.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[AMZ] => total on VirtualExchange: " + veTokens.toFixed(3) + " AMZ");
        assert(1000000000000, veTokens);

        return true;
    })
});



it('approve-hkg-spend-on-exchange-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 2000000000,
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
        assert.equal(2000000, veTokens);

        return true;
    })
});


it('approve-hkg-spend-on-exchange-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] move to [VE] balance 2,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 2000000000,
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
        assert.equal(2000000, veTokens);

        return true;
    })
});


it('approve-hkg-spend-on-exchange-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 2000000000,
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
        assert.equal(2000000, veTokens);

        return true;
    })
});



it('approve-hkg-spend-on-exchange-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] move to [VE] balance 1,000,000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 2000000000,
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
        assert.equal(2000000, veTokens);

        return true;
    })
});


it('buy-apl-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [APL] for 300,000.000 HKG");


    return virtualExchange.buy('APL', 300000000,
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
        assert.equal(300000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(300000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1700000, value);

        log ("[APL] => total: " + total + " votes");
        assert.equal(300000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1700000 , veTokens);

        availableSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available suply: " + availableSuply + " APL");
        assert.equal(700000000 , availableSuply);

        return true;
    })
});




it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [APL] price change to 0.5 APL for 1 HKG ");

    return dstContract_APL.setHKGPrice(500,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        qtyForOneHkg = dstContract_APL.getHKGPrice().toNumber() / 1000;

        log("[APL] => price 1 HKG = " + qtyForOneHkg + " APL");


        //...todo check the event

        return true;
    })
});



// ...
// [X] Action: [APL] price change by mal actor.
// ...

it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" [X] Action: [APL] price change by mal actor ");

    return dstContract_APL.setHKGPrice(50000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
    })

    .then(function () {

        qtyForOneHkg = dstContract_APL.getHKGPrice().toNumber() / 1000;

        log("[APL] => price 1 HKG = " + qtyForOneHkg + " APL");

        return true;
    })
});



it('buy-apl-by-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy tokens [APL] for 1,400,000.000 HKG");


    return virtualExchange.buy('APL', 1400000000,
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
        assert.equal(700000000 , dst1Balance);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');

        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(700000000000 , voting);

        value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;

        log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(600000, value);

        log ("[APL] => total: " + total + " votes");

        veTokens = hackerGold.allowance('0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x2980] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(600000 , veTokens);

        availableSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available suply: " + availableSuply + " APL");


        log("");
        log(" Voting Summary: ");
        log(" =============== ");

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(30, voting / total * 100);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');

        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(70, voting / total * 100);

        value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected: " + value.toFixed(3) + " HKG");
        assert.equal(1700000, value);

        return true;
    })
});




it('buy-fbx-by-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy tokens [FBX] for 480,000.000 HKG");


    return virtualExchange.buy('FBX', 480000000,
    {
       from : '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_FBX.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " FBX");
        assert.equal(480000000 , dst1Balance);

        total  = dstContract_FBX.getPreferedQtySold();
        voting = dstContract_FBX.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(480000000000 , voting);

        value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1520000, value);

        log ("[FBX] => total: " + total + " votes");
        assert.equal(480000000000, total);

        veTokens = hackerGold.allowance('0x696ba93ef4254da47ff05b6caa88190db335f1c3',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x696b] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1520000 , veTokens);

        availableSuply = dstContract_FBX.balanceOf(dstContract_FBX.address).toNumber() / 1000;
        log("[FBX] => available suply: " + availableSuply + " FBX");
        assert.equal(520000000 , availableSuply);

        return true;
    })
});



it('buy-fbx-by-0xcd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] buy tokens [FBX] for 520,000.000 HKG");


    return virtualExchange.buy('FBX', 520000000,
    {
       from : '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_FBX.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " FBX");
        assert.equal(520000000 , dst1Balance);

        total  = dstContract_FBX.getPreferedQtySold();
        voting = dstContract_FBX.votingRightsOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(520000000000 , voting);

        value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1480000, value);

        log ("[FBX] => total: " + total + " votes");
        assert.equal(1000000000000, total);

        veTokens = hackerGold.allowance('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x696b] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1480000 , veTokens);

        availableSuply = dstContract_FBX.balanceOf(dstContract_FBX.address).toNumber() / 1000;
        log("[FBX] => available suply: " + availableSuply + " FBX");
        assert.equal(0 , availableSuply);

        log("");
        log(" Voting Summary: ");
        log(" =============== ");

        total  = dstContract_FBX.getPreferedQtySold();
        voting = dstContract_FBX.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(48, voting / total * 100);

        total  = dstContract_FBX.getPreferedQtySold();
        voting = dstContract_FBX.votingRightsOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(52, voting / total * 100);

        value = hackerGold.balanceOf(dstContract_FBX.address).toNumber() / 1000;
        log("[FBX] => collected: " + value.toFixed(3) + " HKG");
        assert.equal(1000000, value);

        return true;
    })
});


it('buy-gog-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [GOG] for 100,000.000 HKG");


    return virtualExchange.buy('GOG', 100000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_GOG.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " GOG");
        assert.equal(100000000 , dst1Balance);

        total  = dstContract_GOG.getPreferedQtySold();
        voting = dstContract_GOG.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(100000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1600000, value);

        log ("[GOG] => total: " + total + " votes");
        assert.equal(100000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1600000 , veTokens);

        availableSuply = dstContract_GOG.balanceOf(dstContract_GOG.address).toNumber() / 1000;
        log("[GOG] => available suply: " + availableSuply + " GOG");
        assert.equal(900000000 , availableSuply);

        return true;
    })
});



it('change-price-gog-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [GOG] price change to 2 GOG for 1 HKG ");

    return dstContract_GOG.setHKGPrice(2000,
    {
       from : '0xba33cc5dd6a60c891bcf93fbac8f13ee7512435f',
    })

    .then(function () {

        qtyForOneHkg = dstContract_GOG.getHKGPrice().toNumber() / 1000;

        log("[GOG] => price 1 HKG = " + qtyForOneHkg + " GOG");
        assert.equal(2, qtyForOneHkg.toFixed(3));

        //...todo check the event

        return true;
    })
});


it('buy-gog-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [GOG] for 300,000.000 HKG");


    return virtualExchange.buy('GOG', 300000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract_GOG.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " GOG");
        assert.equal(700000000 , dst1Balance);

        total  = dstContract_GOG.getPreferedQtySold();
        voting = dstContract_GOG.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(700000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1300000, value);

        log ("[GOG] => total: " + total + " votes");
        assert.equal(700000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1300000 , veTokens);

        availableSuply = dstContract_GOG.balanceOf(dstContract_GOG.address).toNumber() / 1000;
        log("[GOG] => available suply: " + availableSuply + " GOG");
        assert.equal(300000000 , availableSuply);

        return true;
    })
});



it('change-price-gog-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [GOG] price change to 1 GOG for 1 HKG ");

    return dstContract_GOG.setHKGPrice(1000,
    {
       from : '0xba33cc5dd6a60c891bcf93fbac8f13ee7512435f',
    })

    .then(function () {

        qtyForOneHkg = dstContract_GOG.getHKGPrice().toNumber() / 1000;

        log("[GOG] => price 1 HKG = " + qtyForOneHkg + " GOG");
        assert.equal(1, qtyForOneHkg.toFixed(3));

        //...todo check the event

        return true;
    })
});




it('buy-gog-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [GOG] for 300,000.000 HKG");


    return virtualExchange.buy('GOG', 300000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        dst1Balance = dstContract_GOG.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " GOG");
        assert.equal(1000000000 , dst1Balance);

        total  = dstContract_GOG.getPreferedQtySold();
        voting = dstContract_GOG.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(1000000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1000000, value);

        log ("[GOG] => total: " + total + " votes");
        assert.equal(1000000000000, total);

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1000000 , veTokens);

        availableSuply = dstContract_GOG.balanceOf(dstContract_GOG.address).toNumber() / 1000;
        log("[GOG] => available suply: " + availableSuply + " GOG");
        assert.equal(0 , availableSuply);


        log("");
        log(" Voting Summary: ");
        log(" =============== ");

        total  = dstContract_GOG.getPreferedQtySold();
        voting = dstContract_GOG.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(100, voting / total * 100);




        return true;
    })
});



it('roll-time-va-ends', function(){

    return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});




it('end-event-summary', function() {
    log("");

    //var dstContract_APL;  // Awesome Poker League
    //var dstContract_FBX;  // Filmbox
    //var dstContract_GOG;  // Gog and Magog
    //var dstContract_AMZ;  // Auto Motor Zone

    log("Post Event Summary:");
    log("===================");

    value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;

    dollarValue = value / 100;
    log("[APL] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(17000, dollarValue);

    value = hackerGold.balanceOf(dstContract_FBX.address).toNumber() / 1000;

    dollarValue = value / 100;
    log("[FBX] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(10000, dollarValue);

    value = hackerGold.balanceOf(dstContract_GOG.address).toNumber() / 1000;

    dollarValue = value / 100;
    log("[GOG] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(7000, dollarValue);


    value = hackerGold.balanceOf(dstContract_AMZ.address).toNumber() / 1000;

    dollarValue = value / 100;
    log("[AMZ] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(0, dollarValue);


    return true;
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
        log("[APL] => available suply: " + issued.toFixed(3) + " APL");
        assert.equal(1000000 , issued);

        return true;
    })
});



it('issue-fbx-tokens-seria-2', function() {
    log("");
    log(" (!) Action: [FBX] issue tokens: 1000000.000 FBX");

    return dstContract_FBX.issueTokens(20, 1000000000,
    {
       from : '0xcf22908ca26c5291502432044575ea7b900bf395',
    })

    .then(function () {

        dst1Total = dstContract_FBX.getTotalSupply().toNumber() / 1000;
        log("[FBX] => total: " + dst1Total.toFixed(3) + " FBX");
        assert.equal(1001000000 , dst1Total);

        issued = dstContract_FBX.balanceOf(dstContract_FBX.address).toNumber() / 1000;
        log("[FBX] => available suply: " + issued.toFixed(3) + " FBX");
        assert.equal(1000000 , issued);

        return true;
    })
});



it('issue-gog-tokens-seria-2', function() {
    log("");
    log(" (!) Action: [GOG] issue tokens: 1000000.000 GOG");

    return dstContract_GOG.issueTokens(250, 1000000000,
    {
       from : '0xba33cc5dd6a60c891bcf93fbac8f13ee7512435f',
    })

    .then(function () {

        dst1Total = dstContract_GOG.getTotalSupply().toNumber() / 1000;
        log("[GOG] => total: " + dst1Total.toFixed(3) + " GOG");
        assert.equal(1001000000 , dst1Total);

        issued = dstContract_GOG.balanceOf(dstContract_GOG.address).toNumber() / 1000;
        log("[GOG] => available suply: " + issued.toFixed(3) + " GOG");
        assert.equal(1000000 , issued);

        return true;
    })
});





it('buy-all-apl-suply-seria-2', function() {
    log("");
    log(" (!) Action: [0xdedb] buy [APL] tokens for: 10000.000 Ether");

    return workbench.sendTransaction({
      from: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
      to: dstContract_APL.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract_APL.balanceOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').toNumber() / 1000;
        log("[0xdedb] => balance: " + dst1Total + " APL");
        assert.equal(1000000 , dst1Total);

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');

        log("[0xdedb] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(0, voting / total * 100);

        tokensSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber();
        log("[APL] => available suply: " + tokensSuply + " APL");
        assert.equal(0, tokensSuply);

        log("");

        etherCollected =
          dstContract_APL.getEtherValue().toNumber() / 1000000000000000000;
        log("[APL] => balance: " + etherCollected + " Ether");
        assert.equal(10000, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(1700000, hkgCollected);

        return true;
    })

});







it('buy-all-fbx-suply-seria-2', function() {
    log("");
    log(" (!) Action: [0xdedb] buy [FBX] tokens for: 50000.000 Ether");

    return workbench.sendTransaction({
      from: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
      to: dstContract_FBX.address,
      value: sandbox.web3.toWei(50001, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract_FBX.balanceOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').toNumber() / 1000;
        dst1Total = Math.ceil(dst1Total);

        log("[0xdedb] => balance: " + dst1Total + " FBX");
        assert.equal(1000000 , dst1Total);

        total  = dstContract_FBX.getPreferedQtySold();
        voting = dstContract_FBX.votingRightsOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');

        log("[0xdedb] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(0, voting / total * 100);

        tokensSuply = dstContract_FBX.balanceOf(dstContract_FBX.address).toNumber();
        log("[FBX] => available suply: " + tokensSuply + " FBX");
        assert.equal(0, tokensSuply);

        log("");

        etherCollected =
          dstContract_FBX.getEtherValue().toNumber() / 1000000000000000000;
        etherCollected = Math.ceil(etherCollected)
        log("[FBX] => balance: " + etherCollected + " Ether");

        assert.equal(50000, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract_FBX.address).toNumber() / 1000;
        log("[FBX] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(1000000, hkgCollected);

        return true;
    })

});




it('buy-all-gog-suply-seria-2', function() {
    log("");
    log(" (!) Action: [0xdedb] buy [GOG] tokens for: 4000 Ether");

    return workbench.sendTransaction({
      from: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
      to: dstContract_GOG.address,
      value: sandbox.web3.toWei(4000, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract_GOG.balanceOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').toNumber() / 1000;
        dst1Total = Math.ceil(dst1Total);

        log("[0xdedb] => balance: " + dst1Total + " GOG");
        assert.equal(1000000 , dst1Total);

        total  = dstContract_GOG.getPreferedQtySold();
        voting = dstContract_GOG.votingRightsOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');

        log("[0xdedb] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(0, voting / total * 100);

        tokensSuply = dstContract_GOG.balanceOf(dstContract_GOG.address).toNumber();
        log("[GOG] => available suply: " + tokensSuply + " GOG");
        assert.equal(0, tokensSuply);

        log("");

        etherCollected =
          dstContract_GOG.getEtherValue().toNumber() / 1000000000000000000;
        etherCollected = Math.ceil(etherCollected)
        log("[GOG] => balance: " + etherCollected + " Ether");

        assert.equal(4000, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract_GOG.address).toNumber() / 1000;
        log("[GOG] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(700000, hkgCollected);

        return true;
    })

});



it('end-sale-summary', function() {
    log("");

    //var dstContract_APL;  // Awesome Poker League
    //var dstContract_FBX;  // Filmbox
    //var dstContract_GOG;  // Gog and Magog
    //var dstContract_AMZ;  // Auto Motor Zone

    log("Post Event Summary:");
    log("===================");

    value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;

    dollarValue = value / 100;
    log("[APL] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(17000, dollarValue);

    etherCollected =
          dstContract_APL.getEtherValue().toNumber() / 1000000000000000000;
    log("[APL] => collected: " + etherCollected + " Ether" + " = $" + etherCollected * 12);
    assert.equal(10000, etherCollected);

    log("");

    value = hackerGold.balanceOf(dstContract_FBX.address).toNumber() / 1000;

    dollarValue = value / 100;
    log("[FBX] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(10000, dollarValue);

    value = hackerGold.balanceOf(dstContract_GOG.address).toNumber() / 1000;

    etherCollected =
          dstContract_FBX.getEtherValue().toNumber() / 1000000000000000000;
    etherCollected = Math.ceil(etherCollected);

    log("[FBX] => collected: " + etherCollected + " Ether" + " = $" + etherCollected * 12);
    assert.equal(50000, etherCollected);

    log("");

    dollarValue = value / 100;
    log("[GOG] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(7000, dollarValue);

    etherCollected =
          dstContract_GOG.getEtherValue().toNumber() / 1000000000000000000;
    etherCollected = Math.ceil(etherCollected);

    log("[GOG] => collected: " + etherCollected + " Ether" + " = $" + etherCollected * 12);
    assert.equal(4000, etherCollected);

    return true;
});



});
