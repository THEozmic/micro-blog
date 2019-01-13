import mongoose from 'mongoose'

import '../utils/db'

import Posts from './postsModel'

import { verifyToken, respondWith } from '../utils'


export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  if (event.httpMethod !== 'POST') return respondWith({ statusCode: 200 })

  try {
    const data = JSON.parse(event.body),
      username = data.username,
      content = data.content,
      profile_image = data.profile_image,
      id = mongoose.Types.ObjectId(),
      post = {
        _id: id,
        username,
        profile_image,
        content,
      },
      response = {
        msg: "Post successfully created",
        post,
      }

    try {
      await verifyToken(event.headers.token)
    } catch (e) {
      throw {
        statusCode: 401,
        message: e.message
      }
    }

    await Posts.create(post)

    return respondWith({ statusCode: 201, response })

  } catch (err) {
    console.log(err) // output to netlify function log
    return respondWith({ statusCode: err.statusCode || 500, response: { msg: err.message } })
  }
}
