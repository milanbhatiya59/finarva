"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Info, Plus, X, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Predefined client types with personalities
const clientTypes = [
    {
        id: "yudhishthir",
        name: "Yudhishthir",
        title: "The Righteous Decision Maker",
        description: "A principled individual who values honesty and long-term security above all.",
        traits: ["Ethical", "Analytical", "Risk-Averse"],
        defaultParams: {
            age: "45",
            occupation: "Government Official",
            income: "1200000", // 12 LPA
            familySize: "4",
            riskTolerance: "Low",
            investmentStyle: "Conservative",
            primaryConcerns: ["Family Security", "Retirement Planning"],
        },
        personality: `
      - Makes decisions based on moral principles
      - Appreciates transparency and detailed explanations
      - Values long-term stability over short-term gains
      - Concerned about family's future security
      - Prefers comprehensive coverage
    `,
    },
    {
        id: "bheem",
        name: "Bheem",
        title: "The Direct Enthusiast",
        description: "A straightforward client who values strength and immediate benefits.",
        traits: ["Direct", "Action-Oriented", "Protection-Focused"],
        defaultParams: {
            age: "35",
            occupation: "Business Owner",
            income: "2000000", // 20 LPA
            familySize: "3",
            riskTolerance: "High",
            investmentStyle: "Aggressive",
            primaryConcerns: ["Health Protection", "Wealth Creation"],
        },
        personality: `
      - Prefers straightforward communication
      - Makes quick decisions based on gut feeling
      - Values strength and reliability in offerings
      - Interested in premium features and benefits
      - Needs clear, actionable information
    `,
    },
    {
        id: "arjuna",
        name: "Arjuna",
        title: "The Skilled Perfectionist",
        description: "A detail-oriented professional seeking the perfect balance of benefits.",
        traits: ["Detail-Oriented", "Performance-Driven", "Balance-Seeking"],
        defaultParams: {
            age: "32",
            occupation: "Corporate Executive",
            income: "2500000", // 25 LPA
            familySize: "2",
            riskTolerance: "Moderate",
            investmentStyle: "Balanced",
            primaryConcerns: ["Career Protection", "Investment Returns"],
        },
        personality: `
      - Asks detailed questions about policy features
      - Compares multiple options before deciding
      - Values performance metrics and statistics
      - Seeks optimal balance of cost and benefits
      - Interested in future flexibility
    `,
    },
    {
        id: "nakula",
        name: "Nakula",
        title: "The Modern Minimalist",
        description: "A young professional focused on efficient, digital-first solutions.",
        traits: ["Tech-Savvy", "Efficiency-Focused", "Modern"],
        defaultParams: {
            age: "28",
            occupation: "Tech Professional",
            income: "1800000", // 18 LPA
            familySize: "1",
            riskTolerance: "Moderate-High",
            investmentStyle: "Growth",
            primaryConcerns: ["Digital Convenience", "Flexibility"],
        },
        personality: `
      - Prefers digital interactions and paperless processes
      - Values time efficiency and quick responses
      - Interested in modern, flexible solutions
      - Research-oriented and tech-savvy
      - Looks for customization options
    `,
    },
    {
        id: "sahadeva",
        name: "Sahadeva",
        title: "The Wise Planner",
        description: "A thoughtful individual who considers all angles before deciding.",
        traits: ["Strategic", "Forward-Thinking", "Analytical"],
        defaultParams: {
            age: "40",
            occupation: "Financial Advisor",
            income: "2200000", // 22 LPA
            familySize: "3",
            riskTolerance: "Moderate",
            investmentStyle: "Strategic",
            primaryConcerns: ["Tax Planning", "Estate Planning"],
        },
        personality: `
      - Takes time to analyze all options
      - Interested in long-term implications
      - Values expert opinions and research
      - Considers tax and estate planning aspects
      - Looks for strategic advantages
    `,
    },
    {
        id: "draupadi",
        name: "Draupadi",
        title: "The Empowered Decision Maker",
        description: "A strong-willed professional who values independence and comprehensive protection.",
        traits: ["Independent", "Assertive", "Protection-Focused"],
        defaultParams: {
            age: "35",
            occupation: "Entrepreneur",
            income: "3000000", // 30 LPA
            familySize: "2",
            riskTolerance: "Moderate-High",
            investmentStyle: "Growth-Oriented",
            primaryConcerns: ["Business Protection", "Personal Security"],
        },
        personality: `
      - Makes independent, well-researched decisions
      - Values comprehensive protection plans
      - Interested in women-specific policy benefits
      - Seeks long-term financial independence
      - Appreciates clear, professional communication
    `,
    },
    {
        id: "karna",
        name: "Karna",
        title: "The Generous Achiever",
        description: "A self-made professional with high aspirations and a generous spirit.",
        traits: ["Ambitious", "Generous", "Risk-Taking"],
        defaultParams: {
            age: "38",
            occupation: "Senior Executive",
            income: "4000000", // 40 LPA
            familySize: "4",
            riskTolerance: "High",
            investmentStyle: "Aggressive Growth",
            primaryConcerns: ["Wealth Creation", "Family Protection"],
        },
        personality: `
      - Makes bold, ambitious decisions
      - Values comprehensive family protection
      - Interested in high-return investment options
      - Seeks premium services and exclusive benefits
      - Appreciates direct, honest communication
    `,
    },
    {
        id: "abhimanyu",
        name: "Abhimanyu",
        title: "The Young Innovator",
        description: "A young, tech-savvy professional with innovative approaches to financial planning.",
        traits: ["Innovative", "Tech-Savvy", "Growth-Focused"],
        defaultParams: {
            age: "26",
            occupation: "Startup Founder",
            income: "1500000", // 15 LPA
            familySize: "1",
            riskTolerance: "High",
            investmentStyle: "Aggressive",
            primaryConcerns: ["Business Growth", "Tech Integration"],
        },
        personality: `
      - Embraces innovative financial solutions
      - Prefers digital-first approach
      - Interested in modern insurance products
      - Values flexibility and scalability
      - Seeks quick, efficient processes
    `,
    },
]

