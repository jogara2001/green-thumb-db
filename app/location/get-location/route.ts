import { NextResponse } from 'next/server'
import { Client, PlaceType2 } from '@googlemaps/google-maps-services-js'

export const dynamic = 'force-dynamic'

interface GetLocationParams {
  lat: number
  long: number
}

interface GetLocationResponse {
  country: string
  state: string
  county: string
}

export async function POST (request: Request) {
  const params: GetLocationParams = await request.json()
  const client = new Client({})

  const response = await client.reverseGeocode({
    params: {
      latlng: [params.lat, params.long],
      key: process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : '',
      result_type: [PlaceType2.country, PlaceType2.administrative_area_level_1, PlaceType2.administrative_area_level_2]
    }
  })

  const components = response.data.results[0].address_components
  const getLocationResponse: GetLocationResponse = {
    country: '',
    state: '',
    county: ''
  }
  components.forEach(function (value) {
    if (value.types.includes(PlaceType2.country)) {
      getLocationResponse.country = value.long_name
    } else if (value.types.includes(PlaceType2.administrative_area_level_1)) {
      getLocationResponse.state = value.long_name
    } else if (value.types.includes(PlaceType2.administrative_area_level_2)) {
      getLocationResponse.county = value.long_name.replace('County', '').trim()
    }
  })
  return NextResponse.json({
    data: getLocationResponse
  })
}
