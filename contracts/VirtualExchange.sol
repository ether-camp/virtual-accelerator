
import "HackerGold.sol";
import "EventInfo.sol";
import "DSTContract.sol";

pragma solidity ^0.4.6;

/**
 *  VirtualExchange -  The exchange is a trading system used
 *                     on hack.ether.camp hackathon event to 
 *                     support trading a DST tokens for HKG. 
 *                    
 */
contract VirtualExchange{

    address owner;  
    EventInfo eventInfo;
 
    mapping (bytes32 => address) dstListed;
    
    HackerGold hackerGold;
    
    function VirtualExchange(address hackerGoldAddr, address eventInfoAddr){
    
        owner = msg.sender;
        hackerGold = HackerGold(hackerGoldAddr);
        eventInfo  = EventInfo(eventInfoAddr);
    }
    
    
    /**
     * enlist - enlisting one decentralized startup team to 
     *          the hack event virtual exchange, making the 
     *          DST initated tokens available for acquisition.
     * 
     *  @param dstAddress - address of the DSTContract 
     * 
     */ 
    function enlist(address dstAddress) onlyBeforeEnd {

        DSTContract dstContract = DSTContract(dstAddress);

        bytes32 symbolBytes = dstContract.getDSTSymbolBytes();

        /* Don't enlist 2 with the same name */
        if (isExistByBytes(symbolBytes)) throw;

        // Only owner of the DST can deploy the DST 
        if (dstContract.getExecutive() != msg.sender) throw;

        // All good enlist the company
        dstListed[symbolBytes] = dstAddress;
        
        // Indicate to DST which Virtual Exchange is enlisted
        dstContract.setVirtualExchange(address(this));
        
        // rise Enlisted event
        Enlisted(dstAddress);
    }
    
   

    /**
     *
     * buy - on the hackathon timeframe that is the function 
     *       that will be the way to buy specific tokens for 
     *       startup.
     * 
     * @param companyNameBytes - the company that is enlisted on the exchange 
     *                           and the tokens are available
     * 
     * @param hkg - the ammount of hkg to spend for aquastion 
     *
     */
    function buy(bytes32 companyNameBytes, uint hkg) onlyBeforeEnd
                                               returns (bool success) {

    
        // check DST exist 
        if (!isExistByBytes(companyNameBytes)) throw;

        // validate availability  
        DSTContract dstContract = DSTContract(dstListed[companyNameBytes]);
        uint tokensQty = hkg * dstContract.getHKGPrice();

        address veAddress = address(this);        
        
        // ensure that there is HKG balance
        uint valueHKGOwned = hackerGold.balanceOf(msg.sender);        
        if (valueHKGOwned < hkg) throw;        
        
        // ensure that there is HKG token allowed to be spend
        uint valueAvailbeOnExchange = hackerGold.allowance(msg.sender, veAddress);
        if (valueAvailbeOnExchange < hkg) throw;

        // ensure there is DST tokens for sale
        uint dstTokens = dstContract.allowance(dstContract, veAddress);
        if (dstTokens < hkg * dstContract.getHKGPrice()) throw;    
                        
        // Transfer HKG to Virtual Exchange account  
        hackerGold.transferFrom(msg.sender, veAddress, hkg);

        // Transfer to dstCotract ownership
        hackerGold.transfer(dstContract.getAddress(), hkg);         
        
        // Call DST to transfer tokens 
        dstContract.buyForHackerGold(hkg);            
    }
        

    // **************************** //
    // *     Constant Getters     * //
    // **************************** //        
    

    function isExistByBytes(bytes32 companyNameBytes) constant returns (bool result) {
            
        if (dstListed[companyNameBytes] == 0x0) 
            return false;
        else 
            return true;                  
    }
    
    function getEventStart() constant eventInfoSet returns (uint result){
        return eventInfo.getEventStart();
    }

    function getEventEnd() constant eventInfoSet returns (uint result){
        return eventInfo.getEventEnd();
    }
    
    function getNow() constant returns (uint result){
        return now;
    }
    


    // ********************* //
    // *     Modifiers     * //
    // ********************* //        
    

    modifier onlyOwner()    { if (msg.sender != owner)        throw; _; }
    modifier eventInfoSet() { if (eventInfo  == address(0))   throw; _; }
    
    modifier onlyBeforeEnd() { if (now  >= eventInfo.getEventEnd()) throw; _; }
    modifier onlyAfterEnd()  { if (now  <  eventInfo.getEventEnd()) throw; _; }
    

    // ****************** //
    // *     Events     * //
    // ****************** //        
    
    event Enlisted(address indexed dstContract);
    
    
}
