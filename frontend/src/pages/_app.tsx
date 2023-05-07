import '@/styles/globals.css'
import { ApolloProvider } from '@apollo/client/react'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { client } from '../graphql/apollo-client'
import {ThemeProvider} from '../lib/ThemeProvider'

export default function App({ Component, pageProps:{session, ...pageProps} }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
          <Component {...pageProps} />
          <Toaster/>
      </SessionProvider>
    </ApolloProvider>
  )
}
