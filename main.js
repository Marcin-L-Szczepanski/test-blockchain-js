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
    
    console.log("Block mined: " + this.hash);
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
  
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    
    console.log("Block successfully mined!");
    this.chain.push(block);
    
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }
  
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
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

let marcinCoin = new Blockchain();

marcinCoin.createTransaction(new Transaction('address1', 'address2', 100));
marcinCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting new miner...');
marcinCoin.minePendingTransactions('marcin-address');

console.log('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));

console.log('\nStarting new miner...');
marcinCoin.minePendingTransactions('marcin-address');

console.log('\nBalance of marcin is: ', marcinCoin.getBalanceOfAddress('marcin-address'));
console.log(JSON.stringify(marcinCoin, null, 4));

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