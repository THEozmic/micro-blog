import React from 'react'
import { navigate } from 'gatsby'
import axios from 'axios'
import { handleLogin, logout, isLoggedIn } from "../services/auth"

import Layout from '../components/layout'
import RecentPosts from '../components/recentPosts'
import Button from '../components/button'
import SEO from '../components/seo'

class IndexPage extends React.Component {

  state = {
    posts: [],
    isPostsLoaded: false
  }

  componentDidMount() {
    if (isLoggedIn()) {
      navigate(`/app/home`)
      return null
    }

    axios({
      method: 'get',
      url: `${process.env.API_URI}postsRead`
    }).then((res) => {
      this.setState({
        posts: res.data.posts,
        isPostsLoaded: true
      })
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        logout(() => navigate('/'))
        return
      }

      if (!err.response) {
        alert('An unknown error has occurred')
        return
      }
      alert('An error has occurred: ' + err.response.data.msg)
      this.setState({
        isPostsLoaded: true
      })
    })
  }

  render() {
    return (
      <Layout>
        <SEO title="Login | Micro Blog" keywords={[`gatsby`, `application`, `react`, `micro-blog`, `auth0`]} />

        You should <Button variant="inline" onClick={handleLogin}>log in or sign up</Button> to post content.
      <RecentPosts posts={this.state.posts} isPostsLoaded={this.state.isPostsLoaded} />
      </Layout>
    )
  }
}

export default IndexPage
