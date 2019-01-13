import { Link, navigate } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { isLoggedIn, logout, getUserNickname } from "../services/auth"

import Button from './button'
let nickname = getUserNickname()

const Header = ({ siteTitle }) => (
  <div
    style={{
      borderTop: `4px solid rebeccapurple`,
      marginBottom: `3.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 720,
        padding: `1.45rem 1.0875rem`,
        display: `flex`,
        justifyContent: `space-between`
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `rebeccapurple`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      {
        isLoggedIn() ? (
          <Button
            href="/"
            onClick={event => {
              event.preventDefault()
              logout(() => navigate(`/`))
            }}
            variant="header"
            buttonType="a"
            title={`Logout ${nickname}`}
          >
            Logout
          </Button>) : null
      }
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
