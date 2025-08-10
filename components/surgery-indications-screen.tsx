"use client"

import { useState } from "react"
import { CheckCircle, ArrowLeft, Info } from "lucide-react"

interface SurgeryIndicationsScreenProps {
  onComplete: (hasIndication: boolean, answers: Array<{ question: string; answer: boolean }>) => void
}

const surgeryIndications = [
  {
    question: "Hematúria recorrente",
    tip: "Verificar a presença de hemácias no **Sumário de Urina**.",
  },
  {
    question: "Infecções urinárias de repetição",
    tip: "Verificar sinais de infecção no **Sumário de Urina**.",
  },
  {
    question: "Divertículos de bexiga e infecção urinária",
    tip: "Divertículos podem ser visualizados no **Ultrassom**. A infecção pode ser confirmada no **Sumário de Urina**.",
  },
  {
    question: "Cálculos vesicais",
    tip: "Verificar a presença de cálculos no **Ultrassom**.",
  },
  {
    question: "Retenção urinária e uso de sonda",
    tip: "Esta é uma informação da história clínica. O **Ultrassom** pode auxiliar mostrando um volume residual pós-miccional elevado.",
  },
  {
    question: "Hidronefrose e alteração da função renal",
    tip: "Hidronefrose é vista no **Ultrassom**. A função renal é avaliada pelos exames de **Ureia e Creatinina**.",
  },
]

export default function SurgeryIndicationsScreen({ onComplete }: SurgeryIndicationsScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(surgeryIndications.length).fill(null))

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)

    // Criar array de respostas para o relatório
    const answersForReport = newAnswers
      .map((ans, index) => ({
        question: surgeryIndications[index].question,
        answer: ans,
      }))
      .filter((item) => item.answer !== null)

    // Se respondeu SIM para qualquer indicação, encaminhar imediatamente
    if (answer) {
      onComplete(true, answersForReport)
      return
    }

    // Se ainda há perguntas, vai para a próxima
    if (currentQuestion < surgeryIndications.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      // Se chegou ao final e todas as respostas foram NÃO
      onComplete(false, answersForReport)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / surgeryIndications.length) * 100
  const currentItem = surgeryIndications[currentQuestion]

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentQuestion + 1} de {surgeryIndications.length}
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">O paciente apresenta:</h2>

          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
            <p className="text-gray-800 font-medium text-center text-lg">{currentItem.question}?</p>
          </div>

          {/* Informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Informativo:</p>
                <p
                  className="text-sm text-blue-700"
                  dangerouslySetInnerHTML={{
                    __html: currentItem.tip.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleAnswer(true)}
              className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              SIM
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="w-full bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              NÃO
            </button>
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

        {/* Previous Answers Summary */}
        {answers.some((answer) => answer !== null) && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Respostas anteriores:
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {answers.map((answer, index) => {
                if (answer === null) return null
                return (
                  <div key={index} className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-700 flex-1 pr-2">{surgeryIndications[index].question}</span>
                    <span
                      className={`font-semibold px-2 py-1 rounded-full text-xs ${
                        answer ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {answer ? "SIM" : "NÃO"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
