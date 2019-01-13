import '../utils/db'

import Posts from './postsModel'

import { respondWith } from '../utils'


export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  if (event.httpMethod !== 'GET') return respondWith({ statusCode: 200 })

  try {
    const posts = await Posts.find().sort({ createdAt: 'desc' }),
      response = {
        msg: "Posts successfully found",
        posts: posts
      }

    return respondWith({ statusCode: 200, response })
  } catch (err) {
    console.log(err) // output to netlify function log
    return respondWith({ statusCode: 500, response: { msg: err.message } })
  }
}
