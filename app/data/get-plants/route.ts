import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RESULTS_PER_PAGE = 12

interface QueryParams {
  nameFilter?: string
  page: number
  nativeStatus?: {
    country?: string
    state?: string
    county?: string
    status?: string
    type?: string
  }
}

export async function POST (request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const params: QueryParams = await request.json()
  const start = params.page * RESULTS_PER_PAGE

  let query = supabase
    .from('plants')
    .select('id, symbol, scientific_name, common_name, native_statuses!inner(country, state, county, status, type)')

  if (params.nameFilter && params.nameFilter !== '') {
    query = query.ilike('common_name', `%${params.nameFilter}%`)
  }
  if (params.nativeStatus) {
    if (params.nativeStatus.country && params.nativeStatus.country !== '') {
      query = query.eq('native_statuses.country', params.nativeStatus.country)
    }
    if (params.nativeStatus.state && params.nativeStatus.state !== '') {
      query = query.eq('native_statuses.state', params.nativeStatus.state)
    }
    if (params.nativeStatus.county && params.nativeStatus.county !== '') {
      query = query.eq('native_statuses.county', params.nativeStatus.county)
    }
    if (params.nativeStatus.status && params.nativeStatus.status !== '') {
      query = query.eq('native_statuses.status', params.nativeStatus.status)
    }
    if (params.nativeStatus.type && params.nativeStatus.type !== '') {
      query = query.eq('native_statuses.type', params.nativeStatus.type)
    }
  }

  const { data, error } = await query.range(start, start + RESULTS_PER_PAGE - 1)

  const newArray = data?.map(({ native_statuses, ...keepAttrs }) => keepAttrs)

  if (error) {
    console.log(error)
    return NextResponse.json({
      plants: [],
      error: true
    })
  }
  return NextResponse.json({
    plants: newArray,
    error: false
  })
}
