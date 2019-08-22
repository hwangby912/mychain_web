const Block = require('./block');
const Transaction = require('./transaction');

// 블록체인 전체를 정의하는 class
class Blockchain { 
    constructor() {
        // 가장 중요한 정보인 chain을 가지고 있음, 맨처음 Block에 해당함
        // pendingTransactions -> Transaction pool에는 있지만, 아직 처리 되지 않은 Transaction(아직 Block화 되지 않음)
        // 코인 지급량은 difficulty와 함께 Algorithm으로 구현하면 됨
        this.chain = [new Block(0, Date.now(), [], 'GenesisBlock')];
        this.difficulty = 2;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }

    // 추가할 block의 prevHash는 Blockchain 객체가 가지고 있는 가장 최신 Block의 curHash로 대체
    // 추가할 Block의 curHash를 다시 계산
    // this.chain에 block을 추가
    addBlock(block) {
        block.prevHash = this.getLatestBlock().curHash;
        block.miningBlock(this.difficulty);
        this.chain.push(block);
    }

    // this.chain의 맨 마지막 block을 가져오는 함수
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    printAllBlockchain() {
        console.log(JSON.stringify(this, null, 2));
    }

    // chain의 구조가 깨졌는지 확인하는 함수
    // 체크 목록은 3가지로 나뉨
    // 1. Block 내부 Hash 값 검증
    // 2. Previous Block Hash 값 검증
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            // 1.
            if(curBlock.curHash !== curBlock.calculateHash()) {
                console.log('Err 1 : Chain [', i, ']');
                return false;
            }

            // 2.
            if(prevBlock.curHash !== curBlock.prevHash) {
                console.log('Err 2 : Chain [', i, ']');
                return false;
            }
        }
        return true;
    }

    // 1. 주소 검사
    // 2. validation check
    // 3. pending transaction에 추가
    addTransaction(transaction) {
        // 1. 
        if(!transaction.fromAddress || !transaction.toAddress) {
            console.log('Warn : Invalid transaction address');
        }
        
        // 2. 
        if(!transaction.isValid()) {
            console.log('Warn : Invalid transaction');
            return false;
        }

        // 3.
        this.pendingTransactions.push(transaction);
    }

    // pendingTransaction 배열안에 있는 내용을 Block으로 만드는 함수(pendingTransaction을 채굴하는 함수)
    minePendingTransactions(rewardAddress) {
        // 채굴이 완료가 되면 Platform에서 
        // 채굴을 완료한 주소(rewardAddress)에게 miningReward만큼의 값을 준다. 
        // pendingTransaction의 맨 앞에 new Transaction insert
        this.pendingTransactions.unshift(new Transaction(null, rewardAddress, this.miningReward));

        // pendingTransaction들에 대한 Block을 만듬
        let block = new Block(
            this.getLatestBlock().index + 1,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().curHash
        );
        // 위의 Block이 바로 만들어지는 것이 아니라 해당 작업증명을 해야함
        block.miningBlock(this.difficulty);

        // 작업 증명이 다 된 경우, 기존에 있던 chain에서 해당 block을 추가함
        console.log('Mined...');
        this.chain.push(block);
    }

    // 인자값에 대한 address의 잔액을 구하는 함수
    getBalance(address) {
        let balance = 0;

        for(let block of this.chain) {
            for(let tx of block.transactions) {
                if(tx.fromAddress == address) {
                    balance -= tx.amount;
                }

                if(tx.toAddress == address) {
                    balance += tx.amount;
                }
            }
        }
        return balance;
    }

    // 각 계좌별 거래내역을 나타내는 함수
    getAllTransactionOfWallet(address) {
        const txs = [];

        for(let block of this.chain) {
            for(let tx of block.transactions) {
                if(tx.fromAddress == address || tx.toAddress == address) {
                    txs.push(tx);
                }
            }
        }
        return txs;
    }
}

module.exports = Blockchain;