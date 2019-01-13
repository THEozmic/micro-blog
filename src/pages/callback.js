import React from 'react'
import { navigate } from 'gatsby'
import { handleAuthentication } from '../services/auth'


import Layout from '../components/layout'

export default () => {
  handleAuthentication(() => navigate('/app/home'))

  return (
    <Layout>
      <p>Logging you in...</p>
    </Layout>
  )
}
