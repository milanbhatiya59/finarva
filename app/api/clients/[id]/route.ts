import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedClient = await request.json()
    const filePath = path.join(process.cwd(), 'public/client/clients.json')
    
    // Read existing clients
    const fileContent = await fs.readFile(filePath, 'utf8')
    const clients = JSON.parse(fileContent)
    
    // Find and update the client
    const clientIndex = clients.findIndex((client: any) => client.id === params.id)
    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }
    
    clients[clientIndex] = updatedClient
    
    // Write updated clients back to file
    await fs.writeFile(filePath, JSON.stringify(clients, null, 2))
    
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
} 