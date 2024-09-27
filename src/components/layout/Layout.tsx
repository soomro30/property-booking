import React from 'react'
import Header from './Header'
import { Container } from '@mui/material'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">{children}</Container>
    </>
  )
}

export default Layout