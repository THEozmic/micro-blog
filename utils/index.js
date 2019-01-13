import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

export const respondWith = ({ statusCode, response = {} }) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify(response)
  }
}

export const verifyToken = async (token) => {
  try {
    const client = jwksClient({
      jwksUri: 'https://askingafrica.auth0.com/.well-known/jwks.json'
    });

    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey
        callback(null, signingKey)
      });
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) return reject(err)
        return resolve(decoded)
      })
    })
  } catch (e) {
    throw 'error occurred: ' + e.message
  }
}
