"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import ErrorDisplay from "../ui/error-display"

export default function PaperDisplay() {
  const [paperContent, setPaperContent] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPaperContent() {
      try {
        const response = await fetch(
          "https://blobs.vusercontent.net/blob/project_paper-K20T433cas91u74HFW39ZWV0YHfEA0.txt",
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch paper content: ${response.status} ${response.statusText}`)
        }

        const text = await response.text()

        if (!text || text.trim() === "") {
          throw new Error("Empty paper content received")
        }

        setPaperContent(text)
        setError(null)
      } catch (err) {
        console.error("Error fetching paper content:", err)
        setError(`Failed to load paper content: ${err.message}`)

        // Set fallback content
        setPaperContent(`# TOP SECRET: CLASSIFIED DOCUMENT

## RESTRICTED ACCESS

This is a fallback document displayed when the actual classified content cannot be loaded.

Nuclear energy research and development contains sensitive information relevant to national security.

## CONFIDENTIAL FINDINGS

- Nuclear power plants strategic deployment details
- Safety protocols and containment procedures
- Advanced reactor design specifications
- Critical infrastructure vulnerability assessment

## SECURITY NOTICE

Unauthorized access to this document is prohibited. All information contained within is classified.`)
      } finally {
        setLoading(false)
      }
    }

    fetchPaperContent()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
        <span className="text-xs">LOADING DOCUMENT...</span>
      </div>
    )
  }

  if (error && !paperContent) {
    return <ErrorDisplay message={error} />
  }

  return (
    <div className="h-96 overflow-y-auto pr-4 custom-scrollbar">
      <div className="markdown">
        <ReactMarkdown>{paperContent}</ReactMarkdown>
      </div>
    </div>
  )
}
