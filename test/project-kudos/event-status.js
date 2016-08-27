var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting(['EventInfo', 'ProjectKudos'], function(contracts) {

var sandbox = workbench.sandbox;
var projectKudos;
var eventInfo;


it('set-time', function() {

    return workbench.rollTimeTo('01-Sep-2016');
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
           var date = new Date(now * 1000);
           
           log('Date now: ' + date + '\n');
           
           return true;
        });
    
});

it('deploy', function() {

    return contracts.ProjectKudos.new(eventInfo.address)

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


it('assert-status', function() {

   return workbench.rollTimeTo('07-Nov-2016 09:00')
   
   .then(function(){
       
        status = projectKudos.getStatus().toString();
        assert.equal(status, 'NOT_STARTED');
   
        return true;
   })

   .then(function(){

        return workbench.rollTimeTo('07-Nov-2016 10:00')
   })
   
   .then(function(){
       
        status = projectKudos.getStatus().toString();
        assert.equal(status, 'EVENT_STARTED');
   
        return true;
   })

   .then(function(){

        return workbench.rollTimeTo('14-Nov-2016 10:00')
   })
   
   .then(function(){
       
        status = projectKudos.getStatus().toString();
        assert.equal(status, 'VOTING_STARTED');
   
        return true;
   })

   .then(function(){

        return workbench.rollTimeTo('12-Dec-2016 10:00')
   })
   
   .then(function(){
       
        status = projectKudos.getStatus().toString();
        assert.equal(status, 'EVENT_ENDED');
   
        return true;
   })
   
});

  
    
  
});  