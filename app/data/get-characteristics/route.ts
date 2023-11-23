import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('characteristic_categories')
    .select('id, name, characteristics (id, name)')

  if (error) {
    console.log(error)
    return  NextResponse.json([])
  }
  return NextResponse.json(data)
}
