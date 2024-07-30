const contract = artifacts.require("Verifier");

module.exports = async function(deployer) {
  await deployer.deploy(contract);
  const ct = await contract.deployed();
  console.log("Contract deployed at address:", ct.address);
};
