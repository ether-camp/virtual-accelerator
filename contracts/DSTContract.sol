import "StandardToken.sol";
import "EventInfo.sol";
import "HackerGold.sol";

pragma solidity ^0.4.6;

/*
 * DSTContract - DST stands for decentralized startup team.
 *               the contract ensures funding for a decentralized
 *               team in 2 phases: 
 *
 *                +. Funding by HKG during the hackathon event. 
 *                +. Funding by Ether after the event is over. 
 *
 *               After the funds been collected there is a governence
 *               mechanism managed by proposition to withdraw funds
 *               for development usage. 
 *
 *               The DST ensures that backers of the projects keeps
 *               some influence on the project by ability to reject
 *               propositions they find as non effective. 
 *
 *               In very radical occasions the backers may loose 
 *               the trust in the team completelly, in that case 
 *               there is an option to propose impeachment process
 *               completelly removing the execute and assigning new
 *               person to manage the funds. 
 *
 */
contract DSTContract is StandardToken{

    // Zeros after the point
    uint DECIMAL_ZEROS = 1000;
    // Proposal lifetime
    uint PROPOSAL_LIFETIME = 10 days;
    // Proposal funds threshold, in percents
    uint PROPOSAL_FUNDS_TH = 20;

    address   executive; 
        
    EventInfo eventInfo;
    
    // Indicated where the DST is traded
    address virtualExchangeAddress;
    
    HackerGold hackerGold;
        
    mapping (address => uint256) votingRights;


    // 1 - HKG => DST qty; tokens for 1 HKG
    uint hkgPrice;
    
    // 1 - Ether => DST qty; tokens for 1 Ether
    uint etherPrice;
    
    string public name = "...";                   
    uint8  public decimals = 3;                 
    string public symbol = "...";
    
    bool ableToIssueTokens = true; 
    
    uint preferedQtySold;

    uint collectedHKG; 
    uint collectedEther;    
    
    // Proposal of the funds spending
    mapping (bytes32 => Proposal) proposals;

    enum ProposalCurrency { HKG, ETHER }
    ProposalCurrency enumDeclaration;
                  
       
    struct Proposal{
        
        bytes32 id;
        uint value;

        string urlDetails;

        uint votindEndTS;
                
        uint votesObjecting;
        
        address submitter;
        bool redeemed;

        ProposalCurrency proposalCurrency;
        
        mapping (address => bool) voted;
    }
    uint counterProposals;
    uint timeOfLastProposal;
    
    Proposal[] listProposals;
    

    /**
     * Impeachment process proposals
     */    
    struct ImpeachmentProposal{
        
        string urlDetails;
        
        address newExecutive;

        uint votindEndTS;        
        uint votesSupporting;
        
        mapping (address => bool) voted;        
    }
    ImpeachmentProposal lastImpeachmentProposal;

        
    /**
     * 
     *  DSTContract: ctor for DST token and governence contract
     *
     *  @param eventInfoAddr EventInfo: address of object denotes events 
     *                                  milestones      
     *  @param hackerGoldAddr HackerGold: address of HackerGold token
     *
     *  @param dstName string: dstName: real name of the team
     *
     *  @param dstSymbol string: 3 letter symbold of the team
     *
     */ 
    function DSTContract(EventInfo eventInfoAddr, HackerGold hackerGoldAddr, string dstName, string dstSymbol){
    
      executive   = msg.sender;  
      name        = dstName;
      symbol      = dstSymbol;

      hackerGold = HackerGold(hackerGoldAddr);
      eventInfo  = EventInfo(eventInfoAddr);
    }
    

    function() payable
               onlyAfterEnd {
        
        // there is tokens left from hackathon 
        if (etherPrice == 0) throw;
        
        uint tokens = msg.value * etherPrice * DECIMAL_ZEROS / (1 ether);
        
        // check if demand of tokens is 
        // overflow the supply 
        uint retEther = 0;
        if (balances[this] < tokens) {
            
            tokens = balances[this];
            retEther = msg.value - tokens / etherPrice * (1 finney);
        
            // return left ether 
            if (!msg.sender.send(retEther)) throw;
        }
        
        
        // do transfer
        balances[msg.sender] += tokens;
        balances[this] -= tokens;
        
        // count collected ether 
        collectedEther += msg.value - retEther; 
        
        // rise event
        BuyForEtherTransaction(msg.sender, collectedEther, totalSupply, etherPrice, tokens);
        
    }

    
    
    /**
     * setHKGPrice - set price: 1HKG => DST tokens qty
     *
     *  @param qtyForOneHKG uint: DST tokens for 1 HKG
     * 
     */    
     function setHKGPrice(uint qtyForOneHKG) onlyExecutive  {
         
         hkgPrice = qtyForOneHKG;
         PriceHKGChange(qtyForOneHKG, preferedQtySold, totalSupply);
     }
     
     
    
    /**
     * 
     * issuePreferedTokens - prefered tokens issued on the hackathon event
     *                       grant special rights
     *
     *  @param qtyForOneHKG uint: price DST tokens for one 1 HKG
     *  @param qtyToEmit uint: new supply of tokens 
     * 
     */
    function issuePreferedTokens(uint qtyForOneHKG, 
                                 uint qtyToEmit) onlyExecutive 
                                                 onlyIfAbleToIssueTokens
                                                 onlyBeforeEnd
                                                 onlyAfterTradingStart {
                
        // no issuence is allowed before enlisted on the
        // exchange 
        if (virtualExchangeAddress == 0x0) throw;
            
        totalSupply    += qtyToEmit;
        balances[this] += qtyToEmit;
        hkgPrice = qtyForOneHKG;
        
        
        // now spender can use balance in 
        // amount of value from owner balance
        allowed[this][virtualExchangeAddress] += qtyToEmit;
        
        // rise event about the transaction
        Approval(this, virtualExchangeAddress, qtyToEmit);
        
        // rise event 
        DstTokensIssued(hkgPrice, preferedQtySold, totalSupply, qtyToEmit);
    }

    
    
    
    /**
     * 
     * buyForHackerGold - on the hack event this function is available 
     *                    the buyer for hacker gold will gain votes to 
     *                    influence future proposals on the DST
     *    
     *  @param hkgValue - qty of this DST tokens for 1 HKG     
     * 
     */
    function buyForHackerGold(uint hkgValue) onlyBeforeEnd 
                                             returns (bool success) {
    
      // validate that the caller is official accelerator HKG Exchange
      if (msg.sender != virtualExchangeAddress) throw;
      
      
      // transfer token 
      address sender = tx.origin;
      uint tokensQty = hkgValue * hkgPrice;

      // gain voting rights
      votingRights[sender] +=tokensQty;
      preferedQtySold += tokensQty;
      collectedHKG += hkgValue;

      // do actual transfer
      transferFrom(this, 
                   virtualExchangeAddress, tokensQty);
      transfer(sender, tokensQty);        
            
      // rise event       
      BuyForHKGTransaction(sender, preferedQtySold, totalSupply, hkgPrice, tokensQty);
        
      return true;
    }
        
    
    /**
     * 
     * issueTokens - function will issue tokens after the 
     *               event, able to sell for 1 ether 
     * 
     *  @param qtyForOneEther uint: DST tokens for 1 ETH
     *  @param qtyToEmit uint: new tokens supply
     *
     */
    function issueTokens(uint qtyForOneEther, 
                         uint qtyToEmit) onlyAfterEnd 
                                         onlyExecutive
                                         onlyIfAbleToIssueTokens {
         
         balances[this] += qtyToEmit;
         etherPrice = qtyForOneEther;
         totalSupply    += qtyToEmit;
         
         // rise event  
         DstTokensIssued(qtyForOneEther, totalSupply, totalSupply, qtyToEmit);
    }
     
    
    /**
     * setEtherPrice - change the token price
     *
     *  @param qtyForOneEther uint: new price - DST tokens for 1 ETH
     */     
    function setEtherPrice(uint qtyForOneEther) onlyAfterEnd
                                                onlyExecutive {
         etherPrice = qtyForOneEther; 

         // rise event for this
         NewEtherPrice(qtyForOneEther);
    }    
    

    /**
     *  disableTokenIssuance - function will disable any 
     *                         option for future token 
     *                         issuence
     */
    function disableTokenIssuance() onlyExecutive {
        ableToIssueTokens = false;
        
        DisableTokenIssuance();
    }

    
    /**
     *  burnRemainToken -  eliminated all available for sale
     *                     tokens. 
     */
    function burnRemainToken() onlyExecutive {
    
        totalSupply -= balances[this];
        balances[this] = 0;
        
        // rise event for this
        BurnedAllRemainedTokens();
    }
    
    /**
     *  submitEtherProposal: submit proposal to use part of the 
     *                       collected ether funds
     *
     *   @param requestValue uint: value in wei 
     *   @param url string: details of the proposal 
     */ 
    function submitEtherProposal(uint requestValue, string url) onlyAfterEnd 
                                                                onlyExecutive returns (bytes32 resultId, bool resultSucces) {       
    
        // ensure there is no more issuence available 
        if (ableToIssueTokens) throw;
            
        // ensure there is no more tokens available 
        if (balanceOf(this) > 0) throw;

        // Possible to submit a proposal once 2 weeks 
        if (now < (timeOfLastProposal + 2 weeks)) throw;
            
        uint percent = collectedEther / 100;
            
        if (requestValue > PROPOSAL_FUNDS_TH * percent) throw;

        // if remained value is less than requested gain all.
        if (requestValue > this.balance) 
            requestValue = this.balance;    
            
        // set id of the proposal
        // submit proposal to the map
        bytes32 id = sha3(msg.data, now);
        uint timeEnds = now + PROPOSAL_LIFETIME; 
            
        Proposal memory newProposal = Proposal(id, requestValue, url, timeEnds, 0, msg.sender, false, ProposalCurrency.ETHER);
        proposals[id] = newProposal;
        listProposals.push(newProposal);
            
        timeOfLastProposal = now;                        
        ProposalRequestSubmitted(id, requestValue, timeEnds, url, msg.sender);
        
        return (id, true);
    }
    
    
     
    /**
     * 
     * submitHKGProposal - submit proposal to request for 
     *                     partial HKG funds collected 
     * 
     *  @param requestValue uint: value in HKG to request. 
     *  @param url string: url with details on the proposition 
     */
    function submitHKGProposal(uint requestValue, string url) onlyAfterEnd
                                                              onlyExecutive returns (bytes32 resultId, bool resultSucces){
        

        // If there is no 2 months over since the last event.
        // There is no posible to get any HKG. After 2 months
        // all the HKG is available. 
        if (now < (eventInfo.getEventEnd() + 8 weeks)) {
            throw;
        }

        // Possible to submit a proposal once 2 weeks 
        if (now < (timeOfLastProposal + 2 weeks)) throw;

        uint percent = preferedQtySold / 100;
        
        // validate the amount is legit
        // first 5 proposals should be less than 20% 
        if (counterProposals <= 5 && 
            requestValue     >  PROPOSAL_FUNDS_TH * percent) throw;
                
        // if remained value is less than requested 
        // gain all.
        if (requestValue > getHKGOwned()) 
            requestValue = getHKGOwned();
        
        
        // set id of the proposal
        // submit proposal to the map
        bytes32 id = sha3(msg.data, now);
        uint timeEnds = now + PROPOSAL_LIFETIME; 
        
        Proposal memory newProposal = Proposal(id, requestValue, url, timeEnds, 0, msg.sender, false, ProposalCurrency.HKG);
        proposals[id] = newProposal;
        listProposals.push(newProposal);
        
        ++counterProposals;
        timeOfLastProposal = now;                
                
        ProposalRequestSubmitted(id, requestValue, timeEnds, url, msg.sender);
        
        return (id, true);        
    }  
    
    
    
    /**
     * objectProposal - object previously submitted proposal, 
     *                  the objection right is obtained by 
     *                  purchasing prefered tokens on time of 
     *                  the hackathon.
     * 
     *  @param id bytes32 : the id of the proposla to redeem
     */
     function objectProposal(bytes32 id){
         
        Proposal memory proposal = proposals[id];
         
        // check proposal exist 
        if (proposals[id].id == 0) throw;

        // check already redeemed
        if (proposals[id].redeemed) throw;
         
        // ensure objection time
        if (now >= proposals[id].votindEndTS) throw;
         
        // ensure not voted  
        if (proposals[id].voted[msg.sender]) throw;
         
         // submit votes
         uint votes = votingRights[msg.sender];
         proposals[id].votesObjecting += votes;
         
         // mark voted 
         proposals[id].voted[msg.sender] = true; 
         
         uint idx = getIndexByProposalId(id);
         listProposals[idx] = proposals[id];   

         ObjectedVote(id, msg.sender, votes);         
     }
     
     
     function getIndexByProposalId(bytes32 id) returns (uint result){
         
         for (uint i = 0; i < listProposals.length; ++i){
             if (id == listProposals[i].id) return i;
         }
     }
    
    
   
    /**
     * redeemProposalFunds - redeem funds requested by prior 
     *                       submitted proposal     
     * 
     * @param id bytes32: the id of the proposal to redeem
     */
    function redeemProposalFunds(bytes32 id) onlyExecutive {

        if (proposals[id].id == 0) throw;
        if (proposals[id].submitter != msg.sender) throw;

        // ensure objection time
        if (now < proposals[id].votindEndTS) throw;
                           
    
            // check already redeemed
        if (proposals[id].redeemed) throw;

        // check votes objection => 55% of total votes
        uint objectionThreshold = preferedQtySold / 100 * 55;
        if (proposals[id].votesObjecting  > objectionThreshold) throw;
    
    
        if (proposals[id].proposalCurrency == ProposalCurrency.HKG){
            
            // send hacker gold 
            hackerGold.transfer(proposals[id].submitter, proposals[id].value);      
                        
        } else {
                        
           // send ether              
           bool success = proposals[id].submitter.send(proposals[id].value); 

           // rise event
           EtherRedeemAccepted(proposals[id].submitter, proposals[id].value);                              
        }
        
        // execute the proposal 
        proposals[id].redeemed = true; 
    }
    
    
    /**
     *  getAllTheFunds - to ensure there is no deadlock can 
     *                   can happen, and no case that voting 
     *                   structure will freeze the funds forever
     *                   the startup will be able to get all the
     *                   funds without a proposal required after
     *                   6 months.
     * 
     * 
     */             
    function getAllTheFunds() onlyExecutive {
        
        // If there is a deadlock in voting participates
        // the funds can be redeemed completelly in 6 months
        if (now < (eventInfo.getEventEnd() + 24 weeks)) {
            throw;
        }  
        
        // all the Ether
        bool success = msg.sender.send(this.balance);        
        
        // all the HKG
        hackerGold.transfer(msg.sender, getHKGOwned());              
    }
    
    
    /**
     * submitImpeachmentProposal - submit request to switch 
     *                             executive.
     * 
     *  @param urlDetails  - details of the impeachment proposal 
     *  @param newExecutive - address of the new executive 
     * 
     */             
     function submitImpeachmentProposal(string urlDetails, address newExecutive){
         
        // to offer impeachment you should have 
        // voting rights
        if (votingRights[msg.sender] == 0) throw;
         
        // the submission of the first impeachment 
        // proposal is possible only after 3 months
        // since the hackathon is over
        if (now < (eventInfo.getEventEnd() + 12 weeks)) throw;
        
                
        // check there is 1 months over since last one
        if (lastImpeachmentProposal.votindEndTS != 0 && 
            lastImpeachmentProposal.votindEndTS +  2 weeks > now) throw;


        // submit impeachment proposal
        // add the votes of the submitter 
        // to the proposal right away
        lastImpeachmentProposal = ImpeachmentProposal(urlDetails, newExecutive, now + 2 weeks, votingRights[msg.sender]);
        lastImpeachmentProposal.voted[msg.sender] = true;
         
        // rise event
        ImpeachmentProposed(msg.sender, urlDetails, now + 2 weeks, newExecutive);
     }
    
    
    /**
     * supportImpeachment - vote for impeachment proposal 
     *                      that is currently in progress
     *
     */
    function supportImpeachment(){

        // ensure that support is for exist proposal 
        if (lastImpeachmentProposal.newExecutive == 0x0) throw;
    
        // to offer impeachment you should have 
        // voting rights
        if (votingRights[msg.sender] == 0) throw;
        
        // check if not voted already 
        if (lastImpeachmentProposal.voted[msg.sender]) throw;
        
        // check if not finished the 2 weeks of voting 
        if (lastImpeachmentProposal.votindEndTS + 2 weeks <= now) throw;
                
        // support the impeachment
        lastImpeachmentProposal.voted[msg.sender] = true;
        lastImpeachmentProposal.votesSupporting += votingRights[msg.sender];

        // rise impeachment suppporting event
        ImpeachmentSupport(msg.sender, votingRights[msg.sender]);
        
        // if the vote is over 70% execute the switch 
        uint percent = preferedQtySold / 100; 
        
        if (lastImpeachmentProposal.votesSupporting >= 70 * percent){
            executive = lastImpeachmentProposal.newExecutive;
            
            // impeachment event
            ImpeachmentAccepted(executive);
        }
        
    } 
    
      
    
    // **************************** //
    // *     Constant Getters     * //
    // **************************** //
    
    function votingRightsOf(address _owner) constant returns (uint256 result) {
        result = votingRights[_owner];
    }
    
    function getPreferedQtySold() constant returns (uint result){
        return preferedQtySold;
    }
    
    function setVirtualExchange(address virtualExchangeAddr){
        if (virtualExchangeAddress != 0x0) throw;
        virtualExchangeAddress = virtualExchangeAddr;
    }

    function getHKGOwned() constant returns (uint result){
        return hackerGold.balanceOf(this);
    }
    
    function getEtherValue() constant returns (uint result){
        return this.balance;
    }
    
    function getExecutive() constant returns (address result){
        return executive;
    }
    
    function getHKGPrice() constant returns (uint result){
        return hkgPrice;
    }

    function getEtherPrice() constant returns (uint result){
        return etherPrice;
    }
    
    function getDSTName() constant returns(string result){
        return name;
    }    
    
    function getDSTNameBytes() constant returns(bytes32 result){
        return convert(name);
    }    

    function getDSTSymbol() constant returns(string result){
        return symbol;
    }    
    
    function getDSTSymbolBytes() constant returns(bytes32 result){
        return convert(symbol);
    }    

    function getAddress() constant returns (address result) {
        return this;
    }
    
    function getTotalSupply() constant returns (uint result) {
        return totalSupply;
    } 
        
    function getCollectedEther() constant returns (uint results) {        
        return collectedEther;
    }
    
    function getCounterProposals() constant returns (uint result){
        return counterProposals;
    }
        
    function getProposalIdByIndex(uint i) constant returns (bytes32 result){
        return listProposals[i].id;
    }    

    function getProposalObjectionByIndex(uint i) constant returns (uint result){
        return listProposals[i].votesObjecting;
    }

    function getProposalValueByIndex(uint i) constant returns (uint result){
        return listProposals[i].value;
    }                  
    
    function getCurrentImpeachmentUrlDetails() constant returns (string result){
        return lastImpeachmentProposal.urlDetails;
    }
    
    
    function getCurrentImpeachmentVotesSupporting() constant returns (uint result){
        return lastImpeachmentProposal.votesSupporting;
    }
    
    function convert(string key) returns (bytes32 ret) {
            if (bytes(key).length > 32) {
                throw;
            }      

            assembly {
                ret := mload(add(key, 32))
            }
    }    
    
    
    
    // ********************* //
    // *     Modifiers     * //
    // ********************* //    
 
    modifier onlyBeforeEnd() { if (now  >=  eventInfo.getEventEnd()) throw; _; }
    modifier onlyAfterEnd()  { if (now  <   eventInfo.getEventEnd()) throw; _; }
    
    modifier onlyAfterTradingStart()  { if (now  < eventInfo.getTradingStart()) throw; _; }
    
    modifier onlyExecutive()     { if (msg.sender != executive) throw; _; }
                                       
    modifier onlyIfAbleToIssueTokens()  { if (!ableToIssueTokens) throw; _; } 
    

    // ****************** //
    // *     Events     * //
    // ****************** //        

    
    event PriceHKGChange(uint indexed qtyForOneHKG, uint indexed tokensSold, uint indexed totalSupply);
    event BuyForHKGTransaction(address indexed buyer, uint indexed tokensSold, uint indexed totalSupply, uint qtyForOneHKG, uint tokensAmount);
    event BuyForEtherTransaction(address indexed buyer, uint indexed tokensSold, uint indexed totalSupply, uint qtyForOneEther, uint tokensAmount);

    event DstTokensIssued(uint indexed qtyForOneHKG, uint indexed tokensSold, uint indexed totalSupply, uint qtyToEmit);
    
    event ProposalRequestSubmitted(bytes32 id, uint value, uint timeEnds, string url, address sender);
    
    event EtherRedeemAccepted(address sender, uint value);
    
    event ObjectedVote(bytes32 id, address voter, uint votes);
    
    event ImpeachmentProposed(address submitter, string urlDetails, uint votindEndTS, address newExecutive);
    event ImpeachmentSupport(address supportter, uint votes);
    
    event ImpeachmentAccepted(address newExecutive);

    event NewEtherPrice(uint newQtyForOneEther);
    event DisableTokenIssuance();
    
    event BurnedAllRemainedTokens();
    
}


 
