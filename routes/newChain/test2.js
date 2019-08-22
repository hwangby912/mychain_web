// 실제 주소 형식으로 처리하는 test file
// 일반 JavaScript로 빠른 타원 곡선 암호화 하는 API
const EC = require('elliptic').ec; 
const ec = new EC('secp256k1');

const Block = require('./block');
const Transaction = require('./transaction');
const Blockchain = require('./blockchain');

// 아까 생성한 Private Key를 가져온다. Private Key만 있으면 Public Key를 가져올 수 있음

const userKeyStr1 = 'fae7f91c92da5bb86285090424610b52831a4058f514e29c75b40475e60414b7';
const userKeyStr2 = 'ec340651342f314cdac449a81d1c6f027a905323d282c8eb48050debbe9f1bce';

console.log(ec.keyFromPrivate(userKeyStr1));
const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);

// Private Key에서 Public Key로 변환한 것을 hex type으로 하고 지갑 생성
const wallet1 = privKey1.getPublic('hex');
const wallet2 = privKey2.getPublic('hex');

// 전자서명을 하는 이유는 userKeyStr1에 대한 값이 아닌 경우는 수행하지 못하도록 함.
const tx1 = new Transaction(wallet1, wallet2, 100);
// 전자서명을 하는 부분
const signTx1 = tx1.signTransaction(privKey1);
const tx2 = new Transaction(wallet1, wallet2, 10);
const signTx2 = tx2.signTransaction(privKey1);
const tx3 = new Transaction(wallet2, wallet1, 20);
const signTx3 = tx3.signTransaction(privKey2);

// console.log('------------------------------');
// console.log(tx1.isValid());
// console.log(tx2.isValid());
// console.log(tx3.isValid());

// tx1.printTransaction();
// tx2.printTransaction();

const mychain = new Blockchain();

const newBlock1 = new Block(1, Date.now(), [tx1]);
console.log(newBlock1.hasValidTransactions());
const newBlock2 = new Block(2, Date.now(), [tx2, tx3]);
console.log(newBlock2.hasValidTransactions());

// newBlock1.miningBlock(2);

mychain.addBlock(newBlock1);
mychain.addBlock(newBlock2);

// newBlock1.miningBlock(2);
// newBlock1.printBlock();
// newBlock2.printBlock();

mychain.printAllBlockchain();

// console.log('--------------------');
// console.log(mychain.isChainValid());