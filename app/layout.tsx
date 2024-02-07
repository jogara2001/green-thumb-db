import ThemeRegistry from './ThemeRegistry'

export const metadata = {
  icons: {
    icon: '/icon.png'
  },
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
