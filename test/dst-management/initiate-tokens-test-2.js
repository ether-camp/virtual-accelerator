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
   
   log('\n Date now: ' + date + '\n');    
}


/**
 *
 * Testing for hackathon period: 
 *  
 *     1.  
 *     2. 
 *     3. 
 *
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


it('dst-contract-mk3-init', function() {

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



it('enlist-mk3', function() {

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
      
      return true;
    })
    
});



it('issue-mk3-tokens-seria-1', function() {
    log("");

    return dstContract1.issuePreferedTokens(1, 150000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {
    
        dst1Total = dstContract1.getTotalSupply().toNumber();
        log("MK3 total: " + dst1Total);

        veTokens = dstContract1.allowance(dstContract1.address, 
                                          virtualExchange.address).toNumber();
        log("MK3 total on exchnage: " + veTokens);

        
        return true;
    })
});



it('buy-hkg-for-3a7e', function() {

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
          log("\nBalance of 0x3a7e: " + value + " HKG");
    
          return true;          
    })
    
});



it('approve-hkg-spend-on-exchange-1', function() {
    log("");

    return hackerGold.approve(virtualExchange.address, 150000, 
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




it('buy-all-dst-suply-seria-1', function() {
    log("");
    
    return virtualExchange.buy('MK3', 150000, 
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




it('issue-mk3-tokens-seria-2', function() {
    log("");

    return dstContract1.issuePreferedTokens(2, 1250000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {
    
        dst1Total = dstContract1.getTotalSupply().toNumber();
        log("MK3 total: " + dst1Total);

        veTokens = dstContract1.allowance(dstContract1.address, 
                                          virtualExchange.address).toNumber();
        log("MK3 total on exchnage: " + veTokens);

        
        return true;
    })
});


it('buy-all-dst-suply-seria-2-1', function() {
    log("");
    
    return virtualExchange.buy('MK3', 500000, 
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
        
        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber();
        log("[0x3a7e] HKG total on exchnage: " + veTokens);
        
        veTokens = dstContract1.allowance(dstContract1.address, 
                                          virtualExchange.address).toNumber();
        log("MK3 total on exchnage: " + veTokens);

        
        return true;
    })
});




it('buy-all-dst-suply-seria-2-2', function() {
    log("");
    
    return virtualExchange.buy('MK3', 125000, 
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
        
        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber();
        log("[0x3a7e] HKG total on exchnage: " + veTokens);
        
        veTokens = dstContract1.allowance(dstContract1.address, 
                                          virtualExchange.address).toNumber();
        log("MK3 total on exchnage: " + veTokens);

        
        return true;
    })
});


it('roll-time-event-stops', function(){
   
    return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('issue-mk3-tokens-seria-3', function() {
    log("");

    return dstContract1.issueTokens(1, 1000000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {

        log("\n[The event is over]");
        dst1Total = dstContract1.getTotalSupply().toNumber();
        log("MK3 total: " + dst1Total);

        return true;
    })
});




it('buy-all-dst-suply-seria-3-1', function() {

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: dstContract1.address,
      value: sandbox.web3.toWei(990000, 'ether')
    })
    
    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

        log("");
    
        dst1Total = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
        log("[0x3a7e] MK3 total: " + dst1Total);
        
        value  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
        
        log ("totalPrefered: " + value + " [0x3a7e] voting: " + voting);
        
        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber();
        log("[0x3a7e] HKG total on exchnage: " + veTokens);
        
        tokensSuply = dstContract1.balanceOf(dstContract1.address).toNumber();
        log("MK3 total suply: " + tokensSuply);
    
    
        return true;          
    })
    
});



it('buy-all-dst-suply-seria-3-2', function() {

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: dstContract1.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })
    
    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

        log("");
    
        dst1Total = dstContract1.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
        log("[0x3a7e] MK3 total: " + dst1Total);
        
        value  = dstContract1.getPreferedQtySold();
        voting = dstContract1.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
        
        log ("totalPrefered: " + value + " [0x3a7e] voting: " + voting);
        
        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber();
        log("[0x3a7e] HKG total on exchnage: " + veTokens);
        
        tokensSuply = dstContract1.balanceOf(dstContract1.address).toNumber();
        log("MK3 total suply: " + tokensSuply);
    
    
        return true;          
    })
    
});


it('disable-token-issuance', function() {
    log("");
    
   return dstContract1.disableTokenIssuance( 
   {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
   })

   .then(function () {
    
        dst1Total = dstContract1.getTotalSupply().toNumber();
        log("MK3 total: " + dst1Total);        
        return true;
   })
});



});






