var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }, 
  
  solcVersion: '0.4.2'
});

workbench.startTesting(['StandardToken', 'EventInfo', 'DSTContract', 'VirtualExchange'],  function(contracts) {

var sandbox = workbench.sandbox;

// deployed contracts 
var eventInfo;
var hackerGold;
var virtualExchange;

var dstContract_APL;  // Awesome Poker League

var proposal_1;
var proposal_2;
var proposal_3;
var proposal_4;
var proposal_5;


function printDate(){
   now = eventInfo.getNow().toNumber();
   var date = new Date(now*1000);
   
   log('\n Date now: ' + date + '\n');    
}


/**
 * 
 * Testing for requesting HKG funds after the event : 
 *  
 *     1. After the event [0xcc49] submit proposal to get funds
 *     2. Proposal is rejected by [0x3a7e]
 *     3. No option to redeem funds. 
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
    log(" (!) Action: [0x3a7e] buy [HKG] for 10000 Ether");    

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(500000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
          value = Math.ceil(value);
          
          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(100000000, value);
    
          return true;          
    })
    
});


it('roll-time-ve-trading-start', function(){
   
    return workbench.rollTimeTo('24-Nov-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});




it('virtual-exchange-init', function() {

    return contracts.VirtualExchange.new(hackerGold.address, 
                                         eventInfo.address)
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

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "Awesome Poker League", "APL", 
        
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



it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [APL] issue tokens on [VE] balance 1,000,000,000,000.000 APL");
                           
    return dstContract_APL.issuePreferedTokens(1000, 1000000000000000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {
    
        dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;
        
        log("[APL] => total suply: " + dst1Total.toFixed(3) + " APL");
        assert(1000000000000000, dst1Total);
        
        veTokens = dstContract_APL.allowance(dstContract_APL.address, 
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert(1000000000000000, veTokens);

        return true;
    })
});



it('approve-hkg-spend-on-exchange-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 1,000,000.000 HKG");
                                                       
    return hackerGold.approve(virtualExchange.address, 100000000000, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',       
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })    
    
    .then(function () {

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber() / 1000;
                                          
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(100000000, veTokens);
        
        return true;
    })
});



it('buy-apl-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [APL] for 50,000,000.000 HKG");

                                      
    return virtualExchange.buy('APL', 5000000000,  
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        
        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(5000000000 , dst1Balance);
        
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
        
        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(5000000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        value = Math.ceil(value);
        
        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(95000000, value); 
                
        log ("[APL] => total: " + total + " votes");
        assert.equal(5000000000000, total);
        
        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(95000000 , veTokens);  

        availableSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available suply: " + availableSuply + " APL");    
        assert.equal(995000000000 , availableSuply);
        
        return true;
    })
});



it('roll-time-va-ends', function(){
   
    return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});




it('end-event-summary', function() {
    log("");
    

    log("Post Event Summary:");
    log("===================");
    
    value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
    dollarValue = value / 100;    
    log("[APL] => collected: " + value.toFixed(3) + " HKG" + " = $" + dollarValue);
    assert.equal(50000, dollarValue); 

    return true;
});



it('roll-time-50%-available', function(){
   
    return workbench.rollTimeTo('22-Feb-2017 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});



it('submit-proposal-1', function() {
    log("");
    log(" (!) Action: [0xcc49] ask to recieve 1,000,000.000 (20%) of the HKG collected");
                           
    return dstContract_APL.submitHKGProposal(1000000000, "http://pastebin.com/raw/6e9PBTeP", 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
        
       args = parsed.logs[0].args;       
       
       proposalId = args.id;
       proposalValue = args.value;
       proposalValue = proposalValue / 1000;
       
       proposalTimeEnds = args.timeEnds;
       proposalURL = args.url;
       proposalSender = args.sender;
       
       log("");
       log("Proposal Submitted");
       log("==================");
       
       log("proposalId: "       + proposalId);
       log("proposalValue: "    + proposalValue.toFixed(3));
       log("proposalTimeEnds: " + proposalTimeEnds);
       log("proposalURL: "      + proposalURL);
       log("proposalSender: "   + proposalSender);
       
       
       assert.equal(1000000, proposalValue);
       
       t1 = eventInfo.getNow().toNumber() + 60 * 60 * 24 * 10;
       t2 = proposalTimeEnds;
       assert(t1, t2);

       assert.equal(proposalURL,    "http://pastebin.com/raw/6e9PBTeP");
       assert.equal(proposalSender, "0xcc49bea5129ef2369ff81b0c0200885893979b77");
       
       proposal_1 = proposalId;
               
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(0, value);     
       
       return true;                
    })

});



it('object-by-vote-proposal-1', function() {
    log(""); 
    log(" (!) Action: [0x3a7e] vote to object proposal 1");
                           
    return dstContract_APL.objectProposal(proposal_1, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
         
       log_1 = parsed.logs[0];
       log(log_1.args);
        
       total  = dstContract_APL.getPreferedQtySold();
       
       log("\n");
       log(log_1.event + ":");
       log("============");
       
       log("proposal.id: " + log_1.args.id);
       log("voter: " + log_1.args.voter);
       log("votes: " + log_1.args.votes + " share: " + (log_1.args.votes / total * 100).toFixed(2) + "%");
       
       voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
              
       assert.equal(proposal_1, log_1.args.id);
       assert.equal(log_1.args.voter, "0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d");
       assert.equal(log_1.args.votes, voting);
              
       return true;                
    })

});



it('roll-time-proposal-redeem', function(){
   
    return workbench.rollTimeTo('04-Mar-2017 14:01 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('redeem-proposal-1', function() {
    log("");
    log(" (!) Action: [0xcc49] collect 1,000,000.000 HKG value of proposal 1");
                           
    return dstContract_APL.redeemProposalFunds(proposal_1, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 350000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
       
       assert.equal(0, parsed.logs.length);       
       return true;                
    })
    
    .then(function () {
              
       // ensure that the proposal is rejected and cannot be reddemed              
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(0, value);
           
       value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
       log("[APL] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(5000000, value);

       return true;                
    })

});



});






