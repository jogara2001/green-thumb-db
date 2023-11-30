import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// This is a mess that needs cleaning
export async function POST (request: Request) {
  try {
    const { search } = await request.json()
    const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&prop=pageimages&gsrsearch='${search} plant'`
    const response = await fetch(url)
    const data = await response.json()
    //   console.log(JSON.stringify(data, null, 1))
    const firstPage = Object.values(data.query.pages)[0] as any

    const url2 = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&action=query&titles=Image:${firstPage.pageimage}&prop=imageinfo&iiprop=url`
    const response2 = await fetch(url2)
    const data2 = await response2.json()
    //   console.log(data2)
    const imageURL = data2.query.pages['-1'].imageinfo[0].url as string
    return NextResponse.json({ url: imageURL })
  } catch {
    return NextResponse.json({ url: null })
  }
}
