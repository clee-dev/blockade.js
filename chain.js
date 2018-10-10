'use strict';

const Block = require('./block.js');

module.exports = class Chain {
	constructor(keyProp, difficulty = 0) {
		this.key = keyProp;
		this.blocks = [new Block()];
		this.index = 1;
		this.difficulty = difficulty;
		this.safeMode = true;
	}

	//last block in the chain
	tail() {
		this.safeCheck();
		return deepClone(this.blocks[this.blocks.length - 1]);
	}

	//add new block
	submit(data, isDeletion = false) {
		this.safeCheck();

		const index = this.index;
		const difficulty = this.difficulty;
		const previousHash = this.tail().hash;

		const block = new Block(index, previousHash, data, difficulty, isDeletion);

		this.index++;
		this.blocks.push(block);
	}

	//get('John Doe')
	get(keyVal, keyProp = this.key) {
		this.safeCheck();

		let block = findLast(this.blocks, x => x.data[keyProp] && x.data[keyProp] === keyVal);
		if (block && !block.isDeletion) return deepClone(block.data);
		else return undefined;
	}

	//returns array of all objects grouped by defaultKey if there is one
	//getByKey('name')
	getByKey(keyProp = this.key) {
		this.safeCheck();

		let arr = [];
		let foundValues = [];
		let filteredBlocks = this.blocks.filter(x => x.data[keyProp]);

		for (var i = filteredBlocks.length - 1; i >= 0; i--) {
			var block = filteredBlocks[i];
			if (foundValues.indexOf(block.data[keyProp]) == -1) {
				//if we haven't already found this property=value, mark that we've found it
				foundValues.push(block.data[keyProp]);
				if (!block.isDeletion) arr.push(block.data); //if the data wasn't deleted, add it to our return list
			}
		}

		return arr.map(x => deepClone(x));
	}

	history(keyVal, keyProp = this.key) {
		this.safeCheck();

		let matchingBlocks = this.blocks.filter(x => x.data[keyProp] && x.data[keyProp] === keyVal);
		let arr = [];
		matchingBlocks.forEach(x => {
			let obj = deepClone(x.data);
			delete obj[keyProp];
			obj.isDeletion = x.isDeletion;
			obj.timestamp = x.timestamp;
			arr.push(obj);
		});

		return arr;
	}

	historyByKey(keyProp = this.key) {
		this.safeCheck();

		let history = {};

		this.blocks.filter(x => x.data[keyProp]).forEach(x => {
			if (!history[x.data[keyProp]]) history[x.data[keyProp]] = [];

			let obj = deepClone(x.data);
			delete obj[keyProp];
			obj.isDeletion = x.isDeletion;
			obj.timestamp = x.time;
			history[x.data[keyProp]].push(obj);
		});
		return history;
	}

	block(hash) {
		this.safeCheck();

		return deepClone(findLast(this.blocks, x => x.hash === hash));
	}

	//delete data via adding a new block with isDeletion mark
	delete(keyVal) {
		let data = {};
		data[this.key] = keyVal;
		this.submit(data, true);
	}

	//DRY
	safeCheck() {
		if (this.safeMode && !this.isValid()) throw 'Data is invalid';
	}

	//check validity
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

//reverse find without calling `array.reverse()`
function findLast(items, predicate) {
	for (var i = items.length - 1; i >= 0; i--) {
		var item = items[i];

		if (predicate(item)) {
			return item;
		}
	}
}
function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