interface CustomField {
    id: string
    title: string
    description: string
}

interface ClientFormData {
    name: string
    city: string
    occupation: string
    age: string
    income: string
    maritalStatus: string
    lifestyle: {
        drinking: boolean
        smoking: boolean
    }
    personality: string
    customFields: CustomField[]
    customPrompt: string
}

const cityOptions = [
    { value: "tier1", label: "Tier 1 (Metro)" },
    { value: "tier2", label: "Tier 2 (Urban)" },
    { value: "tier3", label: "Tier 3 (Semi-urban)" },
    { value: "rural", label: "Rural" },
]

const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
]

const personalityOptions = [
    { value: "friendly", label: "Friendly and Open" },
    { value: "strict", label: "Strict and Formal" },
    { value: "skeptical", label: "Skeptical" },
    { value: "analytical", label: "Analytical" },
    { value: "impulsive", label: "Impulsive" },
    { value: "traditional", label: "Traditional" },
]

export function ClientTypeSelector() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [expandedCard, setExpandedCard] = useState<string | null>(null)
    const router = useRouter()
    const [formData, setFormData] = useState<ClientFormData>({
        name: "",
        city: "",
        occupation: "",
        age: "",
        income: "",
        maritalStatus: "",
        lifestyle: {
            drinking: false,
            smoking: false,
        },
        personality: "",
        customFields: [],
        customPrompt: "",
    })
    const [newField, setNewField] = useState({ title: "", description: "" })

    const handleInputChange = (field: string, value: string | boolean | object) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddField = () => {
        if (newField.title && newField.description) {
            setFormData((prev) => ({
                ...prev,
                customFields: [...prev.customFields, { ...newField, id: Date.now().toString() }],
            }))
            setNewField({ title: "", description: "" })
        }
    }

    const removeField = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            customFields: prev.customFields.filter((field) => field.id !== id),
        }))
    }

    const handleClientTypeSelect = (typeId: string) => {
        setSelectedType(typeId)
        const selectedClient = clientTypes.find(type => type.id === typeId)
        if (selectedClient) {
            setFormData(prev => ({
                ...prev,
                name: `${selectedClient.name} (AI Client)`,
                age: selectedClient.defaultParams.age,
                occupation: selectedClient.defaultParams.occupation,
                income: selectedClient.defaultParams.income,
                customPrompt: `${selectedClient.description}\n\nPersonality Traits:\n${selectedClient.personality}`,
                maritalStatus: "", // Reset other fields to default
                city: "",
                lifestyle: {
                    drinking: false,
                    smoking: false
                },
                personality: selectedClient.traits[0]?.toLowerCase() || "", // Use first trait as personality if available
                customFields: [] // Reset custom fields
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newId = Date.now().toString()
        router.push(`/gurukul/parshuram/${newId}`)
    }

    return (
        <div className="container mx-auto py-8">
            {/* Back Button */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/gurukul/parshuram')}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Training
                </Button>
            </div>

            <div className="grid grid-cols-5 gap-6">
                {/* Client Types List - 2 columns */}
                <div className="col-span-2 space-y-4 h-screen sticky top-0 pb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Create New Parshuram</h2>
                        <p className="text-sm text-gray-600 mt-2">Select a client template to auto-fill the form or create your own custom client.</p>
                    </div>

                    <ScrollArea className="h-[calc(100vh-150px)] pr-4">
                        <div className="space-y-3">
                            {clientTypes.map((type) => (
                                <Card
                                    key={type.id}
                                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedType === type.id
                                        ? "border-2 border-blue-500 bg-blue-50"
                                        : "hover:border-blue-200"
                                        }`}
                                    onClick={() => handleClientTypeSelect(type.id)}
                                    onMouseEnter={() => setExpandedCard(type.id)}
                                    onMouseLeave={() => setExpandedCard(null)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-800">{type.name}</h3>
                                                    {selectedType === type.id && (
                                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{type.title}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {type.traits.map((trait) => (
                                                        <Badge
                                                            key={trait}
                                                            variant="secondary"
                                                            className="text-xs bg-blue-100 text-blue-700"
                                                        >
                                                            {trait}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Expanded content */}
                                                {expandedCard === type.id && (
                                                    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <div className="bg-white/50 rounded-lg p-3 space-y-2">
                                                            <h4 className="text-sm font-medium text-gray-700">Default Parameters</h4>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {Object.entries(type.defaultParams).map(([key, value]) => (
                                                                    <div key={key} className="text-xs">
                                                                        <span className="text-gray-600">{key}:</span>
                                                                        <span className="ml-1 font-medium text-gray-800">
                                                                            {Array.isArray(value) ? value.join(", ") : value}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/50 rounded-lg p-3 space-y-2">
                                                            <h4 className="text-sm font-medium text-gray-700">Personality Traits</h4>
                                                            <div className="space-y-1">
                                                                {type.personality
                                                                    .trim()
                                                                    .split("\n")
                                                                    .map((line) => (
                                                                        <p key={line} className="text-xs text-gray-600">
                                                                            {line.trim()}
                                                                        </p>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Form Panel - 3 columns */}
                <div className="col-span-3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Required Parameters */}
                        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                                <CardTitle>Required Parameters</CardTitle>
                                <CardDescription className="text-blue-100">Basic client information</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City/Location *</Label>
                                        <Select
                                            value={formData.city}
                                            onValueChange={(value) => handleInputChange("city", value)}
                                            required
                                        >
                                            <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 rounded-xl">
                                                <SelectValue placeholder="Select city tier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cityOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age *</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            min="18"
                                            max="100"
                                            value={formData.age}
                                            onChange={(e) => handleInputChange("age", e.target.value)}
                                            className="border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="income">Annual Income (₹) *</Label>
                                        <Input
                                            id="income"
                                            type="number"
                                            min="0"
                                            step="10000"
                                            value={formData.income}
                                            onChange={(e) => handleInputChange("income", e.target.value)}
                                            className="border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Optional Parameters */}
                        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                                <CardTitle>Optional Parameters</CardTitle>
                                <CardDescription className="text-purple-100">Additional client characteristics</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="occupation">Occupation</Label>
                                        <Input
                                            id="occupation"
                                            value={formData.occupation}
                                            onChange={(e) => handleInputChange("occupation", e.target.value)}
                                            className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maritalStatus">Marital Status</Label>
                                        <Select
                                            value={formData.maritalStatus}
                                            onValueChange={(value) => handleInputChange("maritalStatus", value)}
                                        >
                                            <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                                                <SelectValue placeholder="Select marital status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {maritalStatusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Lifestyle</Label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.lifestyle.smoking}
                                                onChange={(e) =>
                                                    handleInputChange("lifestyle", { ...formData.lifestyle, smoking: e.target.checked })
                                                }
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            Smoking
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.lifestyle.drinking}
                                                onChange={(e) =>
                                                    handleInputChange("lifestyle", { ...formData.lifestyle, drinking: e.target.checked })
                                                }
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            Drinking
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="personality">Personality Type</Label>
                                    <Select
                                        value={formData.personality}
                                        onValueChange={(value) => handleInputChange("personality", value)}
                                    >
                                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                                            <SelectValue placeholder="Select personality type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {personalityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Custom Fields */}
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                                <CardTitle>Custom Fields</CardTitle>
                                <CardDescription className="text-green-100">Add your own parameters</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {formData.customFields.length > 0 && (
                                    <div className="space-y-3">
                                        {formData.customFields.map((field) => (
                                            <div
                                                key={field.id}
                                                className="flex items-start justify-between p-4 bg-white rounded-xl border-l-4 border-green-400"
                                            >
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{field.title}</h4>
                                                    <p className="text-sm text-gray-600">{field.description}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeField(field.id)}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input
                                        placeholder="Field title"
                                        value={newField.title}
                                        onChange={(e) => setNewField((prev) => ({ ...prev, title: e.target.value }))}
                                        className="border-2 border-gray-200 focus:border-green-400 rounded-xl"
                                    />
                                    <Input
                                        placeholder="Field description"
                                        value={newField.description}
                                        onChange={(e) => setNewField((prev) => ({ ...prev, description: e.target.value }))}
                                        className="border-2 border-gray-200 focus:border-green-400 rounded-xl"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddField}
                                    disabled={!newField.title || !newField.description}
                                    className="border-2 border-green-200 text-green-600 hover:bg-green-50"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Field
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Custom Prompt */}
                        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                                <CardTitle>Custom Prompt</CardTitle>
                                <CardDescription className="text-orange-100">Additional instructions for AI behavior</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Textarea
                                    value={formData.customPrompt}
                                    onChange={(e) => handleInputChange("customPrompt", e.target.value)}
                                    placeholder="Add any specific instructions or personality traits for the AI client..."
                                    className="min-h-[100px] border-2 border-gray-200 focus:border-orange-400 rounded-xl"
                                />
                            </CardContent>
                        </Card>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Create AI Client
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 