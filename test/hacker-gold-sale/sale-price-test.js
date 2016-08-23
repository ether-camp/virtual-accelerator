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


it('price-periods', function() {

    return contracts.HackerGold.new()

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
            
            log("Qty of HKG for 1 ether before the sale starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            
            assert.equal(curPrice, 0);
            
            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('06-oct-2016');  })
        
        .then(function(){
            
            log("Qty of HKG for 1 ether when sale starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 200);
            
            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('20-oct-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether when first decline starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 195);
            
            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('21-oct-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether on second day of decline");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 190);

            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('06-nov-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether 1 day before the hackathon starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 110);

            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('07-nov-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether first day of the hackathon");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 100);

            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('21-nov-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether ; 2nd decline period starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 97);

            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('22-nov-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether ; 2nd decline period 2nd day");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 94);

            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('12-dec-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether ; hackathon ends 2 more days to buy in");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 34);

            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('13-dec-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether ; hackathon ends last day to buy in");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 31);

            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('14-dec-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether ; sale time is over");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 0);

            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('15-dec-2016');  })
        
        .then(function(){
                        
            log("Qty of HKG for 1 ether ; sale time is over");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 0);

            return true;                                 
        });

  });
  
  
    
  
});  