


import "StandardToken.sol";
import "EventInfo.sol";
import "HackerGold.sol";

/*
 * DSTContract - DST stands for decentralized standard team.
 *
 *
 */
contract DSTContract is StandardToken{

    address   selfAddress;

    address   executive; 
    EventInfo eventInfo;
    
    // Indicateds where the DST is threaded
    address virtualExchangeAddress;
    
    HackerGold hackerGold;
        
    mapping (address => uint256) votingRights;


    // 1 - HKG => DST qty; tokens for 1 HKG
    uint hkgPrice;
    
    
    string name; 
    
    uint preferedQtySold;
    
    
    // Proposaal of the funds spending
    mapping (uint => Proposal) proposals;
    
    struct Proposal{
        
        uint256 id;
        uint value;
        uint votindEndTS;
        
        string urlDetails;
        
        uint votesObjecting;
    }
    
    /**
     * Impeachment process proposals
     */
    uint lastTimeImpProposed;
    ImpeachmentProposal currentImpProposal;
    
    struct ImpeachmentProposal{
        
        address newExecutive;
        uint timeSubmited;
        
        uint votesYes;
        uint votesNo;
        
        
    }
    
    
    /*
     * 
     *  Set date for early adapters
     *
     */ 
    function DSTContract(EventInfo eventInfoAddr, string dstName){
    
      selfAddress = this; 
      executive   = msg.sender;  
      name        = dstName;

      eventInfo  = EventInfo(eventInfoAddr);
    }
    

    function(){
        
        // If the hack event is not over return 
        // sent ether.
        if (now < eventInfo.getEventEnd()) {
            throw;
        }
    }

    /**
     * 
     * 
     */
    function spendHKG(uint value, address targetAddr){
        
        // validate time frame
        // only executive can do it
        

        
    }
    
    
    /**
     * 
     * issuePreferedTokens - prefered tokens issued on the hackathon event
     *                       tain special rights
     * 
     */
    function issuePreferedTokens(uint qtyForOneHKG, uint qtyToEmit) onlyExecutive onlyBeforeEnd {
        
        // if part of prefered tokens was already 
        // sold prevent issuence
        if (preferedQtySold > 0) throw;
        
        // no issuence is allowed before enlisted on the
        // exchange 
        if (virtualExchangeAddress == 0x0) throw;
        
        totalSupply         += qtyToEmit;
        balances[executive] += qtyToEmit;
        hkgPrice = qtyForOneHKG;
        
        approve(virtualExchangeAddress, qtyToEmit );
    }

    /**
     * 
     * buyForHackerGold - on the hack event this function is available 
     *                    the buyer for hacker gold will gain votes to 
     *                    influence future proposals on the DST
     *                    
     * 
     */
    function buyForHackerGold(uint hkgValue) onlyBeforeEnd returns (bool success) {
    

      // Validate that the caller is official accelerator HKG Exchange
      if (msg.sender != virtualExchangeAddress) throw;
      
      
      // 1. transfer token 
      address sender = tx.origin;
      
      
      // 2. gain some voting rights
      uint price = 20; // todo: real price for hkg 
      votingRights[msg.sender] = hkgValue * price;
      balances[msg.sender] = hkgValue;
      
      // todo: change the price during the event
      
      
      // todo: reduce issued tokens from total
      
      // todo: preferedQtySold +=...
    }
    
    
    /**
     * 
     * kickStartSale - function will issue tokens for 500%
     *                 of sold on the event
     * 
     * @return - ammount of tokens issued
     */
    function kickStartSale() onlyAfterEnd 
                             onlyExecutive 
                             returns (uint result){
         
         // todo: inidicate that this is done once
         
         
         uint qty = preferedQtySold * 5;
         balances[executive] += qty;
         
         return qty;
    }
     
     
    /**
     * 
     * 
     * 
     * 
     */
    function submitProposal(uint value, string url) onlyAfterEnd 
                                                    onlyExecutive 
                                                    returns (uint result){
        
        // validate the ammount is legit
        
        // set id of the proposal
        // submit proposal to the map
        
        // Rise Event
        
        // return id
    }  
    
    
    
    /**
     * 
     * 
     * 
     */
     function objectProposal(uint256 id){
         
         // check that time for voting isn't over
         
         // calculate voting weight of the voter
         // submit votes
         
     }
    
    
     
     /**
      * 
      * 
      * 
      */
     function redeemProposalFunds(uint256 id) onlyExecutive {
         
     }
    
    
    /**
     * 
     * 
     * 
     */             
     function startImpeachmentProcess(){
         
         // todo: check there is 1 months since last one
         
         
     }
    
    
    /**
     * 
     */
    function voteForProposal(bool yes){
        

    } 
    
    
    
    /**
     * 
     *  
     * 
     */
    function executeImpeachment(){
        
        // check there is 50% voters
        // check there is 70% vote Yes
        
        // set new executive 
        // tokens transfered to new executive
        
        
    }
    
    
    
    /**
     * 
     *   Constant Function 
     * 
     */ 
    
    function votingRightsOf(address _owner) constant returns (uint256 result) {
        result = votingRights[_owner];
    }
    
    function setVirtualExchange(address virtualExchangeAddr){
        virtualExchangeAddress = virtualExchangeAddr;
    }

    function getHKGOwned() constant returns (uint result){
        return hackerGold.balanceOf(this);
    }
    
    function getExecutive() constant returns (address result){
        return executive;
    }
    
    function getHKGPrice() constant returns (uint result){
        return hkgPrice;
    }

    function getDSTName() constant returns(string result){
        return name;
    }    
    
    function getDSTNameBytes() constant returns(bytes32 result){
        return convert(name);
    }    

    function getAddress() constant returns (address result) {
        return selfAddress;
    }
    
    
    function convert(string key) returns (bytes32 ret) {
            if (bytes(key).length > 32) {
                throw;
            }      

            assembly {
                ret := mload(add(key, 32))
            }
    }    
 
    modifier onlyBeforeEnd() { if (now  >= eventInfo.getEventEnd()) throw; _ }
    modifier onlyAfterEnd()  { if (now  <= eventInfo.getEventEnd()) throw; _ }
    
    modifier onlyExecutive()     { if (msg.sender != executive)        throw; _ }
    
}


 
