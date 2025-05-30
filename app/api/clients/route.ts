import { NextResponse } from 'next/server'
import { addClient } from '@/utils/clientStorage'
import { Client } from '@/types'

export async function POST(request: Request) {
  try {
    const client: Client = await request.json()
    
    // Add client to storage
    addClient(client)
    
    return NextResponse.json({ success: true, client })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
} 