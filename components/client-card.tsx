import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone } from "lucide-react"

interface Client {
  id: string
  name: string
  number: string
}

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Link href={`/client/${client.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{client.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{client.number}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
