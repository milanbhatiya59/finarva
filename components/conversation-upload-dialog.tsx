"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileAudio, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConversationUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, name: string) => Promise<void>
}

export function ConversationUploadDialog({
  isOpen,
  onClose,
  onUpload,
}: ConversationUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversationName, setConversationName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async () => {
    if (!selectedFile || !conversationName.trim()) {
      toast({
        title: "Error",
        description: "Please select a file and enter a conversation name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      await onUpload(selectedFile, conversationName)
      toast({
        title: "Success",
        description: "Conversation uploaded successfully",
      })
      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload conversation",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setConversationName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="conversation-name">Conversation Name</Label>
            <Input
              id="conversation-name"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="Enter a name for this conversation"
            />
          </div>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <FileAudio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Upload audio file (.mp3 or .wav)</p>
              <input
                type="file"
                accept=".mp3,.wav"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              {selectedFile && (
                <p className="text-sm mt-2">Selected: {selectedFile.name}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload & Analyze"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 