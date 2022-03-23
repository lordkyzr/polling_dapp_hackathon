var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Polling = artifacts.require("./Polling.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Polling);
};
