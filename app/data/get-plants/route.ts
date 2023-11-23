import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { nameFilter, start, end } = await request.json()

  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .ilike('common_name', `%${nameFilter}%`)
    .range(start, end)

  if (error) {
    console.log(error)
    return  NextResponse.json([])
  }
  return NextResponse.json(data)
}
