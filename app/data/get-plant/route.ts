import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GetPlantParams {
  id: string
}

interface PlantData {
  id: string
  symbol: string
  scientific_name: string
  common_name: string
  native_statuses: Array<{
    country: string
    state: string
    county: string
    status: string
    type: string
  }>
  plants_to_characteristics: Array<{
    value: string
    characteristics: {
      name: string
    }
  }>
}

export async function POST (request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const params: GetPlantParams = await request.json()

  const query = supabase
    .from('plants')
    .select('id, symbol, scientific_name, common_name, native_statuses!inner(country, state, county, status, type), plants_to_characteristics!inner(value, characteristics!inner(name))')
    .eq('id', params.id)
    .limit(1)
    .returns<PlantData[]>()

  const { data, error } = await query

  if (error) {
    console.log(error)
    return NextResponse.json({
      plant: {},
      error: true
    })
  }

  const characteristics = new Map()

  const { plants_to_characteristics, ...rest } = data[0]
  plants_to_characteristics.forEach(value => { characteristics.set(String(value.characteristics.name), value.value) })
  const plant = {
    ...rest,
    characteristics: Object.fromEntries(characteristics.entries())
  }

  return NextResponse.json({
    plant,
    error: false
  })
}
