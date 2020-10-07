var Contest = artifacts.require("./Contest.sol")

contract("Contest", function (accounts) {
    //to check if initialized  correctly

    it("Contract initializes with three contestants", () => {
        return Contest.deployed().then(instance => {
            return instance.contestantCount();
        }).then(count => assert.equal(count, 3, "Test passed : three contestants"));
    })

    it("it initializes the contestants with the correct values", () => {
        return Contest.deployed().then(instance => {
            contestInstance = instance
            return contestInstance.contestants(1)
        }).then(contestant => {
            assert.equal(contestant[0], 1, "Contains correct id")
            assert.equal(contestant[1], 'tom', "Contains the correct name")
            assert.equal(contestant[2], 0, "Contains correct votes count")
            return contestInstance.contestants(2)
        }).then(contestant => {
            assert.equal(contestant[0], 2, "Contains correct id")
            assert.equal(contestant[1], 'jerry', "Contains the correct name")
            assert.equal(contestant[2], 0, "Contains correct votes count")
            return contestInstance.contestants(3)
        }).then(contestant => {
            assert.equal(contestant[0], 3, "Contains correct id")
            assert.equal(contestant[1], 'krishna', "Contains the correct name")
            assert.equal(contestant[2], 0, "Contains correct votes count")
        })
    })

    it('allows a voter to cast a vote', () => {
        return Contest.deployed().then(instance => {
            contestInstance = instance;
            contestantId = 2
            return contestInstance.vote(contestantId, {from : accounts[0]})
        }).then(receipt => {
            return contestInstance.voters(accounts[0])
        }).then(voted => {
            assert(voted, "The voter marked as a voted");
            return contestInstance.contestants(contestantId)
        }).then(contestant => {
            var voteCount =  contestant[2]
            assert.equal(voteCount, 1, "increment the contestant's vote count")
        })
    })
})