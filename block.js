'use strict';

const sha256 = require('crypto-js/sha256');

module.exports = class Block {
	constructor(index = 0, previousHash = null, data = 'genesis', difficulty = 0, isDeletion = false) {
		this.timestamp = new Date();
		this.data = data;
		this.index = index;
		this.isDeletion = isDeletion;
		this.previousHash = previousHash;

		this.difficulty = difficulty;
		this.nonce = 0;
		this.mine();
		Object.freeze(this);
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
			this.index + this.previousHash + this.timestamp + this.isDeletion + JSON.stringify(this.data) + this.nonce
		).toString();
	}
};
