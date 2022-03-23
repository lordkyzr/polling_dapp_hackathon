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
}