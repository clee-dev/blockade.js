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

		let block = this.blocks.findLast(x => typeof x.data[keyProp] != 'undefined' && x.data[keyProp] == keyVal);
		if (block && !block.isDeletion) return deepClone(block.data);
		else return undefined;
	}

	//returns array of all objects grouped by defaultKey if there is one
	//getByKey('name')
	getByKey(keyProp = this.key) {
		this.safeCheck();

		let arr = [];
		let foundValues = [];

		for (var i = this.blocks.length - 1; i >= 0; i--) {
			var block = this.blocks[i];
			if (typeof block.data[keyProp] != 'undefined') {
				//if property exists on this block's data

				if (foundValues.indexOf(block.data[keyProp]) == -1) {
					//if we haven't already found this property=value, mark that we've found it
					foundValues.push(block.data[keyProp]);

					if (!block.isDeletion) arr.push(block.data); //if the data wasn't deleted, add it to our return list
				}
			}
		}

		return arr.map(x => deepClone(x));
	}

	history(keyVal, keyProp = this.key) {
		this.safeCheck();

		let data = this.blocks.filter(x => typeof x.data[keyProp] != 'undefined' && x.data[keyProp] == keyVal);
		let arr = [];
		data.forEach(x => {
			let obj = x.data;
			delete obj[keyProp];
			obj.isDeletion = x.isDeletion;
			obj.timestamp = x.timestamp;
			arr.push(obj);
		});

		return deepClone(arr);
	}

	historyByKey(keyProp = this.key) {
		this.safeCheck();
	}

	block(hash) {
		this.safeCheck();

		return deepClone(this.blocks.findLast(x => x.hash === hash));
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
Object.defineProperty(Array.prototype, 'findLast', {
	enumerable: false,
	value: function(predicate) {
		for (var i = this.length - 1; i >= 0; i--) {
			var item = this[i];

			if (predicate(item)) {
				return item;
			}
		}
	},
});

function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
