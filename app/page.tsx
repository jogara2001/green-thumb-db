import { AppBar, Toolbar, Typography } from '@mui/material'
import PlantSearch from '@/components/plant-search'

export default function Index () {
  return (
    <div>
      <AppBar position="sticky">
        <Toolbar sx={{
          justifyContent: 'space-between'
        }}>
          <Typography>
            Green Thumb DB
          </Typography>
        </Toolbar>
      </AppBar>
      <PlantSearch></PlantSearch>
    </div>
  )
}
