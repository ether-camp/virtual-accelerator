var ethUtil = require('ethereumjs-util');
var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  },
  solcVersion: '0.4.4'
});

workbench.startTesting( ['ProjectKudos'], function(contracts) {

var sandbox = workbench.sandbox;
var projectKudos;
var currentKudos;
var kudosGiven;
var kudosLeft;

function string2Bytes32(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  var zerosCnt = 64 - result.length;
  for (var i = 0; i < zerosCnt; i++) {
    result += '0';
  }
  return '0x' + result;
}

it('setup', function() {

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

    return projectKudos.register('0xcc49bea5129ef2369ff81b0c0200885893979b77', false)

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

it('vote-before-the-period', function() {

  return workbench.rollTimeTo('24-Nov-2016 13:59 UTC+00')

  .then(function() {
    return projectKudos.giveKudos('TST', 10,
    {
      from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72'
    })
  })

  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {

    kudosLeft   = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    kudosGiven  = projectKudos.getKudosGiven('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    prjKudos    = projectKudos.getProjectKudos('TST').toNumber();

    assert.equal(kudosLeft, 1000);
    assert.equal(kudosGiven, 0);
    assert.equal(prjKudos, 0);

    return true;
  })

});

it('vote-after-the-period', function() {

  return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')

  .then(function() {
    return projectKudos.giveKudos('TST', 10,
    {
      from : '0xcc49bea5129ef2369ff81b0c0200885893979b77'
    })
  })

  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {

    kudosLeft         = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    kudosGiven        = projectKudos.getKudosGiven('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    kudosForProject   = projectKudos.getProjectKudos('TST').toNumber();

    assert.equal(kudosLeft, 10);
    assert.equal(kudosGiven, 0);
    assert.equal(kudosForProject, 0);

    return true;
  })

});

it('vote-during-the-period-1', function() {

  return workbench.rollTimeTo('30-Nov-2016 14:00')

  .then(function() {
    return projectKudos.giveKudos('TST', 10,
    {
       from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
    })
  })

  .then(function(txHash) {

    // we are waiting for blockchain to accept the transaction
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {

    kudosLeft       = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    kudosGiven      = projectKudos.getKudosGiven('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    kudosForProject = projectKudos.getProjectKudos('TST').toNumber();

    assert.equal(kudosLeft, 990);
    assert.equal(kudosGiven, 10);
    assert.equal(kudosForProject, 10);

    return true;
  });

});

it('vote-by-unregistered-user', function() {

  return projectKudos.giveKudos('TST', 10,
  {
     from : '0x8b737a5c37007216e0f391694fc0ce9eb36cae26',
  })

  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {

    kudosLeft       = projectKudos.getKudosLeft('0x8b737a5c37007216e0f391694fc0ce9eb36cae26').toNumber();
    kudosGiven      = projectKudos.getKudosGiven('0x8b737a5c37007216e0f391694fc0ce9eb36cae26').toNumber();
    kudosForProject = projectKudos.getProjectKudos('TST').toNumber();

    assert.equal(kudosLeft, 0);
    assert.equal(kudosGiven, 0);
    assert.equal(kudosForProject, 10);

    return true;
  });

});

it('vote-for-project-over-the-limit', function() {

  return projectKudos.giveKudos('TST', 1790,
  {
     from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
  })

  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  .then(function() {

    kudosLeft       = projectKudos.getKudosLeft('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    kudosGiven      = projectKudos.getKudosGiven('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
    kudosForProject = projectKudos.getProjectKudos('TST').toNumber();

    assert.equal(kudosLeft, 990);
    assert.equal(kudosGiven, 10);
    assert.equal(kudosForProject, 10);

    return true;
  });

});

it('vote-during-the-period-2', function() {

  return projectKudos.giveKudos('TST', 4,
  {
     from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
  })

  .then(function(txHash) {
    return workbench.waitForReceipt(txHash);
  })

  // check Vote event args

  .then(function(parsed) {
    args = parsed.logs[0].args;

    assert.equal(args.voter, '0xcc49bea5129ef2369ff81b0c0200885893979b77');
    assert.equal(args.count.toNumber(), 4);
    assert.equal(args.projectCode, '0x5453540000000000000000000000000000000000000000000000000000000000'); // 'TST' converted to bytes32

    return true;
  })

  .then(function() {
    return projectKudos.giveKudos('DEM', 5,
    {
      from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',
    }).then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
  })

  .then(function() {
    return projectKudos.giveKudos('DEM', 150,
    {
      from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
    }).then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
  })

  .then(function() {
    return projectKudos.giveKudos('DEM', 150,
    {
      from : '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
    }).then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
  })

  .then(function() {

    kudosLeft   = projectKudos.getKudosLeft('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
    kudosGiven  = projectKudos.getKudosGiven('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();

    kudosForTST = projectKudos.getProjectKudos('TST').toNumber();
    kudosForDEM = projectKudos.getProjectKudos('DEM').toNumber();

    userKudos   = projectKudos.getKudosPerProject('0xcc49bea5129ef2369ff81b0c0200885893979b77');
    judgeKudos  = projectKudos.getKudosPerProject('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72');

    kudosByUsers = projectKudos.getProjectKudosByUsers('TST', []);
    assert.equal(kudosByUsers.length, 0);

    kudosByUsers = projectKudos.getProjectKudosByUsers('TST', ['0xcc49bea5129ef2369ff81b0c0200885893979b77']);
    // check kudosByUsers equal to userKudos
    assert.equal(kudosByUsers.length, 1);
    assert.equal(Number(kudosByUsers[0]), Number(userKudos[1][0]));

    assert.equal(kudosLeft, 1);
    assert.equal(kudosGiven, 9);

    assert.equal(kudosForTST, 14);
    assert.equal(kudosForDEM, 305);

    // check user
    projects = userKudos[0];
    votes    = userKudos[1];

    assert.equal(projects[0], string2Bytes32('TST'));
    assert.equal(projects[1], string2Bytes32('DEM'));
    assert.equal(votes[0], 4);
    assert.equal(votes[1], 5);

    // check judge
    projects = judgeKudos[0];
    votes    = judgeKudos[1];

    assert.equal(projects[0], string2Bytes32('TST'));
    assert.equal(projects[1], string2Bytes32('DEM'));
    assert.equal(votes[0], 10);
    assert.equal(votes[1], 300);

    return true;
  })

});

});
