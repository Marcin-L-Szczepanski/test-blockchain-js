const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }
  
  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];    // array of blocks
  }
  
  createGenesisBlock() {
    return new Block(0, "01/01/2018", "Genesis block", "0");
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
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
marcinCoin.addBlock(new Block(1, "10/01/2018", { amount: 4}));
marcinCoin.addBlock(new Block(2, "17/01/2018", { amount: 100}));

console.log("Is blockchain valid? " + marcinCoin.isChainValid());

//console.log(JSON.stringify(marcinCoin, null, 4));