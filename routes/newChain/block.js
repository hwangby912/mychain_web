const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, transactions, prevHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.curHash = this.calculateHash();
        this.nonce = 0;
        this.transactions = transactions;
    }
    
    calculateHash() {
        return SHA256(this.prevHash 
                    + this.timestamp 
                    + this.nonce 
                    + JSON.stringify(this.transactions)).toString();
    }
    // transactions는 배열 type이기에 JSON type으로 변환해줌
    
    printBlock() {
        // 2번째와 3번쨰 인자는 indentation을 위한 것
        console.log(JSON.stringify(this, null, 2)); 
    }

    // 작업 증명을 하는 함수
    miningBlock(difficulty) {
        // nonce 값을 증가시키기 떄문에 Hash 값이 달라짐
        // while의 조건은 입맛대로 바꾸면 됨
        while(this.curHash.substring(0, difficulty) !== 
                Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.curHash = this.calculateHash();
            // console.log("mining...", this.nonce, "...", this.curHash);
       }
    }

    // Block안에 있는 transaction들을 쫓아가서 검증하는 함수
    hasValidTransactions() {
        for(let tx of this.transactions) {
            if(!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Block;