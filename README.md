# Understanding blockchain by creating a blockchain in JavaScript

One Paragraph of project description goes here

### Block

Defining what a block in a blockchain looks like by creating class called Block.
Constractor for class Block receives properties Each Block has:
- index - where the blocks sits on the chain (optional)
- timestamp - when the block was created
- data - e.g. details for transactions (how much money was transfered, how was the sender and receiver)
- previous hash - string that contains the hash of the block before the current one

```javascript
class Block {
  constructor (index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
  }
}
```