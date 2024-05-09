const { encrypt, decrypt } = require('@rlvt/crypt')
const PASSWORD = 'rubikscube'
module.exports = {
  decrypt(text) {
    return decrypt(text,PASSWORD);
  }
  , encrypt(text) {
    return encrypt(text,PASSWORD);
  }
}

