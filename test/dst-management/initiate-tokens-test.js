var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting(['DSTContract', 'VirtualExchange', 'EventInfo'],  function(contracts) {

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


it('trade-dst-for-hkg', function() {


    return true;
});


});


 