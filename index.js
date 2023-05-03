const openpgp = require('openpgp'); // Import the openpgp library
const crypto = require('crypto'); // Import the crypto library

class pkAuth {
  constructor(algorithm = 'ed25519') { // A constructor function that takes an algorithm parameter and sets it as a property of the class
    this.algorithm = algorithm;
  }

  generateKeyPair = async (id = crypto.randomBytes(127).toString('hex')) => { // An async function that generates a PGP key pair using the specified algorithm and an optional ID parameter
    const keyPair = openpgp.generateKey({ curve: this.algorithm, userIDs: [{ uuid: id }], format: 'armored' }); // Generate the key pair using openpgp library
    const keyPairObject = await keyPair.then(data => { return data }); // Wait for the key pair to generate and convert the data to an object
    keyPairObject.algorithm = this.algorithm; // Set the algorithm property of the key pair object
    return keyPairObject // Return the key pair object
  };

  generatePublic = async (privateKey) => { // An async function that generates a public key from a private key
    const readKey = openpgp.readPrivateKey({ armoredKey: privateKey }) // Read the private key using openpgp library
    const readKeyObject = await readKey.then(data => { return data }) // Wait for the private key to read and convert the data to an object
    return { publicKey: readKeyObject.toPublic().armor() } // Return an object containing the public key
  };

  encryptPrivateKey = async (privateKey, passphrase) => { // An async function that encrypts a private key with a passphrase
    const readKey = openpgp.readPrivateKey({ armoredKey: privateKey }) // Read the private key using openpgp library
    const readKeyObject = await readKey.then(data => { return data }) // Wait for the private key to read and convert the data to an object
    const encryptKey = openpgp.encryptKey({ privateKey: readKeyObject, passphrase: passphrase }) // Encrypt the private key using openpgp library
    return {privateKey: (await encryptKey).armor()} // Wait for the key to encrypt and return the encrypted key
  }

  decryptPrivateKey = async (encryptedPrivateKey, passphrase) => { // An async function that decrypts an encrypted private key with a passphrase
    const readKey = openpgp.readPrivateKey({ armoredKey: encryptedPrivateKey }) // Read the encrypted private key using openpgp library
    const readKeyObject = await readKey.then(data => { return data }) // Wait for the encrypted private key to read and convert the data to an object
    const decryptKey = openpgp.decryptKey({ privateKey: readKeyObject, passphrase: passphrase }) // Decrypt the private key using openpgp library
    return {privateKey: (await decryptKey).armor()} // Wait for the key to decrypt and return the decrypted key
  }

  validateKeys = async (privateKey, publicKey) => { // An async function that validates a public key against a private key
    const generatePublic = (await this.generatePublic(privateKey)).publicKey // Generate the public key from the private key using the generatePublic function
    return publicKey === generatePublic // Compare the generated public key with the provided public key and return the result
  };
}

module.exports = pkAuth // Export the class from the module
