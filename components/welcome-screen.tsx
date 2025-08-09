"use client"

import { AlertTriangle } from "lucide-react"

interface WelcomeScreenProps {
  onStartDiagnostic: () => void
  onMissingExams: () => void
}

export default function WelcomeScreen({ onStartDiagnostic, onMissingExams }: WelcomeScreenProps) {
  const handleStart = (hasExams: boolean) => {
    if (hasExams) {
      onStartDiagnostic()
    } else {
      onMissingExams()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem vindo ao UroHPB</h2>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-semibold text-orange-700">Atenção</span>
          </div>
          <p className="text-gray-700 text-sm mb-3">Certifique-se que você tem em mãos os seguintes dados:</p>
          <ul className="list-disc list-inside text-left text-gray-600 text-sm space-y-1">
            <li>Ultrassom de próstata;</li>
            <li>PSA total;</li>
            <li>Sumário de urina;</li>
            <li>Ureia, creatinina;</li>
            <li>Idade do paciente.</li>
          </ul>
        </div>

        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <span className="text-5xl">🩺</span>
        </div>

        <p className="text-gray-700 mb-6">Você tem todos esses exames e dados em mãos?</p>
        <div className="space-y-3">
          <button
            onClick={() => handleStart(true)}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            SIM
          </button>
          <button
            onClick={() => handleStart(false)}
            className="w-full bg-gray-300 text-gray-800 py-3 px-6 rounded-full font-semibold hover:bg-gray-400 transition-colors"
          >
            NÃO
          </button>
        </div>
      </div>
    </div>
  )
}
