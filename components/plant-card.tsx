'use client'
import { Button, Card, CardActions, CardContent, CardMedia, LinearProgress, SwipeableDrawer, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { PlantInfo } from './plant-info'

export interface PlantCardProps {
  id: number
  symbol: string
  scientific_name: string
  common_name: string
}

export interface Plant {
  id: number
  symbol: string
  scientific_name: string
  common_name: string
  native_statuses?: NativeStatus[]
  characteristics: Map<string, string>
}

export interface NativeStatus {
  country: string
  state: string
  county: string
  type: string
  status: string
}

export function PlantCard (props: PlantCardProps) {
  const [plantPicture, setPlantPicture] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [plant, setPlant] = useState<Plant | undefined>(undefined)

  const fetchPicture = async () => {
    const response = await fetch('data/get-image', {
      method: 'POST',
      body: JSON.stringify({
        search: props.common_name
      })
    })
    const newPlantPicture = await response.json()
    if (newPlantPicture.url != null) {
      setPlantPicture(newPlantPicture.url)
    } else {
      setPlantPicture('/logo.png')
    }
  }

  const openDrawer = async () => {
    setDrawerOpen(true)
    if (!plant) {
      void fetchPlant()
    }
  }

  const fetchPlant = async () => {
    const response = await fetch('data/get-plant', {
      method: 'POST',
      body: JSON.stringify({
        id: props.id
      })
    })

    const { plant } = await response.json()
    setPlant(plant)
  }

  useEffect(() => {
    // Need to remove void and handle errors
    void fetchPicture()
  }, [])

  return (
    <Card variant="outlined" sx={{ width: 345, height: 345 }}>
      <CardMedia
          component="img"
          height="225"
          image={plantPicture}
        />
      <CardContent>
        <Typography noWrap variant="h5">{props.common_name.toUpperCase()}</Typography>
      </CardContent>
      <CardActions onClick={ () => { void openDrawer() }}>
          <Button size='small'>Learn More</Button>
      </CardActions>

      <SwipeableDrawer
            anchor={'bottom'}
            open={drawerOpen}
            onClose={() => { setDrawerOpen(false) }}
            onOpen={() => { void openDrawer() }}
          >
            {
              plant
                ? <PlantInfo {...plant}></PlantInfo>
                : <LinearProgress></LinearProgress>
            }

      </SwipeableDrawer>
    </Card>
  )
}
