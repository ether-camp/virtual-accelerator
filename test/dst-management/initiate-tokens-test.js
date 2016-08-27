var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting(['EventInfo', 'DSTContract', 'VirtualExchange'],  function(contracts) {

var sandbox = workbench.sandbox;

// deployed contracts 
var eventInfo;
var hackerGold;
var virtualExchange;
var dstContract1;
var dstContract2;

/**
 *
 * Testing for hackathon period: 
 *  
 *     1. Enlist the DST 
 *     2. Offer tokens for HKG for prefered period
 *     3. 
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
            
           now = eventInfo.getNow().toNumber();
           var date = new Date(now*1000);
           
           log('Date now: ' + date + '\n');
           
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


it('start-hkg-sale', function() {

    return workbench.rollTimeTo('07-Nov-2016 10:00');
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
   
      exec = dstContract1.getExecutive();
      log(exec);
   
      name2 = dstContract2.getDSTName();
      log(name2); 
   
   
      name1 = dstContract1.getDSTName();
      log(name1); 
       
      exist = virtualExchange.isExistByString(name1); 
      log(exist);

      exist = virtualExchange.isExistByString(name2); 
      log(exist);

      return true;
    })
    
});

it('issue-dst-tokens-1', function() {

    return dstContract1.issuePreferedTokens(500, 10000000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {
    
        dst1Total = dstContract1.getTotalSupply().toNumber();
        log("CRB total: " + dst1Total);

        veTokens = dstContract1.allowance('0xcc49bea5129ef2369ff81b0c0200885893979b77', 
                                          virtualExchange.address).toNumber();
        log("CRB total on exchnage: " + veTokens);

        
        return true;
    })
});

it('approve-hkg-spend-on-exchange', function() {

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
        log("HKG total on exchnage: " + veTokens);
        
        return true;
    })
});


it('trade-dst-for-hkg', function() {
    
    return virtualExchange.buy('MK3', 300, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas: 200000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {

        dst1Total = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
        log("[0x3a7e] CRB total: " + dst1Total);
        
        out = virtualExchange.tst();
        log(out);
        
        return true;
    })
});


});


 