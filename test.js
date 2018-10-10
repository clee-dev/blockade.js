'use strict';

const Chain = require('./chain.js');

let chain = new Chain('name');

chain.submit({ name: 'John Doe', phone: '5555555555' });
chain.submit({ name: 'John Doe', phone: '1231231234' });
// chain.submit('John Doe', { phone: '0010010001' });

console.log('GET "John Doe":');
console.log(chain.get('John Doe'));
chain.get('John Doe').phone = '9999999999';
console.log(chain.get('John Doe'));

chain.submit({ name: 'Jill Doe', phone: '0008675309' });

// chain.blocks[1].data = {}; //throws error in strict mode

console.log('GET "Jill Doe":');
console.log(chain.get('Jill Doe'));

console.log();
console.log('GET BY KEY "name":');
console.log(chain.getByKey());

console.log();
console.log('GET BY KEY "phone":');
console.log(chain.getByKey('phone'));

chain.delete('Jill Doe');

console.log();
console.log('DELETED "Jill Doe". GET "Jill Doe":');
console.log(chain.get('Jill Doe'));

chain.delete('John Doe');
console.log(chain.get());
console.log(chain.getByKey());

console.log(chain.history('John Doe'));
