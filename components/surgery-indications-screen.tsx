"use client"

interface SurgeryIndicationsScreenProps {
  onComplete: (hasIndication: boolean) => void
}

export default function SurgeryIndicationsScreen({ onComplete }: SurgeryIndicationsScreenProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Indicações absolutas de cirurgia</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Hematúria recorrente;
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Infecções urinárias de repetição;
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Divertículos de bexiga e infecção urinária;
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Cálculos vesicais;
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Retenção urinária e uso de sonda;
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Hidronefrose e alteração da função renal.
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-6">
          Você consegue identificar na história clínica alguma das indicações absolutas de cirurgia?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onComplete(true)}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            SIM
          </button>
          <button
            onClick={() => onComplete(false)}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            NÃO
          </button>
        </div>
      </div>
    </div>
  )
}
