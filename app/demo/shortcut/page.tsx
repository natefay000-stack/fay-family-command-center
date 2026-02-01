"use client"

import { useState, useEffect } from "react"

export default function ShortcutSetupPage() {
  const [baseUrl, setBaseUrl] = useState("")
  const [testText, setTestText] = useState("Mason practice Saturday 8am @ Mountain West")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const apiUrl = `${baseUrl}/api/events/quick`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const testApi = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/events/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: testText }),
      })
      const data = await res.json()
      setTestResult(data.success ? `✅ ${data.speak}` : `❌ ${data.error}`)
    } catch (e) {
      setTestResult("❌ Failed to connect")
    }
    setTesting(false)
  }

  // Generate the shortcut URL scheme to open Shortcuts app
  const shortcutData = {
    WFWorkflowName: "Add to Fay Calendar",
    WFWorkflowActions: [
      {
        WFWorkflowActionIdentifier: "is.workflow.actions.dictatetext",
        WFWorkflowActionParameters: {},
      },
      {
        WFWorkflowActionIdentifier: "is.workflow.actions.getcontentsofurl",
        WFWorkflowActionParameters: {
          WFHTTPMethod: "POST",
          WFHTTPBodyType: "Json",
          WFURL: apiUrl,
          WFHTTPHeaders: { "Content-Type": "application/json" },
        },
      },
      {
        WFWorkflowActionIdentifier: "is.workflow.actions.speaktext",
        WFWorkflowActionParameters: {},
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📱 Apple Shortcut Setup</h1>
        <p className="text-gray-400 mb-8">Add events to your calendar using Siri or a home screen button</p>

        {/* API URL Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1️⃣ Your API Endpoint</h2>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={apiUrl}
              className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-sm font-mono"
            />
            <button
              onClick={() => copyToClipboard(apiUrl)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Test Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2️⃣ Test It First</h2>
          <p className="text-gray-400 text-sm mb-4">
            Make sure you've shared your Google Calendars with the service account first!
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg px-4 py-3"
              placeholder="Mason practice Saturday 8am"
            />
            <button
              onClick={testApi}
              disabled={testing}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold disabled:opacity-50"
            >
              {testing ? "..." : "Test"}
            </button>
          </div>
          {testResult && (
            <div className={`p-4 rounded-lg ${testResult.startsWith("✅") ? "bg-green-900/50" : "bg-red-900/50"}`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Manual Setup Instructions */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">3️⃣ Create the Shortcut</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium">Open the Shortcuts app on your iPhone</p>
                <p className="text-gray-400 text-sm">Tap the + button to create a new shortcut</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium">Add "Dictate Text" action</p>
                <p className="text-gray-400 text-sm">Search for "Dictate" and add it. This lets you speak the event.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium">Add "Get Contents of URL" action</p>
                <p className="text-gray-400 text-sm">Configure it:</p>
                <ul className="text-gray-400 text-sm list-disc list-inside mt-2 space-y-1">
                  <li>URL: <code className="bg-gray-700 px-2 py-0.5 rounded">{apiUrl}</code></li>
                  <li>Method: <code className="bg-gray-700 px-2 py-0.5 rounded">POST</code></li>
                  <li>Request Body: <code className="bg-gray-700 px-2 py-0.5 rounded">JSON</code></li>
                  <li>Add key: <code className="bg-gray-700 px-2 py-0.5 rounded">text</code> = Dictated Text (from step 2)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium">Add "Get Dictionary Value" action</p>
                <p className="text-gray-400 text-sm">Get the "speak" key from the previous result</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">5</div>
              <div>
                <p className="font-medium">Add "Speak Text" action</p>
                <p className="text-gray-400 text-sm">Speak the dictionary value. Siri will confirm "Added Mason practice on Saturday..."</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold flex-shrink-0">✓</div>
              <div>
                <p className="font-medium">Name it & Add to Home Screen</p>
                <p className="text-gray-400 text-sm">Name it "Add to Calendar" and add to your home screen for quick access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Phrases */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">💬 What You Can Say</h2>
          <div className="grid gap-3">
            {[
              "Mason practice Saturday 8am",
              "Dalton game tomorrow at 4pm at Mountain West",
              "Family dinner Friday 6:30pm at Grandmas",
              "Meeting Monday 10am to 11am",
              "Tournament Feb 14 all day",
              "Nate dentist appointment Tuesday 2pm",
            ].map((phrase) => (
              <div
                key={phrase}
                className="bg-gray-700 rounded-lg px-4 py-3 text-sm cursor-pointer hover:bg-gray-600"
                onClick={() => setTestText(phrase)}
              >
                "{phrase}"
              </div>
            ))}
          </div>
        </div>

        {/* Twilio Setup */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">📱 Want to Text Instead?</h2>
          <p className="text-gray-400 mb-4">Set up Twilio to text events to a phone number:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Create a Twilio account at <a href="https://twilio.com" target="_blank" className="text-blue-400 underline">twilio.com</a></li>
            <li>Buy a phone number (~$1/month)</li>
            <li>Go to Phone Numbers → Configure</li>
            <li>Set webhook URL to: <code className="bg-gray-700 px-2 py-0.5 rounded text-sm">{baseUrl}/api/events/sms</code></li>
            <li>Text "Mason practice Saturday 8am" to your number!</li>
          </ol>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/demo/tv" className="text-blue-400 hover:underline">← Back to Command Center</a>
        </div>
      </div>
    </div>
  )
}
