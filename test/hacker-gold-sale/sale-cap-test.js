var assert = require('chai').assert;

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  },
  solcVersion: '0.4.2'
});

workbench.startTesting('HackerGold', function(contracts) {

var sandbox = workbench.sandbox;
var hackerGold;

/*
 *
 */
it('price-periods', function() {

    return contracts.HackerGold.new('0x71d0fc7d1c570b1ed786382b551a09391c91e33d')

        .then(function(contract) {
          
          if (contract.address){
            hackerGold = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
        })
        
        .then(function (){ return workbench.rollTimeTo('23-aug-2016');  })
        
        .then(function(){
            
            log("");
            log("23-aug-2016")
            log("===========")
            log("Qty of HKG for 1 ether before the sale starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            
            assert.equal(curPrice, 0);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('20-Oct-2016 13:59 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("20-Oct-2016 13:59")
            log("=================")
            log("Qty of HKG for 1 ether 1 minute before the sale starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            
            assert.equal(curPrice, 0);
            
            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('20-Oct-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("20-Oct-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether when sale starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 200);
            
            return true;                                 
        })
        
    });
  
  
    it('trade-hkg', function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(200, 'ether')
        }).then(function (txHash) {
    
              return workbench.waitForReceipt(txHash);          

        })

        .then(function(){
        
            val_1 = hackerGold.getTotalValue().toString(10);
            log(val_1 + " ether collected" );        
            assert.equal(val_1, sandbox.web3.toWei(200, 'ether'));
        
       
            return true;                                 
        })            
                 
   });
    

    it('trade-hkg-close-to-the-cap', function() {
        
        return workbench.sendTransaction({
          from: '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(3900000, 'ether')
        }).then(function (txHash) {
    
              return workbench.waitForReceipt(txHash);          

        })

        .then(function(){
        
            val_1 = hackerGold.getTotalValue().toString(10);
            log(val_1 + " Value less than 4,000,000 ether" );
                    
            assert.isAtLeast(val_1, sandbox.web3.toWei(3900000, 'ether'));               
            return true;                                 
        })            
                
   });


    /**
     *
     * Do not pass 4,000,000 ether in total.
     *
     */
    it('trade-hkg-over-the-cap', function() {
        
        return workbench.sendTransaction({
          from: '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(100000, 'ether')
        }).then(function (txHash) {
    
              return workbench.waitForReceipt(txHash);          

        })

        .then(function(){
        
            val_1 = hackerGold.getTotalValue().toString(10);
            log(val_1 + " Value less than 4,000,000 ether" );
        
            assert.isAtMost(val_1, sandbox.web3.toWei(4000000, 'ether'));       
            return true;                                 
        })            
                
   });


    
});  
