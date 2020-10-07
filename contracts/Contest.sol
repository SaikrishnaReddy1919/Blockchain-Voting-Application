pragma solidity >=0.5.6 <0.8.0;

contract Contest {
    struct Contestant {
        uint id;
        string name;
        uint voteCount;
    }
    mapping(uint => Contestant) public contestants;

    //to save the list of users/accounts who already casted vote
    mapping(address => bool) public voters;

    uint public contestantCount;

    event votedEvent(
        uint indexed _contestantId
    );

    constructor() public {
        addContestant('tom');
        addContestant('jerry');
        addContestant('krishna');
    }

    function addContestant(string memory _name) private {
        contestantCount ++;
        contestants[contestantCount] = Contestant(contestantCount, _name, 0);
    }

    function vote (uint _contestantId) public {

        //restricting the person who already casted the vote
        require(!voters[msg.sender]);//if returns true stop here

        //require that the vote is casted to a valid contestant
        require(_contestantId > 0 && _contestantId <= contestantCount);
        //increase the contestant voteCount
        contestants[_contestantId].voteCount++;
        //marking the voter who casted the vote as true so he cant vote again.
        voters[msg.sender] = true;

        emit votedEvent(_contestantId);
        
    }

}