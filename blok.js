const sha256 = require('crypto-js/sha256');

class Block {
	constructor(index = 0, previousHash = null, data = 'genesis', difficulty = 1) {
		this.timestamp = new Date();
		this.data = data;
		this.index = index;
		this.previousHash = previousHash;

		this.difficulty = difficulty;
		this.nonce = 0;
		this.mine();
	}

	mine() {
		this.hash = this.genHash();

		while (!/^0*$/.test(this.hash.substring(0, this.difficulty))) {
			this.nonce++;
			this.hash = this.genHash();
		}
	}

	genHash() {
		return sha256(
			this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
		).toString();
	}
}

class Chain {
	constructor(difficulty = 1) {
		this.blocks = [new Block()];
		this.index = 1;
		this.difficulty = difficulty;
	}

	//last block in the chain
	tail() {
		return this.blocks[this.blocks.length - 1];
	}

	//add new block
	record(data) {
		const index = this.index;
		const difficulty = this.difficulty;
		const previousHash = this.tail().hash;

		const block = new Block(index, previousHash, data, difficulty);

		this.index++;
		this.blocks.push(block);
	}

	isValid() {
		for (let i = 1; i < this.blocks.length; i++) {
			const currentBlock = this.blocks[i];
			const previousBlock = this.blocks[i - 1];

			if (
				currentBlock.hash !== currentBlock.genHash() || //re-check stored current vs current hash now
				currentBlock.previousHash !== previousBlock.genHash() || //re-check stored previous vs previous hash now
				currentBlock.index !== previousBlock.index + 1 //re-check index order
			) {
				return false;
			}
		}
		return true;
	}
}

//

let test = new Chain();
test.record({ amount: 4 });
test.record({ amount: 50 });

console.log('VALID BEFORE: ' + test.isValid());
test.blocks[1].data.amount = 3000;
console.log('VALID  AFTER: ' + test.isValid());
