const crypto = require("crypto");

// set encryption algorithm
const algorithm = "aes-256-cbc";

// private key
const key = "esd-2022-programming-assignment.";

// random 16 digit initialization vector
const iv = crypto.randomBytes(16);

//encrypt the message
const encryptMessage = (message) => {
  // encrypt the string using encryption algorithm, private key and initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(message, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  // convert the initialization vector to base64 string
  const base64data = Buffer.from(iv, "binary").toString("base64");

  return { base64data, encryptedData };
};

//decrypt the message
const decryptMessage = (iv, encryptedData) => {
  try {
    // convert initialize vector from base64 to buffer
    let originalData = Buffer.from(iv, "base64");

    let encryptedText = Buffer.from(encryptedData, "hex");
    let decipher = crypto.createDecipheriv(algorithm, key, originalData);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { encryptMessage, decryptMessage };
