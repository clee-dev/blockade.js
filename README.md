# Blockade.js
![logo](https://raw.githubusercontent.com/clee-dev/blockade.js/master/images/BLOCKADE.png)

*Contributions welcome!*

Blockade.js is a library that provides an easy private blockchain storage solution.

# API

`new Chain(defaultKey, difficulty)`
 - Creates a new chain.
   - `defaultKey` is the property name by which to defaultly group data. Any function that accepts a `key` argument can have it omitted and Blockade will use the `defaultKey` instead.
   - `difficulty` is the mining difficulty

`Chain.submit(obj)`
 - Records the given object onto the blockchain
 
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
