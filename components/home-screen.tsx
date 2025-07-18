"use client"

import { Scissors, FileText, ClipboardList } from "lucide-react"

interface HomeScreenProps {
  onNavigateToSurgery: () => void
  onNavigateToExams: () => void
  onNavigateToIpss: () => void
}

export default function HomeScreen({ onNavigateToSurgery, onNavigateToExams, onNavigateToIpss }: HomeScreenProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onNavigateToSurgery}
        className="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <Scissors className="w-6 h-6 text-orange-500 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">Indicações de cirurgia</h3>
            <p className="text-sm text-gray-600">Avalie indicações cirúrgicas</p>
          </div>
        </div>
      </button>

      <button
        onClick={onNavigateToExams}
        className="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-orange-500 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">Exames</h3>
            <p className="text-sm text-gray-600">Registre dados dos exames</p>
          </div>
        </div>
      </button>

      <button
        onClick={onNavigateToIpss}
        className="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <ClipboardList className="w-6 h-6 text-orange-500 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">IPSS</h3>
            <p className="text-sm text-gray-600">Questionário de sintomas prostáticos</p>
          </div>
        </div>
      </button>
    </div>
  )
}
