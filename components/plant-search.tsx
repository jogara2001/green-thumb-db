'use client'
import { Typography, TextField, IconButton, Stack, Collapse, Grid, Button, SwipeableDrawer, LinearProgress } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { type ChangeEvent, useEffect, useState } from 'react'
import { Search } from '@mui/icons-material'
import { PlantCard, type PlantCardProps } from './plant-card'
import InfiniteScroll from 'react-infinite-scroll-component'

interface CharacteristicCategoryData {
  id: number
  name: string
  characteristics: CharacteristicData[]
}

interface CharacteristicData {
  id: number
  name: string
}

export default function PlantSearch () {
  const [expandFilters, setExpandFilters] = useState(false)
  const [characteristicCategories, setCharacteristicCategories] = useState<CharacteristicCategoryData[]>([])
  const [plants, setPlants] = useState<PlantCardProps[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CharacteristicCategoryData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pageNum, setPageNum] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchNextPage = async () => {
    const nextPage = pageNum + 1
    setPageNum(nextPage)
    const newPlants = await fetchPlants(nextPage)
    setHasMore(newPlants.length === 12)
    setPlants([...plants, ...newPlants])
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
      void handleSearch()
    }
  }

  const handleSearch = async () => {
    setPageNum(0)
    const newPlants = await fetchPlants(0)
    setHasMore(newPlants.length === 12)
    setPlants(newPlants)
  }

  const fetchCharacteristics = async () => {
    const response = await fetch('data/get-characteristics')
    const newCharacteristics = await response.json()
    setCharacteristicCategories(newCharacteristics)
  }

  const fetchPlants = async (page: number) => {
    const response = await fetch('data/get-plants', {
      method: 'POST',
      body: JSON.stringify({
        nameFilter: inputText,
        page,
        nativeStatus: {
          country: '',
          state: '',
          county: '',
          status: '',
          type: ''
        }
      })
    })
    const { plants } = await response.json()
    return plants
  }

  useEffect(() => {
    // Need to remove void and handle errors
    void handleSearch()
    void fetchCharacteristics()
  }, [])

  return (
        <div>
          <Stack direction="row" padding={2} spacing={1}>
            <IconButton onClick={() => { setExpandFilters(!expandFilters) }}><FilterListIcon/></IconButton>
            <TextField fullWidth label="Search Common Name" onChange={handleInputChange} value={inputText} onKeyDown={handleKeyPress}></TextField>
            <IconButton onClick={() => { void handleSearch() }}><Search/></IconButton>
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

          <InfiniteScroll
              dataLength={plants.length}
              next={() => { void fetchNextPage() }}
              hasMore={hasMore}
              loader={<LinearProgress/>}
          >
            <Grid container spacing={3} justifyContent={'center'} paddingBottom={3}>
              {plants.map((value) => (
                <Grid item key={value.id} xs="auto">
                  <PlantCard {...value}></PlantCard>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>

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
