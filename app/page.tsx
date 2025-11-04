'use client'

import { useState } from 'react'

interface CallRequest {
  recipient: string
  purpose: string
  details: string
}

interface CallHistory {
  id: string
  recipient: string
  purpose: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  transcript?: string
  timestamp: Date
  result?: string
}

export default function Home() {
  const [formData, setFormData] = useState<CallRequest>({
    recipient: '',
    purpose: '',
    details: ''
  })
  const [callHistory, setCallHistory] = useState<CallHistory[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCall, setSelectedCall] = useState<CallHistory | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const newCall: CallHistory = {
      id: Date.now().toString(),
      recipient: formData.recipient,
      purpose: formData.purpose,
      status: 'pending',
      timestamp: new Date()
    }

    setCallHistory(prev => [newCall, ...prev])

    try {
      const response = await fetch('/api/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      setCallHistory(prev => prev.map(call =>
        call.id === newCall.id
          ? {
              ...call,
              status: data.success ? 'completed' : 'failed',
              transcript: data.transcript,
              result: data.result
            }
          : call
      ))
    } catch (error) {
      setCallHistory(prev => prev.map(call =>
        call.id === newCall.id
          ? { ...call, status: 'failed' }
          : call
      ))
    }

    setIsProcessing(false)
    setFormData({ recipient: '', purpose: '', details: '' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">📞 Call Agent</h1>
          <p className="text-xl text-gray-700">Your AI assistant that makes calls for you</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Call Request Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a Call</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Who should I call?
                </label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  placeholder="e.g., Doctor's office, Bank, Restaurant"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What's the purpose?
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  placeholder="e.g., Make appointment, Check balance, Book table"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional details
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  placeholder="Any specific information I should mention during the call..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {isProcessing ? '🔄 Processing...' : '📞 Make Call'}
              </button>
            </form>
          </div>

          {/* Call History */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Call History</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {callHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No calls yet</p>
                  <p className="text-sm">Request a call to get started</p>
                </div>
              ) : (
                callHistory.map(call => (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-400 cursor-pointer transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{call.recipient}</h3>
                        <p className="text-sm text-gray-600">{call.purpose}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        call.status === 'completed' ? 'bg-green-100 text-green-800' :
                        call.status === 'failed' ? 'bg-red-100 text-red-800' :
                        call.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {call.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Call Details Modal */}
        {selectedCall && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCall(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Call Details</h2>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Recipient</p>
                  <p className="text-lg text-gray-800">{selectedCall.recipient}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Purpose</p>
                  <p className="text-lg text-gray-800">{selectedCall.purpose}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedCall.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedCall.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCall.status}
                  </span>
                </div>

                {selectedCall.result && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Result</p>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <p className="text-gray-800">{selectedCall.result}</p>
                    </div>
                  </div>
                )}

                {selectedCall.transcript && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Call Transcript</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">{selectedCall.transcript}</pre>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-600">Time</p>
                  <p className="text-gray-800">{selectedCall.timestamp.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
