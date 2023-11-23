import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material'
import PlantSearch from '@/components/plant-search'

export default function Index () {
  // Server component can't have state (this file should be a server component)
  // Instead this file (or another child server component) should make the call to figure out user, then that should be passed to some user/avatar client component
  // const [user, setUser] = useState(null)
  const user = null

  // const {
  //   data: { user }
  // } = await supabase.auth.getUser()

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar sx={{
          justifyContent: 'space-between'
        }}>
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
      <PlantSearch></PlantSearch>
    </div>
  )
}
