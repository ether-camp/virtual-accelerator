var assert = require('chai').assert;

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  },
  solcVersion: '0.4.2'
});

workbench.startTesting([
    '../test/hacker-gold-sale/contracts/Exception', 
    'wallet', 
    'HackerGold'],
    function(contracts) 
{

var sandbox = workbench.sandbox;
var hackerGold;
var multisig;
var exception;

it('check-multisig-setup', function() {

    return contracts.Wallet.new(
        ['0xcc49bea5129ef2369ff81b0c0200885893979b77', '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72', '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'],
        3,
        0
    )

    .then(function(contract) {
          
        if (contract.address){
            multisig = contract;
        } else {
            throw new Error('No multisig contract address');
        }        

        return true;        
    })

    .then(function() {

        return contracts.HackerGold.new(multisig.address)

            .then(function(contract) {
          
                if (contract.address){
                    hackerGold = contract;
                } else {
                    throw new Error('No hackerGold contract address');
                }        

                return true;        
            });
    });

});

it('check-multisig-manages-value', function() {

    return workbench.rollTimeTo('20-Oct-2016 14:00 UTC+00')

    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        balance = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber();
        hkgValue = sandbox.web3.eth.getBalance(hackerGold.address);
        multisigValue = sandbox.web3.eth.getBalance(multisig.address);

        log('Hacker gold value: ' + hkgValue.toString(10));
        log('Multisig value: ' + multisigValue.toString(10));

        assert.equal(hkgValue, 0);
        assert.equal(sandbox.web3.toWei(1, 'ether'), multisigValue);

        // remove decimals
        assert.equal(tokens / 1000, 200);
        assert.equal(balance / 1000, 200);
        return true;
    })

    // withdraw from multisig
    .then(function() {

        var hashToConfirm;

        return multisig.execute(
            '0x71d0fc7d1c570b1ed786382b551a09391c91e33d',
            sandbox.web3.toWei(1, 'ether'),
            null, {
                from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
                gas: 200000,
        })

        .then(function (txHash) { 
            return workbench.waitForReceipt(txHash)
                .then(function(receipt) {
                    hashToConfirm = receipt.logs[1].args.operation;
                    log('Withdraw created');
                    log('Multisig balance: ' + sandbox.web3.eth.getBalance(multisig.address).toString(10));
                    log('Receiver balance: ' + sandbox.web3.eth.getBalance('0x71d0fc7d1c570b1ed786382b551a09391c91e33d').toString(10));
                    return true;
                }); 
        })

        .then(function() {

            // 2nd confirmation

            return multisig.confirm(
                hashToConfirm, {
                    from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
                    gas: 200000 
            })

            .then(function (txHash) { 
                return workbench.waitForReceipt(txHash)
                    .then(function(receipt) {
                        log('2nd confirmation done');
                        log('Multisig balance: ' + sandbox.web3.eth.getBalance(multisig.address).toString(10));
                        log('Receiver balance: ' + sandbox.web3.eth.getBalance('0x71d0fc7d1c570b1ed786382b551a09391c91e33d').toString(10));
                        return true;
                    });
            })
        })

        .then(function() {
            assert.equal(0, sandbox.web3.eth.getBalance('0x71d0fc7d1c570b1ed786382b551a09391c91e33d').toNumber());
            return true;
        })

        .then(function() {

            // 3rd confirmation

            return multisig.confirm(
                hashToConfirm, {
                    from: '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72',
                    gas: 200000 
            })

            .then(function (txHash) { 
                return workbench.waitForReceipt(txHash)
                    .then(function(receipt) {
                        log('3rd confirmation done');
                        log('Multisig balance: ' + sandbox.web3.eth.getBalance(multisig.address).toString(10));
                        log('Receiver balance: ' + sandbox.web3.eth.getBalance('0x71d0fc7d1c570b1ed786382b551a09391c91e33d').toString(10));
                        return true;
                    });
            })
        })

        .then(function() {
            assert.equal(sandbox.web3.toWei(1, 'ether'), sandbox.web3.eth.getBalance('0x71d0fc7d1c570b1ed786382b551a09391c91e33d'));
            return true;
        });
    });

});

it('check-multisig-throws', function() {

    return contracts.Exception.new()

    .then(function(contract) {
          
        if (contract.address){
            exception = contract;
        } else {
            throw new Error('No exception contract address');
        }        

        return true;        
    })

    .then(function() {

        return contracts.HackerGold.new(exception.address)

            .then(function(contract) {
          
                if (contract.address){
                    hackerGold = contract;
                } else {
                    throw new Error('No hackerGold contract address');
                }        

                return true;        
            });
    })

    .then(function() {
        return workbench.rollTimeTo('20-Oct-2016 14:00 UTC+00');
    })

    .then(function() {
        
        return workbench.sendTransaction({
          from: '0xcc49bea5129ef2369ff81b0c0200885893979b77',
          to: hackerGold.address,
          gas: 200000,
          value: sandbox.web3.toWei(100, 'ether')
        }).then(function (txHash) { 
            return workbench.waitForReceipt(txHash); 
        })
    })

    .then(function() {
        tokens = hackerGold.getTotalSupply().toNumber();
        balance = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber();
        hkgValue = sandbox.web3.eth.getBalance(hackerGold.address).toNumber();

        assert.equal(hkgValue, 0);
        
        // remove decimals
        assert.equal(tokens, 0);
        assert.equal(balance, 0);
        return true;
    })

});


});
