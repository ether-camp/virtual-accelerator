var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
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
   
   log('Date now: ' + date + '\n');    
}


/**
 *
 * Testing for hackathon period: 
 *  
 *     1. Enlist the DST 
 *     2. Offer tokens for HKG for prefered period
 *     3. Trade DST tokens for HKG
 *
 */

it('init-time', function(){
   
    return workbench.rollTimeTo('20-sep-2016');
   
});

it('event-info-init', function() {
    
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


it('start-hkg-sale', function() {

    return workbench.rollTimeTo('06-Oct-2016');
});


it('buy-hkg-on-the-sale-1', function() {

    return workbench.sendTransaction({
      from: '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
      to: hackerGold.address,
      value: sandbox.web3.toWei(30, 'ether')
    })
    
    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber();
          log(value);
    
          return true;          
    })
    
});


it('buy-hkg-on-the-sale-2', function() {

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5, 'ether')
    })
    
    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
          log(value);
    
          return true;          
    })
    
});


it('virtual-exchange-init', function() {

    return contracts.VirtualExchange.new(hackerGold.address)

        .then(function(contract) {
          
          if (contract.address){
            virtualExchange = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
    });        
});



it('dst-contract-1-init', function() {

    return contracts.DSTContract.new(eventInfo.address, "MK3", 
        
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


it('dst-contract-2-init', function() {

    return contracts.DSTContract.new(eventInfo.address, "CRB",

        {
            from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72'
        })    
    
        .then(function(contract) {
          
          if (contract.address){
            dstContract2 = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
    });        
});


it('start-hkg-event', function() {

    return workbench.rollTimeTo('07-Nov-2016 10:00')
    
    .then(function (){  log("\n HACKATHON starts"); printDate(); return true; })
});

it('start-token-trading', function() {

    return workbench.rollTimeTo('14-Nov-2016 10:00')
    
    .then(function (){  log("\n Tokens trading starts");  printDate(); return true; })
});


it('enlist-dst', function() {

    return virtualExchange.enlist(dstContract1.address, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })
       
   .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })
    
   .then(function() {
          
      log();
      
      exist = virtualExchange.isExistByString(dstContract1.getDSTName()); 
      log("MK3: enlisted: " + exist);

      exist = virtualExchange.isExistByString(dstContract2.getDSTName()); 
      log("CRB: enlisted: " + exist);

      return true;
    })
    
});

it('issue-dst-tokens-1', function() {
    log("");

    return dstContract1.issuePreferedTokens(500, 10000000000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {
    
        dst1Total = dstContract1.getTotalSupply().toNumber();
        log("MK3 total: " + dst1Total);

        veTokens = dstContract1.allowance('0xcc49bea5129ef2369ff81b0c0200885893979b77', 
                                          virtualExchange.address).toNumber();
        log("MK3 total on exchnage: " + veTokens);

        
        return true;
    })
});

it('approve-hkg-spend-on-exchange-1', function() {
    log("");

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
        log("[0x3a7e] HKG total on exchnage: " + veTokens);
        
        return true;
    })
});

it('approve-hkg-spend-on-exchange-2', function() {
    log("");

    return hackerGold.approve(virtualExchange.address, 1000000, 
    {
       from : '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',       
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {

        veTokens = hackerGold.allowance('0x29805ff5b946e7a7c5871c1fb071f740f767cf41', 
                                          virtualExchange.address).toNumber();
        log("[0x2980] HKG total on exchnage: " + veTokens);
        
        return true;
    })
});


it('trade-dst-for-hkg-1', function() {
    log("");
    
    return virtualExchange.buy('MK3', 300, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {

        dst1Total = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
        log("[0x3a7e] MK3 total: " + dst1Total);
        
        value  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
        
        log ("totalPrefered: " + value + " [0x3a7e] voting: " + voting);
        
        return true;
    })
});



it('trade-dst-for-hkg-2', function() {
    log("");
    
    return virtualExchange.buy('MK3', 7000, 
    {
       from : '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',   
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {
        
        value  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');
        
        log ("totalPrefered: " + value + " [0x2980] voting: " + voting + " share: " + (voting / value * 100).toFixed(2) + "%" );


        value  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
        
        log ("totalPrefered: " + value + " [0x3a7e] voting: " + voting + " share: " + (voting / value * 100).toFixed(2) + "%" );
        
        tokens = dstContract1.balanceOf("0xcc49bea5129ef2369ff81b0c0200885893979b77");
        qtyFor1HKG = dstContract1.getHKGPrice();
        
        log("MK3 left tokens for sale: " + tokens + ":  1 HKG = " + qtyFor1HKG + "MK3");
        
        hkgTokens = hackerGold.balanceOf(dstContract1.address).toNumber();
        
        log("MK3 owns: " + hkgTokens + " HKG");
        
        return true;
    })
});


});


 