var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  },
  solcVersion: '0.4.4'
});

workbench.startTesting(['ProjectKudos'], function(contracts) {

var sandbox = workbench.sandbox;
var projectKudos;

it('setup', function() {
    return contracts.ProjectKudos.new()

        .then(function(contract) {
          
          if (contract.address){
            projectKudos = contract;
            log('Deployed');
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
        })
});


it('register-voter', function() {

  // only owner can call to register

  return projectKudos.register('0xcc49bea5129ef2369ff81b0c0200885893979b77', false, 
  {
     from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
  })
       
  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 0);
    
    return true;
  })

   // regular flow

  .then(function() {
    return projectKudos.register('0xcc49bea5129ef2369ff81b0c0200885893979b77', false)
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      });
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 10);
    
    return true;
  })

  // register user once again
  
  .then(function() {
    return projectKudos.register('0xcc49bea5129ef2369ff81b0c0200885893979b77', false)
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      });
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 10);
    
    return true;
  })

});

it('register-judge', function() {

  return projectKudos.register('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72', true)
     
  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    assert.equal(kudosLeft, 1000);
    
    return true;
  })
});


it('grant-voter-social-proof', function() {

  // only owner can call to grantKudos

  return projectKudos.grantKudos('0xcc49bea5129ef2369ff81b0c0200885893979b77', 0, 
  {
     from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
  })
     
  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 10);
    
    return true;
  })

  // regular flow with Facebook

  .then(function() {
    return projectKudos.grantKudos('0xcc49bea5129ef2369ff81b0c0200885893979b77', 0)
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      });
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 110);
    
    return true;
  })

  // grant Facebook kudos again: nothing happens

  .then(function() {
    return projectKudos.grantKudos('0xcc49bea5129ef2369ff81b0c0200885893979b77', 0)
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      });
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 110);
    
    return true;
  })

  // grant Twitter kudos

  .then(function() {
    return projectKudos.grantKudos('0xcc49bea5129ef2369ff81b0c0200885893979b77', 1)
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      });
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    assert.equal(kudosLeft, 210);
    
    return true;
  })

});

it('grant-voter-fake-proof', function() {
  
  return projectKudos.register('0x8b737a5c37007216e0f391694fc0ce9eb36cae26', false)

  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  });

  then(function () {
    return projectKudos.grantKudos('0x8b737a5c37007216e0f391694fc0ce9eb36cae26', 3);   
  })

  .then(function(txHash) {
    
    // we are waiting for blockchain to accept the transaction 
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {
    
    kudosLeft = projectKudos.getKudosLeft('0x8b737a5c37007216e0f391694fc0ce9eb36cae26').toNumber();
    assert.equal(kudosLeft, 10);
    
    return true;
  })           
});  
  

it('grant-judge-social-proof', function() {

    return projectKudos.grantKudos('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72', 0)
       
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
  
    
  
});  
