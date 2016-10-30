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
    log(" (!) Action: [0x3a7e] buy [HKG] for 5000.000 Ether");    

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
          
          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);
    
          return true;          
    })
    
});


it('buy-hkg-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy [HKG] for 5000.000 Ether");    

    return workbench.sendTransaction({
      from: '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;
          
          log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);
    
          return true;          
    })
    
});


it('buy-hkg-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy [HKG] for 5000.000 Ether");    

    return workbench.sendTransaction({
      from: '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;
          
          log("[0x696b] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);
    
          return true;          
    })
    
});


it('buy-hkg-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] buy [HKG] for 5000.000 Ether");    

    return workbench.sendTransaction({
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      to: hackerGold.address,
      value: sandbox.web3.toWei(5000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;
          
          log("[0xcd2a] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(1000000, value);
    
          return true;          
    })
    
});



it('roll-time-ve-trading-start', function(){
   
    return workbench.rollTimeTo('24-Nov-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
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


it('dst-contract-apl-init', function() {

    return contracts.DSTContract.new(eventInfo.address, "Awesome Poker League", "APL", 
        
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

    return contracts.DSTContract.new(eventInfo.address, "Filmbox", "fbx", 
        
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

    return contracts.DSTContract.new(eventInfo.address, "Gog and Magog", "gog", 
        
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

    return contracts.DSTContract.new(eventInfo.address, "Gog and Maamz", "amz", 
        
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

});






