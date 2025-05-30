import fs from 'fs'
import path from 'path'
import { Client } from '@/types'

const CLIENT_DIR = path.join(process.cwd(), 'public/client')
const CLIENTS_FILE = path.join(CLIENT_DIR, 'clients.json')
const CLIENTS_DETAIL_DIR = path.join(CLIENT_DIR, 'clients')

// Ensure directories exist
if (!fs.existsSync(CLIENT_DIR)) {
  fs.mkdirSync(CLIENT_DIR, { recursive: true })
}
if (!fs.existsSync(CLIENTS_DETAIL_DIR)) {
  fs.mkdirSync(CLIENTS_DETAIL_DIR, { recursive: true })
}

// Initialize clients.json if it doesn't exist
if (!fs.existsSync(CLIENTS_FILE)) {
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify([]))
}

export function getAllClients(): Client[] {
  try {
    const data = fs.readFileSync(CLIENTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading clients:', error)
    return []
  }
}

export function addClient(client: Client): void {
  try {
    // Add to main clients list
    const clients = getAllClients()
    clients.push(client)
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2))

    // Create individual client file
    const clientFile = path.join(CLIENTS_DETAIL_DIR, `${client.id}.json`)
    fs.writeFileSync(clientFile, JSON.stringify({
      id: client.id,
      name: client.name,
      mobileNumber: client.mobileNumber,
      age: client.age,
      additionalFields: client.additionalFields
    }, null, 2))
  } catch (error) {
    console.error('Error adding client:', error)
    throw error
  }
} 