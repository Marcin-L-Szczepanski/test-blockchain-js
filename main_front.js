const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor (fromAddress, toAddress, amount) {
    this.fromAdress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  
  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }
  
  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.hash = this.calculateHash();
      this.nonce++;
    }
    
    alert("Block mined: " + this.hash);
  }
}


class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];    // array of blocks
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  
  createGenesisBlock() {
    return new Block("01/01/2018", "Genesis block", "0");
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }
  
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.previousHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);
    
    alert("Block successfully mined!");
    this.chain.push(block);
    
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }
  

  
  getBalanceOfAddress(address) {
    let balance = 0;
    
    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if (trans.fromAdress === address) {
          balance -= trans.amount;
        }
        
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    
    return balance;
  }
  
  howManyTransactions(address) {
    let numberOfTransactions = 0;

    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if (trans.fromAdress === address || trans.toAddress === address) {
          numberOfTransactions++;
        }
      }
    }

    return numberOfTransactions;
  }
  
  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBLock = this.chain[i - 1];
      
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      
      if (currentBlock.previousHash !== previousBLock.hash) {
        return false;
      }
    }
    
    return true;
  }
}

const msg = document.getElementById("msg");
const transactionButton = document.getElementById("transactionButton");
const mineButton = document.getElementById("mineButton");
let i = 1;

transactionButton.addEventListener("click", function() {
  let fromAddress = document.getElementById("fromAddress").value;
  let toAddress = document.getElementById("toAddress").value;
  let amount = document.getElementById("amount").value;
  marcinCoin.createTransaction(new Transaction(fromAddress, toAddress, amount));
  alert("Transaction Added");
} , false);

mineButton.addEventListener("click", function() {
  alert('\nStarting new miner...');
  marcinCoin.minePendingTransactions('marcin-address');
  let status = console.log(JSON.stringify(marcinCoin, null, 4));
  msg.innerHTML = status;
  i++;
} , false);
let marcinCoin = new Blockchain();






document.write('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));

/*
console.log('\nStarting new miner...');
marcinCoin.minePendingTransactions('marcin-address');

console.log('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));

console.log('\nStarting new miner...');
marcinCoin.minePendingTransactions('marcin-address');

console.log(JSON.stringify(marcinCoin, null, 4));
console.log('\nMarcin did : ', marcinCoin.howManyTransactions('marcin-address'),' transactions');
console.log('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));
console.log('\nAddress1 : ', marcinCoin.howManyTransactions('address1'),' transactions');
console.log('\nBalance of address1 is: ', marcinCoin.getBalanceOfAddress('address1'));
console.log('\nAddress2 did : ', marcinCoin.howManyTransactions('address2'),' transactions');
console.log('\nBalance of address2 is: ', marcinCoin.getBalanceOfAddress('address2'));

document.write('\nThere are: ', marcinCoin.chain.length, ' blocks in total');
document.write(marcinCoin.chain[2].transactions);*/
  
/*+



console.log('\nStarting new miner...');
marcinCoin.minePendingTransactions('marcin-address');

console.log('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));

console.log('\nStarting new miner...');
marcinCoin.minePendingTransactions('marcin-address');

console.log('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));

console.log(SHA256("abc"));
*/

/*
console.log("Mining block 1...");
marcinCoin.addBlock(new Block(1, "10/01/2018", { amount: 4}));

console.log("Mining block 2...");
marcinCoin.addBlock(new Block(2, "17/01/2018", { amount: 100}));
*/



/*
console.log("Is blockchain valid? " + marcinCoin.isChainValid());
console.log(JSON.stringify(marcinCoin, null, 4));


marcinCoin.chain[1].data = { amount: 1000 };
console.log("Is blockchain valid? " + marcinCoin.isChainValid());
console.log(JSON.stringify(marcinCoin, null, 4));
*/