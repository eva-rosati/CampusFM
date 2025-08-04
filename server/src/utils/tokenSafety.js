const crypto = require('crypto');


// encrypt function
const encryptSymmetric = (key, plaintext) => { // plaintext is the text you want to encrypt and key is the 256-bit encryption key
    const iv = crypto.randomBytes(12); // generate key randomly for higher security, iv is the initialization vector (random value)
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key, 'base64'), iv); // use aes algorithm
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');  // update encrypts plaintext step by step, encoded in the utf8 format and be returned as a base64 string
    ciphertext += cipher.final('base64') // returning final encrypted string
    const tag = cipher.getAuthTag().toString('base64');
    
    return { ciphertext, iv: iv.toString('base64'), tag };
}

// decrypt function
const decryptSymmetric = (key, encryptedData) => {
    const { ciphertext, iv, tag } = encryptedData;
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        Buffer.from(key, 'base64'), // buffer to work with raw data
        Buffer.from(iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(tag, 'base64')); // security
    let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext; // return decrypted token in utf8 format

}

module.exports = { encryptSymmetric, decryptSymmetric };
