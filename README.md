# Blockade.js
![logo](https://raw.githubusercontent.com/clee-dev/blockade.js/master/images/BLOCKADE.png)

Blockade.js is a local data storage library powered by an underlying blockchain which provides an immutable history.

*(This is a private, in-memory blockchain - not a decentralized public blockchain like bitcoin/ethereum. The purpose is to utilize blockchains to provide object storage similar to a simple key-value store, not to create another public blockchain network. This was mostly a project for the sake of learning blockchains.)*

*Contributions welcome!*

# API

`new Chain(defaultKey, difficulty)`
 - Creates a new chain.
   - `defaultKey` is the property name by which to defaultly group data. Any function that accepts a `key` argument can have it omitted and Blockade.js will use the `defaultKey` instead.
   - `difficulty` is the mining difficulty

`Chain.submit(obj)`
 - Records the given object onto the blockchain. If a previous submission has the same key, this would be considered a new 'version' of the same object.
 
`Chain.delete(val)`
 - Deletes the given object, which is determined by `val` and `defaultKey`
   - Note: This doesn't actually remove the history of the object. It records a change on the blockchain which is marked as a deletion of the object. Any further `Chain.get()` calls for this object will return undefined.
 
 `Chain.get(val, key)`
 - Returns the latest version of the given object, which is determined by `val` and `key`.
   - `val` is the unique identifier for the object
   - `key` is the name of the property for which to match `val` on
 - Example:
   - `let obj = myChain.get('John Doe', 'name');`

`Chain.getByKey(key)`
 - Returns an array of all objects grouped by the given key

`Chain.history(val, key)`
 - Returns an array of all versions of the given object, which is determined by `val` and `key`.

`Chain.historyByKey(key)`
 - Returns an object which has a property for each found value of `key` in the blockchain. That property is an array of all versions of the object.
 
`Chain.block(hash)`
 - Returns the block with the given unique hash.
 
`Chain.isValid()`
 - Returns `false` if the blockchain is found to be invalid (by modification of the block data), returns `true` otherwise.
   - By default, Blockade.js runs this before any operation and will throw a `'Data is invalid'` error if `false` is returned.

# Example

```js
let data = new Chain('name');

data.submit( { name: 'John Doe', money: 1 } );
data.submit( { name: 'John Doe', money: 200 } );
data.get('John Doe'); //returns { name: 'John Doe', money: 200 }
data.delete('John Doe');
data.get('John Doe'); //returns undefined, but the history of the data is still intact
```
