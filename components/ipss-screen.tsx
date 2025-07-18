"use client"

import { useCallback, useMemo } from "react"
import { ipssQuestions, ipssOptions } from "@/lib/data"

interface IpssScreenProps {
  patientData: {
    ipssAnswers: { [key: string]: number }
  }
  onUpdatePatientData: (newData: { ipssAnswers?: { [key: string]: number }; ipssScore?: number }) => void
  onComplete: () => void
}

export default function IpssScreen({ patientData, onUpdatePatientData, onComplete }: IpssScreenProps) {
  const handleAnswerChange = useCallback(
    (questionId: string, value: number) => {
      onUpdatePatientData({
        ipssAnswers: {
          ...patientData.ipssAnswers,
          [questionId]: value,
        },
      })
    },
    [patientData.ipssAnswers, onUpdatePatientData],
  )

  const calculateIpssScore = useMemo(() => {
    return Object.values(patientData.ipssAnswers).reduce((sum, score) => sum + score, 0)
  }, [patientData.ipssAnswers])

  const handleSubmit = useCallback(() => {
    onUpdatePatientData({ ipssScore: calculateIpssScore })
    onComplete()
  }, [calculateIpssScore, onComplete, onUpdatePatientData])

  return (
    <div className="space-y-6">
      {ipssQuestions.map((q) => (
        <div key={q.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{q.category}</h3>
          <p className="text-gray-700 mb-6">{q.text}</p>

          <div className="space-y-4">
            {ipssOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <span className="text-gray-700">{option.label}</span>
                <input
                  type="radio"
                  name={`ipss-q-${q.id}`}
                  value={option.value}
                  checked={patientData.ipssAnswers[q.id] === option.value}
                  onChange={() => handleAnswerChange(q.id, option.value)}
                  className="w-5 h-5 text-orange-500"
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors mt-6"
      >
        Continuar
      </button>
    </div>
  )
}
