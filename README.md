# Understanding blockchain by creating a blockchain in JavaScript

Project description

## Main classes
The applications has three classes:
- `Transaction`
- `Block`
- `Blockchain`

### Block

Defining what a block in a blockchain looks like by creating class called Block.
Class Block has 5 parameters defined in the constructor and two methods `calculateHash()` and `mineBlock(difficulty)`.
Constructor for class Block receives properties:
- index - where the blocks sits on the chain (optional)
- timestamp - when the block was created
- data - e.g. details for transactions (how much money was transfered, who was the sender and receiver)
- previous hash - string that contains the hash of the block before the current one. It ensures integrity of the blockchain (empty string by default)
```javascript
class Block {
  constructor (index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }
}
```
#### `calculateHash()`
.calculateHash() method calculates and returns SHA256 hash for the current block, i.e. its index, nonce, transactions, timestamp and previous hash.
```javascript
calculateHash() {
  return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
}
```
`JSON.stringify()` converts a JavaScript object to a JSON string. The opposite method is `JSON.parse()`, which converts a JSON string to a JavaScript object.
?? How does .toString() work?

SHA256 function isn't available in JavaScript by default.
We need to import a library to use SHA256 hashing function called ['crypto-js'](https://www.npmjs.com/package/crypto-js).
At the top of the script we need to import and assign the SHA256 hashing function:
```javascript
const SHA256 = require('crypto-js/sha256');
```

#### `mineBlock(difficulty)`
```javascript
mineBlock(difficulty) {
  while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    this.hash = this.calculateHash();
    this.nonce++;
  }
}
```

### Blockchain

Another class describes a blockchain.
The constructor is responsible for initializing the blockchain.
It has one property `this.chain = [this.createGenesisBlock()]`, which is an array of blocks with the Genesis block created when the blockchain is initialized.

The Blockchain class has 6 methods:
- [`createGenesisBlock()`](#creategenesisblock)
- [`getLatestBlock()`](#getlatestblock)
-   `minePendingTransactions(miningRewardAddress)`
- `createTransaction(transaction)`
- `getBalanceOfAddress(address)`
- `isChainValid()`

#### `createGenesisBlock()`
First block on a blockchain is called 'genesis block' and it should be added manually, which will be done by a method `createGenesisBlock()`:
```javascript
createGenesisBlock() {
  return new Block("01/01/2018", "Genesis block", "0");
}
```
It returns a new Block object with properties passed as arguments (timestamp, transactions, previous block).

#### `getLatestBlock()`
It returns the lastest block in the chain, i.e. the last element in the array.
```javascript
getLatestBlock() {
  return this.chain[this.chain.length - 1];
}
```

One of the blockchain's features is immutability. It means that once a block is added it cannot be changed without invalidating with the rest of the chain.
Before adding the new block on to the chain, it needs to be verified whether it's valid.
#### `isChainValid()`
It returns true if the block is valid or false if something is wrong.
In order to verify the chain's integrity, we need to loop through the entire chain starting from the second block (we don't need to check the genesis block).
We need to test:
1) If hash of current block is correct - if the value of hash property is equal to the hashing result of the actual content of the current block (recalculation using calculateHash() method)
2) If current block points correctly to previous block's hash - if the value of previousHash property of the current block is equal to the value of hash property of the previous block
```javascript
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
```
If something will be changed in one of the existing blocks, the method will return false for that block and all the following blocks.
The problem remains that if you recalculate hash for the changed block and all after that and the chain will be valid.

New block needs to be added to the chain. Basically, it could be done by 1) assigning the value of the latest block's hash to the 'previousHash' property of the current block, 2) calculating hash for the current block's 'hash' property and 3) pushing the new block to the chain.

However, there is more checks that need to be done before pushing the new block on to the chain.
Blockchain needs to have proof-of-work process called mining. You have to prove that you put enough computer power into making a new block. 




#### `minePendingTransactions(miningRewardAddress)`
