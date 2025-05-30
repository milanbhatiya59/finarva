"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Client } from "@/types"

interface NewClientDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onClientAdded: () => void
}

export function NewClientDialog({ open, onOpenChange, onClientAdded }: NewClientDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        age: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Create new client object
            const newClient: Client = {
                id: Date.now().toString(),
                name: formData.name,
                mobileNumber: formData.mobileNumber,
                age: parseInt(formData.age),
                additionalFields: [],
            }

            // Send to API
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClient),
            })

            if (!response.ok) {
                throw new Error('Failed to create client')
            }

            // Reset form
            setFormData({ name: "", mobileNumber: "", age: "" })

            // Close dialog and notify parent
            onOpenChange(false)
            onClientAdded()
        } catch (error) {
            console.error('Error creating client:', error)
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                        Enter the client's basic information below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Client Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter client's full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                            id="mobileNumber"
                            placeholder="Enter mobile number"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="Enter client's age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            min="1"
                            max="120"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Client'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 