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
var dstContract1;
var dstContract2;

function printDate(){
   now = eventInfo.getNow().toNumber();
   var date = new Date(now*1000);

   log('\n Date now: ' + date + '\n');
}


/**
 *
 * Testing for issue project token series:
 *
 *    [MK3]
 *
 *     1.  issue  150.000 preffered  1.000 HKG for 1.000 MK3
 *     2.  issue 1250.000 preffered  1.000 HKG for 2.000 MK3
 *     3.  issue 1000.000            1.0 Ether for 1.000 MK3
 *     4.  disabled any issuence of the tokens
 *
 */

it('event-info-init', function() {


    log('');
    log(' ***************************');
    log('  initiate-tokens-test-1.js ');
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


it('roll-time-ve-trading-start', function(){

    return workbench.rollTimeTo('24-Nov-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
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


it('dst-contract-mk3-init', function() {

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "MerkleTree", "MK3",

        {
            from : '0xcc49bea5129ef2369ff81b0c0200885893979b77'
        })

        .then(function(contract) {

          if (contract.address){
            dstContract1 = contract;
          } else {
            throw new Error('No contract address');
          }

          return true;
    });
});



it('enlist-mk3', function() {
    log("");
    log(" (!) Action: [VE] enlist [MK3] for trading");

    return virtualExchange.enlist(dstContract1.address,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

   .then(function(txHash) {

      // we are waiting for blockchain to accept the transaction
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {

      exist = virtualExchange.isExistByString(dstContract1.getDSTSymbol());

      log("[MK3] => enlisted: " + exist);
      assert.equal(true, exist);

      return true;
    })

});



it('issue-mk3-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [MK3] issue tokens on [VE] balance 150.000 MK3");

    return dstContract1.issuePreferedTokens(1, 150000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        dst1Total = dstContract1.getTotalSupply().toNumber() / 1000;

        log("[MK3] => total supply: " + dst1Total.toFixed(3) + " MK3");
        assert.equal(150, dst1Total);

        veTokens = dstContract1.allowance(dstContract1.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[MK3] => total on VirtualExchange: " + veTokens.toFixed(3) + " MK3");
        assert.equal(150, veTokens);

        return true;
    })
});



it('buy-hkg-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [HKG] for 1500.000 Ether");

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(1500, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(225000, value);

          return true;
    })

});



it('approve-hkg-spend-on-exchange-1', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 150.000 HKG");

    return hackerGold.approve(virtualExchange.address, 150000,
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
        assert.equal(150, veTokens);

        return true;
    })
});




it('buy-all-dst-supply-seria-1', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [MK3] for 150.000 HKG");


    return virtualExchange.buy('MK3', 150000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        dst1Balance = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " MK3");
        assert.equal(150 , dst1Balance);

        total  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(150000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(224850, value);

        log ("[MK3] => total: " + total + " votes");

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(0 , veTokens);

        return true;
    })
});



it('approve-hkg-spend-on-exchange-2', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 1000.000 HKG");

    return hackerGold.approve(virtualExchange.address, 1000000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber();
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1000000 , veTokens);

        return true;
    })
});




it('issue-mk3-tokens-seria-2', function() {
    log("");
    log(" (!) Action: [MK3] issue tokens on [VE] balance 1250.000 MK3");

    return dstContract1.issuePreferedTokens(2, 1250000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        dst1Total = dstContract1.getTotalSupply().toNumber() / 1000;
        log("[MK3] => total: " + dst1Total.toFixed(3) + " MK3");
        assert.equal(1400 , dst1Total);

        veTokens = dstContract1.allowance(dstContract1.address,
                                          virtualExchange.address).toNumber() / 1000;
        log("[MK3] => VirtualExchange balance: " + veTokens.toFixed(3) + " MK3");
        assert.equal(1250, veTokens);

        total  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(150000, voting);

        log("[MK3] => total: " + total + " votes");
        assert.equal(150000, total);

        return true;
    })
});


it('buy-all-dst-supply-seria-2-1', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [MK3] for 500.000 HKG");

    return virtualExchange.buy('MK3', 500000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function () {

        mk3Balance = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        log("[0x3a7e] => balance: " + mk3Balance.toFixed(3) + " MK3");
        assert.equal(1150, mk3Balance);

        total  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;


        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");

        log ("[MK3] => total: " + total + " votes");


        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber();
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");

        veTokens = dstContract1.allowance(dstContract1.address,
                                          virtualExchange.address).toNumber();
        log("[MK3] VirtualExchange total: " + veTokens.toFixed(3) + " MK3");


        return true;
    })
});




