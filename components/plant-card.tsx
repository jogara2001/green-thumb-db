'use client'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export interface PlantData {
  id: number
  symbol: string
  scientific_name: string
  common_name: string
}

export function PlantCard (props: PlantData) {
  const [plantPicture, setPlantPicture] = useState<string>('')

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
      <CardActions>
          <Button size='small'>Learn More</Button>
        </CardActions>
    </Card>
  )
}
