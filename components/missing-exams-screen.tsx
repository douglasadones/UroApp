"use client"

interface MissingExamsScreenProps {
  onGoBack: () => void
}

export default function MissingExamsScreen({ onGoBack }: MissingExamsScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Exames Necessários</h2>
        <p className="text-gray-700 mb-6">
          Por favor, solicite que o paciente retorne com todos os exames e dados listados na tela anterior para
          prosseguir com a avaliação.
        </p>
        <button
          onClick={onGoBack}
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
        >
          Voltar para a tela inicial
        </button>
      </div>
    </div>
  )
}
