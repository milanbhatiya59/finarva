export interface Client {
  id: string
  name: string
  mobileNumber: string
  age: number
  additionalFields: Array<{
    id: string
    title: string
    description: string
  }>
} 