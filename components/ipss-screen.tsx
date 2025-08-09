"use client"

import { useCallback, useMemo, useState } from "react"
import { ipssQuestions, ipssOptions, nocturiaOptions } from "@/lib/data"
import { CheckCircle, ArrowLeft } from "lucide-react"

interface IpssScreenProps {
  patientData: {
    ipssAnswers: { [key: string]: number }
  }
  onUpdatePatientData: (newData: { ipssAnswers?: { [key: string]: number }; ipssScore?: number }) => void
  onComplete: () => void
}

export default function IpssScreen({ patientData, onUpdatePatientData, onComplete }: IpssScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleAnswerChange = useCallback(
    (questionId: string, value: number) => {
      const newAnswers = {
        ...patientData.ipssAnswers,
        [questionId]: value,
      }

      onUpdatePatientData({
        ipssAnswers: newAnswers,
      })

      // Se não é a última pergunta, vai para a próxima
      if (currentQuestion < ipssQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
        }, 300) // Pequeno delay para feedback visual
      }
    },
    [patientData.ipssAnswers, onUpdatePatientData, currentQuestion],
  )

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateIpssScore = useMemo(() => {
    return Object.values(patientData.ipssAnswers).reduce((sum, score) => sum + score, 0)
  }, [patientData.ipssAnswers])

  const handleSubmit = useCallback(() => {
    onUpdatePatientData({ ipssScore: calculateIpssScore })
    onComplete()
  }, [calculateIpssScore, onComplete, onUpdatePatientData])

  const progress = ((currentQuestion + 1) / ipssQuestions.length) * 100
  const currentQ = ipssQuestions[currentQuestion]
  const answeredQuestions = Object.keys(patientData.ipssAnswers).length
  const canProceed = answeredQuestions === ipssQuestions.length

  // Usar opções específicas para a pergunta de noctúria (q7)
  const optionsToUse = currentQ.id === "q7" ? nocturiaOptions : ipssOptions

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentQuestion + 1} de {ipssQuestions.length}
            </span>
            <span className="text-sm font-medium text-orange-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
              {currentQ.category}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-6">{currentQ.text}</h2>

          <div className="space-y-3">
            {optionsToUse.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerChange(currentQ.id, option.value)}
                className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  patientData.ipssAnswers[currentQ.id] === option.value
                    ? "border-orange-500 bg-orange-50 text-orange-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      patientData.ipssAnswers[currentQ.id] === option.value
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {patientData.ipssAnswers[currentQ.id] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Botão Voltar */}
          {currentQuestion > 0 && (
            <button
              onClick={goToPreviousQuestion}
              className="w-full mt-4 bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Pergunta anterior
            </button>
          )}
        </div>

        {/* Continue Button - Only show when all questions are answered */}
        {canProceed && (
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-4"
          >
            Continuar
          </button>
        )}

        {/* Previous Answers Summary - Sem mostrar a pontuação */}
        {answeredQuestions > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Progresso: {answeredQuestions}/{ipssQuestions.length} respostas
            </h4>
          </div>
        )}
      </div>
    </div>
  )
}
