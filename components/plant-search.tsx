'use client'
import { Typography, TextField, IconButton, Stack, Collapse, Grid } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { type ChangeEvent, useEffect, useState } from 'react'
import { Search } from '@mui/icons-material'
import { type PlantData, PlantCard } from './plant-card'

interface CharacteristicCategoryData {
  id: number
  name: string
  characteristics: CategoryData[]
}

interface CategoryData {
  id: number
  name: string
}

export default function PlantSearch () {
  const [expandFilters, setExpandFilters] = useState(false)
  const [characteristicCategories, setCharacteristicCategories] = useState<CharacteristicCategoryData[]>([])
  const [plants, setPlants] = useState<PlantData[]>([])
  const [inputText, setInputText] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      // Need to remove void and handle errors
      void fetchPlants()
    }
  }

  const fetchCharacteristics = async () => {
    const response = await fetch('data/get-characteristics')
    const newCharacteristics = await response.json()
    setCharacteristicCategories(newCharacteristics)
  }

  const fetchPlants = async () => {
    const response = await fetch('data/get-plants', {
      method: 'POST',
      body: JSON.stringify({
        nameFilter: inputText,
        start: 0,
        end: 10
      })
    })
    const newPlants = await response.json()
    setPlants(newPlants)
  }

  useEffect(() => {
    // Need to remove void and handle errors
    void fetchPlants()
    void fetchCharacteristics()
  }, [])

  return (
        <div>
          <Stack direction="row" padding={2} spacing={1}>
            <IconButton onClick={() => { setExpandFilters(!expandFilters) }}><FilterListIcon/></IconButton>
            <TextField fullWidth label="Search Common Name" onChange={handleInputChange} value={inputText} onKeyDown={handleKeyPress}></TextField>
            <IconButton onClick={() => fetchPlants}><Search/></IconButton>
          </Stack>
          <Collapse in={expandFilters}>
            {characteristicCategories.map((value) => (<Typography key={value.id}>{value.name}</Typography>))}
          </Collapse>
          <Grid container spacing={3} justifyContent={'center'}>
            {plants.map((value) => (
              <Grid item key={value.id} xs="auto">
                <PlantCard {...value}></PlantCard>
              </Grid>
            ))}
          </Grid>
        </div>
  )
}
