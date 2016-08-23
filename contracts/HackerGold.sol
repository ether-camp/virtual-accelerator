



import "StandardToken.sol";

/**
 *
 * Hacker gold is the official token of 
 * the <hack.ether.camp> hackathon. 
 *
 * todo: brief explained
 *
 * todo: white paper link
 *
 */
contract HackerGold is StandardToken{


    // todo sale period : before / after

    // scale param for number of tokens per ether 

    // tmp price
    // 1 ether = 200 hkg
    uint price = 200;    

    

    /**
     *
     */
    function (){

        if (msg.value == 0) throw;
    
        uint tokens = msg.value / 1000000000000000 * price;
        totalSupply += tokens;
        balances[msg.sender] += tokens;        
    }
    
    /**
     *
     *
     */
    function getTotalSupply() constant returns (uint result){
        return totalSupply;
    } 

    
    function getNow() constant returns (uint result) {
        return now;
    }

}
