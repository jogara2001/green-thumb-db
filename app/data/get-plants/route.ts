import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RESULTS_PER_PAGE = 12

export async function POST (request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { nameFilter, page } = await request.json()
  const start = page * RESULTS_PER_PAGE

  let { count } = await supabase
    .from('plants')
    .select('*', { count: 'exact', head: true })
    .ilike('common_name', `%${nameFilter}%`)

  if (count == null) {
    count = 0
  }

  const totalPages = Math.ceil(count / RESULTS_PER_PAGE)

  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .ilike('common_name', `%${nameFilter}%`)
    .range(start, start + RESULTS_PER_PAGE - 1)

  if (error) {
    console.log(error)
    return NextResponse.json({
      pages: 0,
      plants: []
    })
  }
  return NextResponse.json({
    pages: totalPages,
    plants: data
  })
}
