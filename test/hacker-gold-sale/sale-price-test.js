var assert = require('assert');

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
 *  The sale price is changing by periods: 
 *   
 *    P1: GMT: 20-Oct-2016 14:00  => The Sale Starts
 *    P2: GMT: 03-Nov-2016 14:00  => 1st Price Ladder
 *    P3: GMT: 17-Nov-2016 14:00  => Price Stable, 
 *                                   Hackathon Starts
 *    P4: GMT: 01-Dec-2016 14:00  => 2nd Price Ladder 
 *    P5: GMT: 15-Dec-2016 14:00  => Price Stable 
 *    P6: GMT: 22-Dec-2016 14:00  => Sale Ends, Hackathon Ends  
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
        
        .then(function (){ return workbench.rollTimeTo('03-Nov-2016 13:59 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("03-Nov-2016 13:59")
            log("=================")
            log("Qty of HKG for 1 ether 1 minute before 1st price ladder starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 200);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('03-Nov-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("03-Nov-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether when 1st price ladder starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 197);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('04-Nov-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("04-Nov-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether 1 days into 1st price ladder starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 193);
            
            return true;                                 
        })


        .then(function (){ return workbench.rollTimeTo('10-Nov-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("10-Nov-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether 7 days into 1st price ladder starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 172);
            
            return true;                                 
        })
                
        .then(function (){ return workbench.rollTimeTo('17-Nov-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("17-Nov-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether when 1st price ladder ends");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 150);
            
            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('19-Nov-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("19-Nov-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether 1 day into 1st stable period");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 150);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('01-Dec-2016 13:59 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("01-Dec-2016 13:59")
            log("=================")
            log("Qty of HKG for 1 ether 1 minute before 2st price ladder");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 150);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('01-Dec-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("01-Dec-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether when 2nd price ladder starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 147);
            
            return true;                                 
        })


        .then(function (){ return workbench.rollTimeTo('02-Dec-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("02-Dec-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether 2 days into 2nd price ladder starts");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 143);
            
            return true;                                 
        })


        .then(function (){ return workbench.rollTimeTo('14-Dec-2016 13:59 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("14-Dec-2016 13:59")
            log("=================")
            log("Qty of HKG for 1 ether 1 minute before last price change");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 104);
            
            return true;                                 
        })


        .then(function (){ return workbench.rollTimeTo('15-Dec-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("15-Dec-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether on 2nd stable period");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 100);
            
            return true;                                 
        })
        
        .then(function (){ return workbench.rollTimeTo('16-Dec-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("16-Dec-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether on 2nd stable period");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 100);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('22-Dec-2016 13:59 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("22-Dec-2016 13:59")
            log("=================")
            log("Qty of HKG for 1 ether 1 minute before hackathon ends");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 100);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("22-Dec-2016 14:00")
            log("=================")
            log("Qty of HKG for 1 ether when hackathon ends");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 0);
            
            return true;                                 
        })

        .then(function (){ return workbench.rollTimeTo('01-Jan-2017 00:00 UTC+00');  })
        
        .then(function(){
            
            log("");
            log("01-Jan-2017 00:00")
            log("=================")
            log("Qty of HKG for 1 ether on a next new year");
            var curPrice = hackerGold.getPrice().toNumber();
            
            log("1 ether => " + curPrice + " HKG" + "\n");
            assert.equal(curPrice, 0);
            
            return true;                                 
        })

        

  });
  
  
    
  
});  
