pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Polling.sol";

contract TestPolling {

    function testCreatePoll() public {
        
        string expected_title = "test_title";
        string expected_description = "test_description";
        string[] expected_options = ["test_option1", "test_option2"];

        Polling testPoll = createPoll(expected_title, expected_description, expected_options);
        
        Assert.equal(testPoll.get(_id), testPoll.get(totalPolls), "The ID did not match totalPolls")
        Assert.equal(testPoll.get(title), expected_title, "The title did not equal test_title");
        Assert.equal(testPoll.get(description), expected_description, "It should equal test_description");
        Assert.equal(testPoll.get(totalOptions), 2, "The options should be 2")
        Assert.equal(testPoll.get(totalVotes), 0, "There should be zero votes")

    }

    function testVoteForPoll() public {
        string expected_title = "test_title";
        string expected_description = "test_description";
        string[] expected_options = ["test_option1", "test_option2"];
        string expected_option = expected_options[1];

        Polling testPoll = createPoll(expected_title, expected_description, expected_options);
        Polling testPoll.addressVotes = Polling(DeployedAddresses.Polling());


        voteForPoll(testPoll._id, testPoll.options[1]);

        Assert.equal(testPoll.get(totalVotes), 1, "Total Votes should be one")
        Assert.equal(testPoll.get(votes[1].length), 1, "Vote for option 1 was not 1")
        Assert.equal(testPoll.get(votes[1]), expected_option[1], "The Vote text was incorrect")



    }

    function testVoteforPollalreadyvoted() public {
        string expected_title = "test_title";
        string expected_description = "test_description";
        string[] expected_options = ["test_option1", "test_option2"];
        string expected_option = expected_options[1];

        Polling testPoll = createPoll(expected_title, expected_description, expected_options);
        Polling testPoll.addressVotes = 1;

        Assert.equal(voteForPoll(testPoll._id, testPoll.options[1]), "Address already voted", "Address has not voted");
    }

    function testGetPollOptions() public {
        string expected_title = "test_title";
        string expected_description = "test_description";
        string[] expected_options = ["test_option1", "test_option2"];

        Polling testPoll = createPoll(expected_title, expected_description, expected_options);

        Assert.equal(getPollOptions(testPoll), expected_options, "The options do not match");
    }

    function testGetPollAddressVote() public {
        string expected_title = "test_title";
        string expected_description = "test_description";
        string[] expected_options = ["test_option1", "test_option2"];
        address expected_voter = DeployedAddresses.Polling();

        Polling testPoll = createPoll(expected_title, expected_description, expected_options);
        Polling testPoll.addressVotes = Polling(DeployedAddresses.Polling());

        Assert.equal(getPollAddressVote(testPoll), expected_voter, "The expected voter is missing")

    }
    
}
