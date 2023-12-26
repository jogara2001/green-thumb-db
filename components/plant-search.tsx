'use client'
import { Typography, TextField, IconButton, Stack, Collapse, Grid, Button, SwipeableDrawer, Pagination } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { type ChangeEvent, useEffect, useState } from 'react'
import { Search } from '@mui/icons-material'
import { type PlantData, PlantCard } from './plant-card'

interface CharacteristicCategoryData {
  id: number
  name: string
  characteristics: CharacteristicData[]
}

interface CharacteristicData {
  id: number
  name: string
}

const PAGE_SIZE = 12

export default function PlantSearch () {
  const [expandFilters, setExpandFilters] = useState(false)
  const [characteristicCategories, setCharacteristicCategories] = useState<CharacteristicCategoryData[]>([])
  const [plants, setPlants] = useState<PlantData[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CharacteristicCategoryData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pageNum, setPageNum] = useState(0)

  const handlePageChange = (page: number) => {
    setPageNum(page)
    void fetchPlants(page * PAGE_SIZE)
  }

  const openFiltersDrawer = (category: CharacteristicCategoryData) => {
    setSelectedCategory(category)
    setDrawerOpen(true)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    setPageNum(0)
    void fetchPlants(0)
  }

  const fetchCharacteristics = async () => {
    const response = await fetch('data/get-characteristics')
    const newCharacteristics = await response.json()
    setCharacteristicCategories(newCharacteristics)
  }

  const fetchPlants = async (start: number) => {
    const response = await fetch('data/get-plants', {
      method: 'POST',
      body: JSON.stringify({
        nameFilter: inputText,
        start,
        end: start + PAGE_SIZE - 1
      })
    })
    const newPlants = await response.json()
    setPlants(newPlants)
  }

  useEffect(() => {
    // Need to remove void and handle errors
    void fetchPlants(pageNum * 10)
    void fetchCharacteristics()
  }, [])

  return (
        <div>
          <Stack direction="row" padding={2} spacing={1}>
            <IconButton onClick={() => { setExpandFilters(!expandFilters) }}><FilterListIcon/></IconButton>
            <TextField fullWidth label="Search Common Name" onChange={handleInputChange} value={inputText} onKeyDown={handleKeyPress}></TextField>
            <IconButton onClick={handleSearch}><Search/></IconButton>
          </Stack>

          <Collapse in={expandFilters}>
            <Grid container spacing={2} justifyContent={'center'} paddingBottom={2}>
              {characteristicCategories.map((category) => (
                <Grid item key={category.id} xs="auto">
                  <Button style={{ minWidth: 250 }} variant={'outlined'} key={category.id} onClick={() => { openFiltersDrawer(category) }}>{category.name}</Button>
                </Grid>
              ))}
            </Grid>
          </Collapse>

          <Grid container spacing={3} justifyContent={'center'}>
            {plants.map((value) => (
              <Grid item key={value.id} xs="auto">
                <PlantCard {...value}></PlantCard>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} justifyContent={'center'} padding={2}>
            <Grid item>
              <Pagination
                page={pageNum + 1}
                count={10}
                color={'primary'}
                onChange={(event, page) => { handlePageChange(page - 1) }}
              />
            </Grid>
          </Grid>

          <SwipeableDrawer
            anchor={'bottom'}
            open={drawerOpen}
            onClose={() => { setDrawerOpen(false) }}
            onOpen={() => { setDrawerOpen(true) }}
          >
            <Typography variant={'h5'}>{selectedCategory?.name}</Typography>
            {selectedCategory?.characteristics.map((characteristic) => (
              <Typography key={characteristic.id}>{characteristic.name}</Typography>
            ))}
          </SwipeableDrawer>
        </div>
  )
}
