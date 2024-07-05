const tokenNameList = require('./tnList.js');

let hexList = []

function tokenNameHex() {
  
  for (let i = 0; i < tokenNameList.length; i++) {
    const str = tokenNameList[i].toString();

    // Convert the string to a Buffer
    const buffer = Buffer.from(str, 'utf8');

    // Convert the Buffer to a hexadecimal string
    const hex = buffer.toString('hex');

    console.log(hex);
    hexList.push(hex)
  }
  console.log(hexList)
}

module.exports = tokenNameHex