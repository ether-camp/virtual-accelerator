
import "HackerGold.sol";
import "EventInfo.sol";
import "DSTContract.sol";

/**
 *    The exchange is valid system 
 *    to purchase tokens from DST
 *    participating on the hacking event.
 * 
 */
contract VirtualExchange{

    address owner;  
    EventInfo eventInfo;
 
    /* todo: set address for eventinfo*/
    
    
    mapping (bytes32 => address) dstListed;
    
    HackerGold hackerGold;
    
    function VirtualExchange(address hackerGoldAddr){
    
        owner = msg.sender;
        hackerGold = HackerGold(hackerGoldAddr);
    }
    
    
    function setEventInfo(address eventInfoAddr) onlyOwner{
        
        eventInfo = EventInfo(eventInfoAddr);
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
    
    /**
     * Check if company already enlisted 
     */
    function isExist(bytes32 companyName) constant returns (bool result) {
    
        if (dstListed[companyName] == 0x0) 
            return false;
        else 
            return true;                  
    }
    

    /**
     * enlist - enlisting one decentralized startup team to 
     *          the hack event virtual exchange, making the 
     *          DST initated tokens available for aquasition.
     * 
     *  @param dstAddress - address of the DSTContract 
     * 
     */ 
    function enlist(address dstAddress){

        DSTContract dstContract = DSTContract(dstAddress);

        /* Don't enlist 2 with the same name */
        if (isExist(dstContract.getDSTName())) throw;

        // Only owner of the DST can deploy the DST 
        if (dstContract.getExecutive() != msg.sender) throw;

        // All good enlist the company
        dstListed[dstContract.getDSTName()] = dstAddress;
        
        // Indicate to DST which Virtual Exchange is enlisted
        dstContract.setVirtualExchange(address(this));

        // rise Enlisted event
        Enlisted(dstAddress);
    }
    
    
    
    /**
     *
     */
    function delist(){
        // +. only after the event is done
        // +. only by owner of the DSG
    }


    /**
     *
     * buy - on the hackathon timeframe that is the function 
     *       that will be the way to buy speciphic tokens for 
     *       startup.
     * 
     * @param companyName - the company that is enlisted on the exchange 
     *                      and the tokens are available
     * 
     * @param hkg - the ammount of hkg to spend for aquastion 
     *
     */
    function buy(bytes32 companyName, uint hkg) returns (bool success) {
        
        // check DST exist 
        if (!isExist(companyName)) throw;
        
        // validate availability  
        DSTContract dstContract = DSTContract(dstListed[companyName]);
        uint tokensQty = hkg * dstContract.getHKGPrice();

        // todo: check that hkg is available        
        // todo: check that tokens are available
        
        address veAddress = address(this);        
        // ensure that there is HKG token allowed to be spend
        uint valueAvailbeOnExchange = hackerGold.allowance(veAddress, msg.sender);
        
        // if (valueAvailbeOnExchange < hkg) throw;

        
        // Transfer HKG to Virtual Exchange account  
        hackerGold.transferFrom(msg.sender, veAddress, hkg);

        // Transfer to dstCotract ownership
        hackerGold.transfer(dstContract.getAddress(), hkg);         
        
        
        // Transfer on DSTContract tokens 
        dstContract.transferFrom(dstContract.getExecutive(), veAddress, tokensQty);
        dstContract.transfer(msg.sender, tokensQty);         
    }
    
    
    
    /* todo functions */
    
    // sell();
    // regPlayer();
    
    
    
    modifier onlyOwner()    { if (msg.sender != owner)        throw; _ }
    modifier eventInfoSet() { if (eventInfo  == address(0))   throw; _ }
    
    
    
    // events notifications
    event Enlisted(address indexed dstContract);
    
    
}
