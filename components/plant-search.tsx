'use client'
import { Typography, TextField, IconButton, Stack, Collapse, Grid, Button, SwipeableDrawer, LinearProgress, FormLabel, FormControl } from '@mui/material'
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [nativeStatusDrawerOpen, setNativeStatusDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CharacteristicCategoryData | null>(null)
  const [locationSearchClicked, setLocationSearchClicked] = useState(false)
  const [locationSearching, setLocationSearching] = useState(false)

  const [characteristicCategories, setCharacteristicCategories] = useState<CharacteristicCategoryData[]>([])
  const [plants, setPlants] = useState<PlantCardProps[]>([])
  const [pageNum, setPageNum] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const [inputText, setInputText] = useState('')
  const [nativeCountry, setNativeCountry] = useState('')
  const [nativeState, setNativeState] = useState('')
  const [nativeCounty, setNativeCounty] = useState('')

  const handleLocationClick = () => {
    setLocationSearchClicked(true)
    setLocationSearching(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => { void setPosition(position) })
    } else {
      console.log('Geolocation not supported')
    }
  }

  const setPosition = async (position: GeolocationPosition) => {
    const response = await fetch('location/get-location', {
      method: 'POST',
      body: JSON.stringify({
        lat: position.coords.latitude,
        long: position.coords.longitude
      })
    })
    const { data } = await response.json()
    setNativeCountry(data.country)
    setNativeState(data.state)
    setNativeCounty(data.county)
    setLocationSearching(false)
  }

  const fetchNextPage = async () => {
    const nextPage = pageNum + 1
    setPageNum(nextPage)
    const newPlants = await fetchPlants(nextPage)
    setHasMore(newPlants.length === 12)
    setPlants([...plants, ...newPlants])
  }

  const openFiltersDrawer = (category: CharacteristicCategoryData) => {
    setSelectedCategory(category)
    setFilterDrawerOpen(true)
  }

  const handleCommonNameChange = (event: ChangeEvent<HTMLInputElement>) => { setInputText(event.target.value) }
  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => { setNativeCountry(event.target.value) }
  const handleStateChange = (event: ChangeEvent<HTMLInputElement>) => { setNativeState(event.target.value) }
  const handleCountyChange = (event: ChangeEvent<HTMLInputElement>) => { setNativeCounty(event.target.value) }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      void handleSearch()
    }
  }

  const handleSearch = async () => {
    setPageNum(0)
    setPlants([])
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
          country: nativeCountry,
          state: nativeState,
          county: nativeCounty
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
            <TextField fullWidth label="Search Common Name" onChange={handleCommonNameChange} value={inputText} onKeyDown={handleKeyPress}></TextField>
            <IconButton onClick={() => { void handleSearch() }}><Search/></IconButton>
          </Stack>

          <Collapse in={expandFilters}>
            <Grid container spacing={2} justifyContent={'center'} paddingBottom={2}>
              <Grid item xs="auto">
                <Button style={{ minWidth: 250 }} variant={'outlined'} onClick={() => { setNativeStatusDrawerOpen(true) }}>Native Status</Button>
              </Grid>
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
            open={nativeStatusDrawerOpen}
            onClose={() => { setNativeStatusDrawerOpen(false) }}
            onOpen={() => { setNativeStatusDrawerOpen(true) }}
          >
            <FormControl sx={{
              gap: 2,
              padding: 2
            }}>
              <FormLabel>Native Status</FormLabel>
              <TextField label="Country" onChange={handleCountryChange} value={nativeCountry}></TextField>
              <TextField label="State" onChange={handleStateChange} value={nativeState}></TextField>
              <TextField label="County" onChange={handleCountyChange} value={nativeCounty}></TextField>
              <Button disabled={locationSearchClicked} onClick={handleLocationClick}>Use Current Location</Button>
              {
                locationSearching
                  ? <LinearProgress></LinearProgress>
                  : null
              }
            </FormControl>
          </SwipeableDrawer>

          <SwipeableDrawer
            anchor={'bottom'}
            open={filterDrawerOpen}
            onClose={() => { setFilterDrawerOpen(false) }}
            onOpen={() => { setFilterDrawerOpen(true) }}
          >
            <Typography variant={'h5'}>{selectedCategory?.name}</Typography>
            {selectedCategory?.characteristics.map((characteristic) => (
              <Typography key={characteristic.id}>{characteristic.name}</Typography>
            ))}
          </SwipeableDrawer>
        </div>
  )
}