it('buy-all-dst-supply-seria-2-2', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [MK3] for 125.000 HKG");

    return virtualExchange.buy('MK3', 125000,
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);

    })

    .then(function () {

        mk3Balance = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        log("[0x3a7e] => balance: " + mk3Balance.toFixed(3) + " MK3");
        assert.equal(1400, mk3Balance);

        total  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;

        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
                                          virtualExchange.address).toNumber();
        log("[0x3a7e]  VirtualExchange balance: " + veTokens + " HKG (???) ");

        veTokens = dstContract1.allowance(dstContract1.address,
                                          virtualExchange.address).toNumber();
        log("[MK3] VirtualExchange total: " + veTokens.toFixed(3) + " MK3");

        hkgCollected = hackerGold.balanceOf(dstContract1.address).toNumber() / 1000;

        log("[MK3] colected balance: " + hkgCollected.toFixed(3) + " HKG");

        return true;
    })
});


it('roll-time-event-stops', function(){

    return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('issue-mk3-tokens-seria-3', function() {
    log("");
    log(" (!) Action: [MK3] issue tokens: 1000.000 MK3");

    return dstContract1.issueTokens(1, 1000000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        log("[The event is over]");

        dst1Total = dstContract1.getTotalSupply().toNumber() / 1000;
        log("[MK3] => total: " + dst1Total.toFixed(3) + " MK3");
        assert.equal(2400 , dst1Total);

        issued = dstContract1.balanceOf(dstContract1.address).toNumber() / 1000;
        log("[MK3] => total supply: " + issued.toFixed(3) + " MK3");
        assert.equal(1000 , issued);

        return true;
    })
});


it('buy-all-dst-supply-seria-3-1', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [MK3] tokens for: 990.000 Ether");

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: dstContract1.address,
      value: sandbox.web3.toWei(990, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        log("[0x3a7e] => balance: " + dst1Total + " MK3");
        assert.equal(2390 , dst1Total);

        total  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(1400000 , voting);

        tokensSupply = dstContract1.balanceOf(dstContract1.address).toNumber();
        log("[MK3] available supply: " + tokensSupply + " MK3");
        assert.equal(10000 , tokensSupply);

        return true;
    })

});



it('buy-all-dst-supply-seria-3-2', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [MK3] tokens for: 10.000 Ether");

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: dstContract1.address,
      value: sandbox.web3.toWei(10, 'ether')
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);
    })

    .then(function (txHash) {

        dst1Total = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        log("[0x3a7e] balance: " + dst1Total + " MK3");
        assert.equal(2400 , dst1Total);

        value  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(1400000 , voting);

        tokensSupply = dstContract1.balanceOf(dstContract1.address).toNumber();
        log("[MK3] available supply: " + tokensSupply + " MK3");
        assert.equal(0 , tokensSupply);

        return true;
    })

});


it('disable-token-issuance', function() {
    log("");
    log(" (!) Action: [0x3a7e] disable [MK3] tokens issueance option");

   return dstContract1.disableTokenIssuance(
   {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
   })

   .then(function () {

        dst1Total = dstContract1.getTotalSupply().toNumber() / 1000;
        log("[MK3] => total issued: " + dst1Total + " MK3");
        assert.equal(2400, dst1Total);

        etherCollected =
            dstContract1.getEtherValue().toNumber() / 1000000000000000000;

        log("[MK3] => balance: " + etherCollected + " Ether");
        assert.equal(1000, etherCollected);

        hkgCollected = hackerGold.balanceOf(dstContract1.address).toNumber() / 1000;
        log("[MK3] => collected balance: " + hkgCollected.toFixed(3) + " HKG");
        assert.equal(775, hkgCollected);

        total  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');

        log("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(1400000, voting);

        return true;
   })
});

it('issue-mk3-tokens-seria-1-edge-1', function() {
    log("");
    log(" (!) Action: [MK3] issue tokens on [VE] balance 150.000 MK3");

    return dstContract1.issuePreferedTokens(0, 15000,
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    })

    .then(function () {

        dst1Total = dstContract1.getTotalSupply().toNumber() / 1000;

        log("[MK3] => total supply: " + dst1Total.toFixed(3) + " MK3");
        assert.equal(2400, dst1Total);

        veTokens = dstContract1.allowance(dstContract1.address, virtualExchange.address).toNumber() / 1000;
        log("[MK3] => total on VirtualExchange: " + veTokens.toFixed(3) + " MK3");
        assert.equal(0, veTokens);

        return true;
    })
});


});
