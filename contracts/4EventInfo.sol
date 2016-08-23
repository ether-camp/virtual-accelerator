
/**
 * 
 * EventInfo - imutable class that denotes
 * the time of the virtual accelerator hack
 * event
 * 
 */
contract EventInfo{
    
    uint constant HACKATHON_5_WEEKS = 60 * 60 * 24 * 7 * 5;

    uint eventStart = 1478512800;
    uint eventEnd = eventStart + HACKATHON_5_WEEKS;
    

    function getEventStart() constant returns (uint result){
        
       return eventStart;
    } 
    
    function getEventEnd() constant returns (uint result){
        
       return eventEnd;
    } 

    
    
}
