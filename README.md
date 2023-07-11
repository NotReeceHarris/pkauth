# PkAuth (Private key authentication)

This npm package provides a secure user authentication method that utilizes private keys for authentication. By eliminating the need for usernames and passwords, it enhances security. However if you wanted added security with a passphrase, a encrypted private key option is avaliable. This authentication system employs openpgp and a curve algorithm of your choice to function effectively.

## ⚙️ Installation

Installing torv3 is a straightforward process. First, ensure that you have [Node.js](https://nodejs.org/) version `12.x` or higher and a node package manager (such as [NPM](https://www.npmjs.com/)) installed on your system.

To install pkauth, open your terminal or command prompt and enter the following command:

```
npm i pkauth
```
<sub>You can also install [pkauth](https://github.com/NotReeceHarris/pkauth) directly from github with the git package `git clone https://github.com/NotReeceHarris/pkauth.git`.</sub>
<br>
<br>

## 📋 Example

#### Standard authentication
THis examples uses the standeard plaintext key-pairs, this is secure on its own granted the private-key is stored safely. and good opsec is used.
```js
const pkauth = require('pkauth');
const auth = new pkauth('ed25519')

(async () => {
  const keys = await auth.generateKeyPair();
  /*{
     privateKey: <String>,
     publicKey: <String>,
     revocationCertificate:  <String>
  }*/

  const publicKey = await auth.generatePublic(keys.privateKey);
  /*{
     publicKey: <String>
  }*/

  const valide = await auth.validateKeys(keys.privateKey, publicKey)
  /* True */
})():
```
<sub>This example uses the `ed25519 Edwards-curve`, this creates a key-pair then [validates](#authvalidatekeys) the key-pair.</sub>
<br>
<br>

#### Encrypted authentication
This example uses an encrypted version of the key-pairs meaning it adds an extra layer of security against leaking the private-key.
```js
const pkauth = require('pkauth');
const auth = new pkauth('ed25519')

(async () => {
  const keys = await auth.generateKeyPair();
  /*{
     privateKey: <String>,
     publicKey: <String>,
     revocationCertificate:  <String>
  }*/

  const encryptedPrivateKey = await auth.encryptPrivateKey(keys.privateKey, 'SuperSecurePassPhrase')
  /*{
     privateKey: <String>
  }*/
  
  const decryptedPrivateKey = await auth.decryptPrivateKey(encryptedPrivateKey.privateKey, 'SuperSecurePassPhrase')
  /*{
     privateKey: <String>
  }*/

  const publicKey = auth.generatePublic(decryptedPrivateKey.privateKey);
  /*{
     publicKey: <String>
  }*/

  const valide = auth.validateKeys(keys.privateKey, publicKey)
  /* True */
})();

```

## 🔗 API

### `auth.generateKeyPair`
```js
auth.generateKeyPair()
```
Generates a pair key.

# 

### `auth.generatePublic`
```js
auth.generatePublic(privateKey)
```
Generates a public key from the provided private key.
- `privateKey` is a required string armoured pgp private key.

# 

### `auth.encryptPrivateKey`
```js
auth.encryptPrivateKey(privateKey, passphrase)
```
Generates a encrypted private key from the provided private key and passphrase
- `privateKey` is a required string armoured pgp private key.
- `passphrase` is a required string passphrase.

# 

### `auth.decryptPrivateKey`
```js
auth.decryptPrivateKey(encryptedPrivateKey, passphrase)
```
Generates a decrypted private key from the provided encrypted private key and passphrase
- `encryptedPrivateKey` is a required string armoured pgp encrypted private key.
- `passphrase` is a required string passphrase.

# 

### `auth.validateKeys`
```js
auth.validateKeys(privateKey, publicKey)
```
Validates inputed public key is equal to the derived public key from the private key.
- `privateKey` is a required string armoured pgp private key.
- `publicKey` is a required string armoured pgp public key.
