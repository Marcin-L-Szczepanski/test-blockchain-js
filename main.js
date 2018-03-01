const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor (fromAddress, toAddress, amount) {
    this.fromAdress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transaactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transaction;
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
  
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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