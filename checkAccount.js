const Web3 = require('web3')
const web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(web3Provider);
const getAccount = async () => {
   const accounts = await web3.eth.getAccounts();
   console.log(accounts);
};
getAccount();