const SHA256 = require('crypto-js/sha256');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction { // 배열 형태
	constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = undefined;
    }
    
    printTransaction() {
        console.log('from : ', this.fromAddress);
        console.log('to : ', this.toAddress);
        console.log('amount : ', this.amount);
    }

    // 1. signature가 있는지 검사
    // 2. 정상적으로 sign 되었는지 검사 fromAddress가 보낸게 맞는지 검증하는 것
    isValid() {
        // 1. 
        if(!this.signature || this.signature.length === 0) {
            console.log('Warn : No signiture');
            return false;
        }
        // 2.
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

    // Hash 계산하는 함수
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // 거래를 할 때, Sign을 하는 행위(Toss로 따지면 금액을 보내기 전, 지문을 찍어서 자신을 증명하는 행위)
    signTransaction(privateKey) {
        // sign을 하기 전에 권한이 있는지 확인부터 하기
        if(privateKey.getPublic('hex') !== this.fromAddress) {
            console.log('Err 3 : No Permission');
            return false;
        }

        const hashTx = this.calculateHash();
        const sig = privateKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
        return true;
    }
}

module.exports = Transaction;