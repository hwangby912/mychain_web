// 단순한 Block 구성하는 test file

const Block = require('./block');
const Transaction = require('./transaction');
const Blockchain = require('./blockchain');

const tx1 = new Transaction('aaa', 'bbb', 100);
const tx2 = new Transaction('aaa', 'ccc', 10);
const tx3 = new Transaction('aaa', 'ddd', 20);

// tx1.printTransaction();
// tx2.printTransaction();

const mychain = new Blockchain();

const newBlock1 = new Block(1, Date.now(), [tx1]);
const newBlock2 = new Block(2, Date.now(), [tx2, tx3]);

mychain.addBlock(newBlock1);
mychain.addBlock(newBlock2);

// newBlock1.printBlock();
// newBlock2.printBlock();

mychain.printAllBlockchain();

console.log('--------------------');
console.log(mychain.isChainValid());