'use strict';

const Block = require('./block.js');

module.exports = class Chain {
	constructor(difficulty = 0) {
		this.blocks = [new Block()];
		this.index = 1;
		this.difficulty = difficulty;
	}

	//last block in the chain
	tail() {
		return this.blocks[this.blocks.length - 1];
	}

	//add new block
	push(data) {
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
};
