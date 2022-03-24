pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Polling {
    mapping(uint => Poll) public polls;
    uint public totalPolls = 0;
    
    struct Poll {
        uint _id;
        string title;
        string description;
        string[] options;
        uint totalOptions;
        uint totalVotes;
        mapping(uint => uint) votes;
        mapping(address => uint) addressVotes;
    }

    function createPoll(string memory title, string memory description, string[] memory options) public {
        totalPolls++;

        polls[totalPolls] = Poll({
            _id: totalPolls,
            title: title,
            description: description,
            options: options,
            totalOptions: options.length,
            totalVotes: 0
        });
    }

    function voteForPoll(uint id, uint option) public {
        Poll storage poll = polls[id];
        
        require(poll.addressVotes[msg.sender] == 0, "Address already voted.");
        
        poll.totalVotes++;
        poll.votes[option]++;
        poll.addressVotes[msg.sender] = option;
    }

    function getPollOptions(uint id) public view returns(string [] memory) {
        Poll memory poll = polls[id];
        return poll.options;
    }

    function getPollAddressVote(uint id, address voter) public view returns(uint) {
        Poll storage poll = polls[id];
        return poll.addressVotes[voter];
    }
}