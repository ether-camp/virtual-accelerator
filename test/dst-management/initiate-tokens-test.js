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



it('trade-dst-for-hkg', function() {


    return true;
});


});


 