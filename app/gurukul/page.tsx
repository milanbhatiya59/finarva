"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GurukulPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/gurukul/dronacharya")
  }, [router])

  return null
}
