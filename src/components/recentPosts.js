import React from 'react'
import styled from '@emotion/styled'


const Posts = styled.section`
  margin: 20px 0 40px;
`

const Post = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto 12px auto;
  text-align: left;
  background-color: #3c3c3c;
  padding: 10px;
  color: #ffffff;
  border-radius: 4px;
`

const PostContent = styled.div`
  flex: 1;
  margin-left: 18px;
  padding: 12px;
`

const UsernameStyled = styled.h4`
  margin: 0 0 12px 0;
  padding: 0;
`

const ImageStyled = styled.img`
  flex: 0 0 60px;
  width: 60px;
  height: 60px;
  margin: 0;
  border-radius: 50%;
`

class RecentPosts extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextProps) !== JSON.stringify(nextState)
  }

  render() {
    return (
      <Posts>
        <h2>Recent Posts</h2>
        {
          this.props.posts.map((post) => {
            return (
              <Post key={post._id}>
                <ImageStyled src={post.profile_image} alt={`${post.username} Profile Picture`} />
                <PostContent>
                  <UsernameStyled>{post.username}</UsernameStyled>
                  <p style={{ margin: 0, fontFamily: 'sans-serif' }}>
                    {post.content}
                  </p>
                </PostContent>
              </Post>)
          })
        }

        {
          this.props.isPostsLoaded ? this.props.posts.length === 0 && <p>There are no posts to display</p> : <p>Loading...</p>
        }
      </Posts>)
  }

}

export default RecentPosts
