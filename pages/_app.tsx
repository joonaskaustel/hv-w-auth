import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import { MantineProvider } from "@mantine/core"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      theme={{
        // Override any other properties from default theme
        spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <Component {...pageProps} />
    </SessionProvider>
    </MantineProvider>
  )
}
