"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle } from "lucide-react"

const skillsData = [
  { name: "Conversation Skills", progress: 75, color: "bg-blue-500" },
  { name: "Product Knowledge", progress: 82, color: "bg-green-500" },
  { name: "Customer Engagement", progress: 68, color: "bg-yellow-500" },
  { name: "Professionalism", progress: 90, color: "bg-purple-500" },
  { name: "Sales Effectiveness", progress: 73, color: "bg-red-500" },
]

export default function LearningModulePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Learning Modules</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Progress */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Skills Progress</h2>
          <div className="space-y-6">
            {skillsData.map((skill) => (
              <Card key={skill.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={skill.progress} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{skill.progress}%</span>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span>Level {Math.floor(skill.progress / 20) + 1}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Modules Placeholder */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Modules</h2>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground text-center">
                Interactive learning modules and training content will be available here soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
