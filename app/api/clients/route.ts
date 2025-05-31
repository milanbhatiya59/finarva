import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/client/clients.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const clients = JSON.parse(fileContent)
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error reading clients:', error)
    return NextResponse.json({ error: 'Failed to read clients' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newClient = await request.json()
    const filePath = path.join(process.cwd(), 'public/client/clients.json')
    
    // Read existing clients
    const fileContent = await fs.readFile(filePath, 'utf8')
    const clients = JSON.parse(fileContent)
    
    // Add new client
    clients.push(newClient)
    
    // Write updated clients back to file
    await fs.writeFile(filePath, JSON.stringify(clients, null, 2))
    
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
} 