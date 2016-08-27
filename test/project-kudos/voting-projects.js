var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting('ProjectKudos', function(contracts) {

var sandbox = workbench.sandbox;
var projectKudos;


it('deploy', function() {

    return contracts.ProjectKudos.new()

        .then(function(contract) {
          
          if (contract.address){
            projectKudos = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
        })
        
        .then(function (){ return workbench.rollTimeTo('23-aug-2016');  });        
});


it('register-voter', function() {

    return projectKudos.register('0xcc49bea5129ef2369ff81b0c0200885893979b77', false, 
    {
       from : '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',       
    })
       
   .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {
      
      kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
      assert.equal(kudosLeft, 10);
      
      return true;
   })          
});



it('register-judge', function() {

    return projectKudos.register('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72', true, 
    {
       from : '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',       
    })
       
   .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {
      
      kudosLeft = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
      assert.equal(kudosLeft, 1000);
      
      return true;
   })          
});



it('vote-for-project-1', function() {

    return projectKudos.giveKudos('0xaaab1b6e61e475ace9bf13ae79373ddb419b5f72', 10, 
    {
       from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',       
    })
       
   .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {
      
      kudosLeft = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
      assert.equal(kudosLeft, 1000);
      
      return true;
   })

   .then(function() {
      
      kudosLeft = projectKudos.getProjectKudos('0xaaab1b6e61e475ace9bf13ae79373ddb419b5aaa').toNumber();
      assert.equal(kudosLeft, 0);
      
      return true;
   })          
   
});
  
  

it('start-the-event', function() {

    return projectKudos.moveStatus()
    .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })

    .then(function() {
      
      var status = projectKudos.getStatus().toNumber();
      assert.equal(1, status);
      
      return true;
    })
    
});  


it('vote-for-project-2', function() {

    return projectKudos.giveKudos('0xaaab1b6e61e475ace9bf13ae79373ddb419b5aaa', 10, 
    {
       from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',       
    })
       
   .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })

   .then(function() {
      
      kudosLeft = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
      assert.equal(kudosLeft, 990);
      
      return true;
   })

   .then(function() {
      
      projectKudos = projectKudos.getProjectKudos('0xaaab1b6e61e475ace9bf13ae79373ddb419b5aaa').toNumber();
      assert.equal(projectKudos, 10);
      
      return true;
   })          
   
});

  
  
    
  
});  