"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export function PhoneVerification({
  currentPhone,
  isVerified,
  userId,
}: {
  currentPhone: string | null
  isVerified: boolean
  userId: string
}) {
  const [phone, setPhone] = useState(currentPhone || "")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"phone" | "code">(currentPhone && !isVerified ? "code" : "phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSendCode = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/notifications/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send code")
      }

      setSuccess("Verification code sent! Check your phone.")
      setStep("code")
    } catch (err: any) {
      setError(err.message || "Failed to send verification code")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/notifications/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, phone }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to verify code")
      }

      setSuccess("Phone verified successfully!")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Failed to verify code")
    } finally {
      setLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Phone number verified: <strong>{currentPhone}</strong>
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => setStep("phone")}>
          Change Phone Number
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {step === "phone" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSendCode} disabled={loading || !phone}>
                {loading ? "Sending..." : "Send Code"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Include country code (e.g., +1 for US)</p>
          </div>
        </>
      )}

      {step === "code" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="flex-1"
              />
              <Button onClick={handleVerifyCode} disabled={loading || code.length !== 6}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep("phone")}>
            Change Phone Number
          </Button>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
