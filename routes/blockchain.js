var express = require('express');
var router = express.Router();

const Transaction = require('./newChain/transaction');
const Blockchain = require('./newChain/blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const userKeyStr1 = 'a4ec1d9f8c9335ac8afa48bf4205e56899d1f0d892daa998103f2729a8ad957c';
const userKeyStr2 = 'ec340651342f314cdac449a81d1c6f027a905323d282c8eb48050debbe9f1bce';

const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);

const wallet1 = privKey1.getPublic('hex');
const wallet2 = privKey2.getPublic('hex');

const myChain = new Blockchain();
 
const tx1 = new Transaction (wallet1, wallet2, 100);
const signTx1 = tx1.signTransaction(privKey1);
 
myChain.addTransaction(tx1);
 
const tx2 = new Transaction (wallet1, wallet2, 10);
const signTx2 = tx2.signTransaction(privKey1);
 
myChain.addTransaction(tx2);
 
myChain.minePendingTransactions(wallet1);
 
const tx3 = new Transaction (wallet2, wallet1, 20);
const signTx3 = tx3.signTransaction(privKey2);
 
myChain.addTransaction(tx2);
 
myChain.minePendingTransactions(wallet1);

myChain.printAllBlockchain();


/* GET home page. */
/* url : /blockchain */
router.get('/', function(req, res, next) {
  res.render('blockchain', { blocks: myChain.chain, title: "blockchain", selectedIdx : 0 });
});

router.get('/block/:idx', function(req, res, next) {
  const selectedIdx = req.params.idx;
  
  res.render('blockchain',
       {title: "Blockchain info"
       , blocks: myChain.chain
       , selectedIdx : selectedIdx
       , txs : myChain.chain[selectedIdx].transactions}
  )
});

router.get('/createtx', (req, res, next) => {
  res.render('createtx', { wallet : wallet1});
});

router.post('/createtx', (req, res, next) => {
  const fromAddress = req.body.fromAddress;
  const toAddress = req.body.toAddress;
  const amount = req.body.amount;

  console.log('fromAddress : ', fromAddress);
  console.log('toAddress : ', toAddress);
  console.log('amount : ', amount);

  const tx = new Transaction(fromAddress, toAddress, amount);
  tx.signTransaction(privKey1);
  myChain.addTransaction(tx);

  console.log(myChain.pendingTransactions);
  res.redirect('/blockchain/pendingtransaction');
});

router.get('/pendingtransaction', (req, res, next) => {
  let txs = myChain.pendingTransactions;
  res.render('pendingtransaction', { txs : txs});
});

router.get('/miningblock', (req, res, next) => {
  console.log('mining...');
  myChain.minePendingTransactions(wallet1);
  console.log('block mined...');

  res.redirect('/blockchain');
});

module.exports = router;
