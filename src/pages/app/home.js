import React from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { navigate } from 'gatsby'

import { getUserNickname, getUserProfileImage, logout, isLoggedIn } from '../../services/auth'

import RecentPosts from '../../components/recentPosts'
import Button from '../../components/button'
import Layout from '../../components/layout'
import SEO from '../../components/seo'


const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  border-radius: 4px;
  resize: none;
  outline: none;
  border: none;
  color: #ffffff;
  background-color: #434343;
  font-family: sans-serif;
`

const ImageStyled = styled.img`
  flex: 0 0 96px;
  width: 96px;
  height: 96px;
  margin: 0;
  border-radius: 50%;
`

const CreatePost = styled.div`
 display: flex;
 > img {
   margin: 0 10px;
   box-shadow: 0px 0px 1px 1px #cad4dc;
 }
`
class Home extends React.Component {
  state = {
    content: '',
    posts: [],
    isSubmitButtonDisabled: false,
    isPostsLoaded: false
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handlePostSubmit = (event) => {
    event.preventDefault()

    const data = {
      username: getUserNickname(),
      content: this.state.content,
      profile_image: getUserProfileImage()
    }

    if (!data.username || !data.profile_image) {
      logout(() => navigate('/'))
      return
    }

    if (!data.content) return

    this.setState({ isSubmitButtonDisabled: true })

    axios({
      method: 'post',
      url: `${process.env.API_URI}postsCreate`,
      data,
      headers: {
        token: window.localStorage.getItem('id_token')
      }
    }).then((res) => {
      this.setState((prevState) => ({
        posts: [{ ...res.data.post }, ...prevState.posts],
        isSubmitButtonDisabled: false,
        content: ''
      }))
    }).catch((err) => {
      if (err.response.status === 401) {
        logout(() => navigate('/'))
        return
      }

      this.setState({
        isSubmitButtonDisabled: false,
        content: ''
      })

      alert('An error has occurred: ' + err.response.data.msg)
    })
  }

  componentDidMount() {
    if (!isLoggedIn()) {
      navigate(`/`)
      return
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
    return (<Layout>
      <SEO title="Home | Micro Blog" keywords={[`gatsby`, `application`, `react`, `micro-blog`, `auth0`, getUserNickname()]} />
      <div>
        <CreatePost>
          <ImageStyled src={getUserProfileImage()} />
          <form style={{ width: '100%' }} onSubmit={this.handlePostSubmit}>
            <TextArea value={this.state.content} onChange={this.handleInputChange} placeholder="Post goes here..." name="content" />
            <Button disabled={this.state.isSubmitButtonDisabled}>{this.state.isSubmitButtonDisabled ? 'Creating...' : 'Create'}</Button>
          </form>
        </CreatePost>
        <RecentPosts posts={this.state.posts} isPostsLoaded={this.state.isPostsLoaded} />
      </div>
    </Layout>)
  }
}

export default Home
