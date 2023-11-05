import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AppBar, Avatar, Box, Button, TableContainer, Toolbar, Container, Typography } from '@mui/material'

export const dynamic = 'force-dynamic'

export default async function Index () {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <main>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography>
                Green Thumb DB
              </Typography>
              {user
                ? (
                <Avatar></Avatar>
                  )
                : <Button
                  variant="contained"
                  color="secondary"
                  href="/login"
                  >
                    Login
                </Button>
              }
            </Toolbar>
          </AppBar>
          <TableContainer>

          </TableContainer>
        </Box>
      </Container>
    </main>
  )
}
