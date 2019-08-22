// https://www.npmjs.com/package/elliptic 참고

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
 
// public & private key 생성
var key = ec.genKeyPair();

// console.log('signDER : ', derSign);
// console.log(key.verify(msgHash, derSign));

// transaction을 할 때 사용됨
console.log('Private Key = ', key.getPrivate('hex'));
console.log('Public Key = ', key.getPublic('hex'));