var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting('HackerGold', function(contracts) {

var sandbox = workbench.sandbox;
var hackerGold;


it('init', function() {

    return contracts.HackerGold.new()

        .then(function(contract) {
          
          if (contract.address){
            hackerGold = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
        })
        
        .then(function(){
            
            return workbench.sendTransaction({
              from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
              to: hackerGold.address,
              gas: 200000,
              value: sandbox.web3.toWei(2, 'ether')
            }).then(function (txHash) {
        
                  return workbench.waitForReceipt(txHash);          

            });

                                 
        })
        
        .then(function(){
            
           var balance    = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber(); 
           var totalSuply = hackerGold.getTotalSupply().toNumber();
                       
           assert.equal(balance, 0)
           assert.equal(totalSuply, 0)
           
           return true;  
        })
        
        .then(function(){
            
            return true
            //workbench.rollTimeTo('20-nov-2016');
        })
        
        .then(function(){
           
            var now = hackerGold.getNow().toNumber();            
            log(now);
            
            return true; 
        });

        
        
        
    });
  
  
    
  
});  