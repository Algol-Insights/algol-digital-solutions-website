import crypto from 'crypto'

const ALGO = 'aes-256-gcm'
const IV_LENGTH = 12

function getKey() {
  const keyB64 = process.env.DATA_ENCRYPTION_KEY
  if (!keyB64) {
    throw new Error('DATA_ENCRYPTION_KEY is not set')
  }
  const key = Buffer.from(keyB64, 'base64')
  if (key.length !== 32) {
    throw new Error('DATA_ENCRYPTION_KEY must be 32 bytes (base64-encoded)')
  }
  return key
}

export function encryptString(value: string | null | undefined): string | null {
  if (!value) return null
  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [iv.toString('base64'), encrypted.toString('base64'), authTag.toString('base64')].join(':')
}

export function decryptString(payload: string | null | undefined): string | null {
  if (!payload) return null
  const parts = payload.split(':')
  if (parts.length !== 3) {
    return payload
  }
  const [ivB64, dataB64, tagB64] = parts
  const key = getKey()
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivB64, 'base64'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}
