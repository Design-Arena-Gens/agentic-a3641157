import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { recipient, purpose, details } = await request.json()

    // Simulate AI agent processing the call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a simulated call transcript
    const transcript = generateTranscript(recipient, purpose, details)
    const result = generateResult(purpose)

    return NextResponse.json({
      success: true,
      transcript,
      result,
      message: 'Call completed successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process call' },
      { status: 500 }
    )
  }
}

function generateTranscript(recipient: string, purpose: string, details: string): string {
  return `[AI Agent]: Hello, this is an automated call on behalf of my client.

[${recipient}]: Hello, how can I help you?

[AI Agent]: I'm calling regarding: ${purpose}

[AI Agent]: Here are the details: ${details}

[${recipient}]: I understand. Let me help you with that.

[AI Agent]: Thank you for your assistance.

[${recipient}]: Is there anything else I can help with?

[AI Agent]: No, that covers everything. Thank you for your time.

[${recipient}]: You're welcome. Have a great day!

[AI Agent]: You too. Goodbye.

Call Duration: 2 minutes 34 seconds
Status: Completed Successfully`
}

function generateResult(purpose: string): string {
  const results = [
    `✅ Successfully completed: ${purpose}`,
    `✅ Request processed. ${purpose} has been scheduled.`,
    `✅ Confirmed. Your request for "${purpose}" has been handled.`,
    `✅ All set! ${purpose} completed without issues.`
  ]

  return results[Math.floor(Math.random() * results.length)]
}
