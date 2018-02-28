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
}

let marcinCoin = new Blockchain();
marcinCoin.addBlock(new Block(1, "10/01/2018", { amount: 4}));
marcinCoin.addBlock(new Block(1, "17/01/2018", { amount: 1000}));

console.log(JSON.stringify(marcinCoin, null, 4));