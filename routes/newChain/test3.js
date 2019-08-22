// pending Transaction을 처리하는 test file
// 일반 JavaScript로 빠른 타원 곡선 암호화 하는 API
const EC = require('elliptic').ec; 
const ec = new EC('secp256k1');

const Block = require('./block');
const Transaction = require('./transaction');
const Blockchain = require('./blockchain');

// 아까 생성한 Private Key를 가져온다. Private Key만 있으면 Public Key를 가져올 수 있음
// userKeyStr1, 2는 Private Key에 해당함
const userKeyStr1 = 'fae7f91c92da5bb86285090424610b52831a4058f514e29c75b40475e60414b7';
const userKeyStr2 = 'ec340651342f314cdac449a81d1c6f027a905323d282c8eb48050debbe9f1bce';

// privKey1은 userKeyStr1(Private Key)에 대해서 ec API에 대한 형식으로 변환(Private Key와 Public Key 2개를 동시에 지님)
// privKey1.getPrivate('hex')를 하면 Private Key만 hex 방식으로 변환하여 보여줌
const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);

// Private Key에서 Public Key로 변환한 것을 hex type으로 하고 지갑 생성
const wallet1 = privKey1.getPublic('hex');
const wallet2 = privKey2.getPublic('hex');

const mychain = new Blockchain();

// 전자서명을 하는 이유는 userKeyStr1에 대한 값이 아닌 경우는 수행하지 못하도록 함.
// 전자서명을 하는 부분
const tx1 = new Transaction(wallet1, wallet2, 100);
const signTx1 = tx1.signTransaction(privKey1);

mychain.addTransactions(tx1);

const tx2 = new Transaction(wallet1, wallet2, 10);
const signTx2 = tx2.signTransaction(privKey1);

mychain.addTransactions(tx2);
mychain.minePendingTransactions(wallet1);

const tx3 = new Transaction(wallet2, wallet1, 20);
const signTx3 = tx3.signTransaction(privKey2);

mychain.addTransactions(tx2);
mychain.minePendingTransactions(wallet1);

mychain.printAllBlockchain();

console.log('wallet1 Balance : ', mychain.getBalance(wallet1));
console.log('wallet2 Balance : ', mychain.getBalance(wallet2));

console.log(">> wallet1 txs");
console.log(JSON.stringify(mychain.getAllTransactionOfWallet(wallet1), null, 2));
 
console.log(">> wallet2 txs");
console.log(JSON.stringify(mychain.getAllTransactionOfWallet(wallet2), null, 2));
