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
var value;

it('check-create-hkg-init', function() {

    return contracts.HackerGold.new('0x71d0fc7d1c570b1ed786382b551a09391c91e33d')

    .then(function(contract) {
      
        if (contract.address){
            hackerGold = contract;
        } else {
            throw new Error('No contract address');
        }        
      
        return true;        
    });
});

it('check-create-hkg-out-of-sale-period', function() {

    return workbench.rollTimeTo('23-aug-2016')
    
    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        value  = hackerGold.getTotalValue().toNumber();
        assert.equal(tokens, 0);
        assert.equal(value, 0);
        return true;
    })

    .then(function() { return workbench.rollTimeTo('20-Oct-2016 13:59 UTC+00'); })

    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })
    
    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        value  = hackerGold.getTotalValue().toNumber();
        assert.equal(tokens, 0);
        assert.equal(value, 0);
        return true;
    })

    .then(function() { return workbench.rollTimeTo('22-Dec-2016 14:01 UTC+00'); })

    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })
    
    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        value  = hackerGold.getTotalValue().toNumber();
        assert.equal(tokens, 0);
        assert.equal(value, 0);
        return true;
    });
});

it('check-create-hkg-with-zero-value', function() {

    return workbench.rollTimeTo('20-Oct-2016 14:00 UTC+00')

    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(0, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        value  = hackerGold.getTotalValue().toNumber();
        assert.equal(tokens, 0);
        assert.equal(value, 0);
        return true;
    });
});

it('check-create-hkg-with-non-zero-value', function() {

    return workbench.rollTimeTo('20-Oct-2016 14:00 UTC+00')

    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        balance = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
        value = hackerGold.getTotalValue();

        log(value.toString(10) + ' total value');
        assert.equal(sandbox.web3.toWei(1, 'ether'), value);

        // remove decimals
        assert.equal(tokens / 1000, 200);
        assert.equal(balance / 1000, 200);
        return true;
    })

    // fractions of ether
    .then(function() {
        
        return workbench.sendTransaction({
          from: '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'finney')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        balance1 = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
        balance2 = hackerGold.balanceOf('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
        value = hackerGold.getTotalValue();

        log(value.toString(10) + ' total value');
        assert.equal(sandbox.web3.toWei(1001, 'finney'), value);

        // remove decimals
        assert.equal(tokens / 1000, 200.2);

        assert.equal(balance1 / 1000, 200);
        assert.equal(balance2 / 1000, 0.2);
        return true;
    })

    // milestones.p6
    .then(function() { return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00'); })

    .then(function() {

        value  = hackerGold.getTotalValue().toNumber();
        
        return workbench.sendTransaction({
          from: '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {

        updatedValue = hackerGold.getTotalValue();
        balance = hackerGold.balanceOf('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();

        assert.equal(0, updatedValue - value);

        // remove decimals
        assert.equal(balance / 1000, 0.2);
        
        return true;
    })

    // OOG
    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
          to: hackerGold.address,
          gas: 21000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        balance1 = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
        balance2 = hackerGold.balanceOf('0x211b1b6e61e475ace9bf13ae79373ddb419b5f72').toNumber();
        balance3 = hackerGold.balanceOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').toNumber();
        value = hackerGold.getTotalValue();

        log(value.toString(10) + ' total value');
        assert.equal(sandbox.web3.toWei(1001, 'finney'), value);

        // remove decimals
        assert.equal(tokens / 1000, 200.2);

        assert.equal(balance1 / 1000, 200);
        assert.equal(balance2 / 1000, 0.2);
        assert.equal(balance3, 0);
        return true;
    });
});

});
