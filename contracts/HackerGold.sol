
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

    // todo: 
    // token name readable in mist
    

    // 1 ether = 200 hkg
    uint BASE_PRICE = 200;    

    struct milestones_struct{
      uint p1;
      uint p2; 
      uint p3;
      uint p4;
      uint p5;
    }
    milestones_struct milestones;
    

    function HackerGold(){
    
        // set time periods for sale
        milestones = milestones_struct(
          1475712000,  // 06-Oct-2016
          1476921600,  // 20-Oct-2016 
          1478476800,  // 07-Nov-2016
          1479686400,  // 21-Nov-2016
          1481673600   // 14-Dec-2016
        );
        
    }
    
    
    /**
     * Default function : called on ether sent
     */
    function (){
            
        if (now <  milestones.p1) throw;
        if (now >= milestones.p2) throw;
        if (msg.value == 0) throw;
    
    
        uint tokens = msg.value / 1000000000000000 * getPrice();
        totalSupply += tokens;
        balances[msg.sender] += tokens;        
    }

    
    /**
     * getPrice() - function that denotes complete price 
     *              structure during the sale.
     *
     */
    function getPrice() constant returns (uint result){
        
        if (now < milestones.p1) return 0;
        
        if (now >= milestones.p1 && now < milestones.p2){
        
            return BASE_PRICE;
        }
        
        if (now >= milestones.p2 && now < milestones.p3){
            
            uint dailyStep = 5; // ~ (100 / 18)
        
            uint days_in = 1 + (now - milestones.p2) / (60 * 60 *24); 
            return BASE_PRICE - days_in * dailyStep;
        }

        if (now >= milestones.p3 && now < milestones.p4){
        
            return BASE_PRICE / 2;
        }
        
        if (now >= milestones.p4 && now < milestones.p5){
            
            dailyStep = 3; // ~ (80 / 23)
        
            days_in = 1 + (now - milestones.p4) / (60 * 60 *24); 
            return (BASE_PRICE / 2) - days_in * dailyStep;
        }
        
        if (now >= milestones.p5){

            return 0;
        }

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
