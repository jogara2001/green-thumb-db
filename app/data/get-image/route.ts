import { NextResponse } from 'next/server'

// This is a mess that needs cleaning
export async function POST (request: Request) {
  const { search } = await request.json()
  const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&prop=pageimages&gsrsearch='${search}'`
  const response = await fetch(url)
  const data = await response.json()
  const firstPage = Object.values(data.query.pages)[0]

  const test = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&action=query&titles=Image:${firstPage.pageimage}&prop=imageinfo&iiprop=url`
  const response2 = await fetch(test)
  const data2 = await response2.json()
  const imageURL = data2.query.pages['-1'].imageinfo[0].url

  return NextResponse.json({ url: imageURL })
}
