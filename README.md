# Understanding blockchain by creating a blockchain in JavaScript

One Paragraph of project description goes here

### Block

Defining what a block in a blockchain looks like by creating class called Block.
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
.calculateHash() method calculates and returns SHA256 hash for the current block.
```javascript
calculateHash() {
  return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
}
```
`JSON.stringify()` converts a JavaScript object to a JSON string. The opposite method is `JSON.parse()`, which converts a JSON string to a JavaScript object.
SHA256 function isn't available in JavaScript by default.
We need to import a library to use SHA256 hashing function called ['crypto-js'](https://www.npmjs.com/package/crypto-js).
At the top of the script we need to import and assign the SHA256 hashing function:
```javascript
const SHA256 = require('crypto-js/sha256');

```

