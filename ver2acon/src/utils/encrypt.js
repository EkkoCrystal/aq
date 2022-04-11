import JSEncrypt from 'jsencrypt/bin/jsencrypt'

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmsFRl/qlrx3+UjbawV68+mcXCVntz4YeVn6NzRY3YQ89Ab70ekZOLQXxhlwUVLBdInH8QBlPyLV/+pHjELt1oG7DyWsuoVjUdsn3zNL38iwO9HCpTAd7VV3Zqa4jOqkcaMEZuM3DFKTuAvxBid2vuTAGLHlxBaLHGtCd1MwNbbwIDAQAB'

const privateKey = ''

// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
