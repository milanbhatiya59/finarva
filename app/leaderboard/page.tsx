"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "Rajesh Kumar", location: "Mumbai", points: 2450, percentile: 99.9 },
  { rank: 2, name: "Priya Sharma", location: "Delhi", points: 2380, percentile: 99.5 },
  { rank: 3, name: "Amit Singh", location: "Bangalore", points: 2320, percentile: 99.2 },
  { rank: 4, name: "Sneha Patel", location: "Pune", points: 2280, percentile: 98.8 },
  { rank: 5, name: "Vikram Reddy", location: "Hyderabad", points: 2250, percentile: 98.5 },
  { rank: 6, name: "Kavya Nair", location: "Chennai", points: 2200, percentile: 98.0 },
  { rank: 7, name: "Rohit Gupta", location: "Kolkata", points: 2150, percentile: 97.5 },
  { rank: 8, name: "Anita Joshi", location: "Jaipur", points: 2100, percentile: 97.0 },
  { rank: 9, name: "Suresh Yadav", location: "Lucknow", points: 2050, percentile: 96.5 },
  { rank: 10, name: "Meera Iyer", location: "Kochi", points: 2000, percentile: 96.0 },
  { rank: 47, name: "Darpan", location: "Mumbai", points: 1650, percentile: 85.2 },
]

const bonusStructure = [
  { tier: "Top 0.1%", bonus: "10%", icon: Trophy, color: "text-yellow-500" },
  { tier: "Top 1%", bonus: "5%", icon: Medal, color: "text-gray-400" },
  { tier: "Top 10%", bonus: "2%", icon: Award, color: "text-amber-600" },
]

export default function LeaderboardPage() {
  const userRank = leaderboardData.find((agent) => agent.name === "Darpan")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {userRank && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">#{userRank.rank}</div>
                    <p className="text-muted-foreground">Current Rank</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userRank.percentile}%</div>
                    <p className="text-muted-foreground">Percentile</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{userRank.points}</div>
                    <p className="text-muted-foreground">Total Points</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bonus Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bonusStructure.map((bonus, index) => {
                  const IconComponent = bonus.icon
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-5 w-5 ${bonus.color}`} />
                        <span>{bonus.tier}</span>
                      </div>
                      <Badge variant="secondary">{bonus.bonus} bonus</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Agents Across India</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Percentile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((agent) => (
                    <TableRow key={agent.rank} className={agent.name === "Darpan" ? "bg-muted" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {agent.rank <= 3 && (
                            <Trophy
                              className={`h-4 w-4 ${
                                agent.rank === 1
                                  ? "text-yellow-500"
                                  : agent.rank === 2
                                    ? "text-gray-400"
                                    : "text-amber-600"
                              }`}
                            />
                          )}
                          <span>#{agent.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.location}</TableCell>
                      <TableCell>{agent.points}</TableCell>
                      <TableCell>{agent.percentile}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
