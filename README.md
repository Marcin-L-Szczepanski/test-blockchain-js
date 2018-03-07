# Understanding blockchain by creating a blockchain in JavaScript

Project description

## Main classes
The applications has three classes:
- [`Transaction`](#transactions)
- [`Block`](#block)
- [`Blockchain`](#blockchain)

### Transactions

Defining what a transaction looks like by creating class called Transactions.

Class Transactions has 3 parameters defined in the constructor.

Constructor receives arguments for address from which the transaction is received, address where the transactions is sent and the amounts:
```javascript
class Transaction {
  constructor (fromAddress, toAddress, amount) {
    this.fromAdress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
   ```
### Block

Defining what a block in a blockchain looks like by creating class called Block.

There are 5 elements in a block:
- nonce - a number that is being changed in the process of mining in order to find a valid hash
- transactions - e.g. details for transactions (how much money was transfered, who was the sender and receiver)
- timestamp - when the block was created
- hash - string that contains the hash of the current block
- previous hash - string that contains the hash of the block before the current one. It ensures integrity of the blockchain

Class Block has 5 parameters defined in the constructor and two methods `calculateHash()` and `mineBlock(difficulty)`.

Constructor for class Block receives arguments for timestamp, transacations and previous hash:
```javascript
class Block {
  constructor (timestamp, transactions, previousHash = '') {
    this.nonce = 0;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }
  calculateHash() {
    (...)
  }
  mineBlock() {
    (...)
  }
}
```
#### `calculateHash()`
.calculateHash() method calculates and returns SHA256 hash for the current block, i.e. its nonce, transactions, timestamp and previous hash.
```javascript
calculateHash() {
  return SHA256(this.nonce + this.timestamp + JSON.stringify(this.transactions) + this.previousHash).toString();
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
Basically, a new block can be added on to the chain by 1) calculating hash for the current block's 'hash' property 2) assigning the value of the latest block's hash to the 'previousHash' property of the current block, 3) [checking if it is valid](#getlatestblock) and 4) pushing the new block to the chain.

However, with the modern computers, blocks could be added on to the blockchain in huge number within seconds. There needs to be a mechanism that sets a steady amount of new blocks (for example bitcoins aims to create new blocks every ten minutes). 

To prevent these issues, blockchain needs to have proof-of-work meachanism called mining. It requires a prove that a miner put enough computer power into making a new block.
For example, instead of generating any hash, the blockchain may require that a hash must start with 0. That makes finding a valid hash more difficult and requires more computer power. Since computers get faster over time, they will require less time to create a new block. To compensate that, the difficulty needs to be increased. It can be done by requiring another zero in the beginning.

Of course, we cannot change block's elements such as timestamp, transactions or previous hash to adjust the hash to the requirements. 
The only element that can be changed is nonce. We can try with a nonce with a value of 1 and try to calculate hash, if it doesn't return a hash with the required number of zeros, we can try with a nonce equals 2, then 3, then 4... until we find a nonce that returns a valid hash with the required number of zeros in the beginning. 

The function takes a parameter called 'difficulty' which is a number of zeros required in the beginning of hash. 
Then it checks if the characters from index 0 to index equal to argument passed to the function as 'difficulty' are all equal 0. If not, nonce is increased by one.
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
It has 4 properties: 
- `this.chain = [this.createGenesisBlock()]` - an array of blocks with the Genesis block created when the blockchain is initialized,
- `this.difficulty` - sets the difficulty level for mining,
- `this.pendingTransactions = []` - an array temporarily containing all the transactions that are made in between blocks
- `this.miningReward` - controls how much coins the miners get as a reward when they successfully mine a new block

The Blockchain class has 6 methods:
- [`createGenesisBlock()`](#creategenesisblock)
- [`getLatestBlock()`](#getlatestblock)
- [`minePendingTransactions(miningRewardAddress)`](#minependingtransactionsminingrewardaddress)
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

#### `minePendingTransactions(miningRewardAddress)`
'miningRewardAddress' is a wallet address of a miner who created the block.

This method creates a new block, adds pending transaction to the new block, mines the block and add the new block to the blockchain.
In the end it resets the pending transaction array and creates new transaction to give the miner their reward.
```javascript
minePendingTransactions(miningRewardAddress) {
  let block = new Block(Date.now(), this.pendingTransactions);
  block.previousHash = this.getLatestBlock().hash;
  block.mineBlock(this.difficulty);

  console.log("Block successfully mined!");
  this.chain.push(block);

  this.pendingTransactions = [
    new Transaction(null, miningRewardAddress, this.miningReward)
  ];
}
```

#### `createTransaction(transaction)`
This method receives transaction and add it to pending transactions array.
```javascript
createTransaction(transaction) {
  this.pendingTransactions.push(transaction);
}
```
#### `getBalanceOfAddress(address)`
This method checks the balance of an address. 

It needs to go through all the transaction on the blockchain that involve your address and calculate your balance.

It loops over all blocks in the blockchain and then loops over all transations within one block.

Logic:
- If there is transaction, which has a property 'fromAddress' equal to the address, it means that the address was a sender and the balance needs to be reduced by the amount.
- If there is transaction, which has a property 'toAddress' equal to the address, it means that the address was a receiver and the balance needs to be increased by the amount.
```javascript
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
```

#### `isChainValid()`
One of the blockchain's features is immutability. It means that once a block is added it cannot be changed without invalidating with the rest of the chain.
Before adding the new block on to the chain, it needs to be verified whether it's valid.
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







#### `minePendingTransactions(miningRewardAddress)`




Moreover, if an existing block will be changed, hash of that block and all after that block can be recalculated and the chain will be valid even though it was changed.