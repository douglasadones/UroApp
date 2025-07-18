"use client"

import type React from "react"
import { AlertTriangle } from "lucide-react"

interface PatientData {
  age: string
  ipssScore: number
  psa: string
  prostateVolume: string
}

interface ExamsScreenProps {
  patientData: PatientData
  onUpdatePatientData: (newData: Partial<PatientData>) => void
  onComplete: () => void
}

export default function ExamsScreen({ patientData, onUpdatePatientData, onComplete }: ExamsScreenProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onUpdatePatientData({ [name]: value })
  }

  // Lógica do alerta de câncer de próstata conforme fluxograma 2
  const age = Number(patientData.age)
  const psa = Number(patientData.psa)
  const psaAlert = (age < 60 && psa > 2.5) || (age >= 60 && psa > 4.0)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informe a idade do paciente</h3>
        <input
          name="age"
          value={patientData.age}
          onChange={handleInputChange}
          type="number"
          placeholder="Digite a idade"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Prostatic Score Symptom</h3>
        <h4 className="text-xl font-bold text-gray-800 mb-4">IPSS</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <span className="text-2xl font-bold">{patientData.ipssScore || "N/A"}</span>
          <p className="text-sm text-gray-600 mt-1">Não é possível editar este valor</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Antígeno Prostático Específico</h3>
        <h4 className="text-xl font-bold text-gray-800 mb-4">Informe o PSA total</h4>
        <input
          name="psa"
          value={patientData.psa}
          onChange={handleInputChange}
          type="number"
          step="0.1"
          placeholder="Digite o PSA"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
        />

        {psaAlert && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-semibold text-red-700">ALERTA PARA CÂNCER DE PRÓSTATA!</span>
            </div>
            <p className="text-red-700 text-center">Encaminhar ao urologista.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Próstata</h3>
        <h4 className="text-xl font-bold text-gray-800 mb-4">Informe o volume da próstata</h4>
        <input
          name="prostateVolume"
          value={patientData.prostateVolume}
          onChange={handleInputChange}
          type="number"
          placeholder="Digite o volume (g)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
      >
        Continuar
      </button>
    </div>
  )
}
