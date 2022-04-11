import crypto from 'crypto-js'
const aseKey = '15642156156421561564215615642156'

export function encrypt (message) {
  return crypto.AES.encrypt(message, crypto.enc.Utf8.parse(aseKey), {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  }).toString()
}

// const decrypt = (message) => {
//   return crypto.AES.decrypt(message, crypto.enc.Utf8.parse(aseKey), {
//     mode: crypto.mode.ECB,
//     padding: crypto.pad.Pkcs7
//   }).toString(crypto.enc.Utf8)
// }

// module.default.exports = {
//   encrypt,
//   decrypt
// }

