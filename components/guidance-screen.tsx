"use client"

import { AlertTriangle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface GuidanceScreenProps {
  patientData: {
    ipssScore: number
    psa: string
    prostateVolume: string
    hasSurgeryIndication: boolean | null
    hasErectileDysfunction: boolean
    hasImprovedSymptoms: boolean
    psaAlertTriggered: boolean
  }
  onFinish: () => void
  onUpdatePatientData: (newData: Partial<GuidanceScreenProps["patientData"]>) => void
}

export default function GuidanceScreen({ patientData, onFinish, onUpdatePatientData }: GuidanceScreenProps) {
  const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false)
  const [currentFollowUpStep, setCurrentFollowUpStep] = useState(0) // 0: none, 1: erectile dysfunction, 2: symptom improvement

  const getGuidanceType = () => {
    // Prioridade 1: Encaminhamentos imediatos (Fluxograma 2)
    if (patientData.hasSurgeryIndication) return "referral-surgery"
    if (patientData.psaAlertTriggered) return "referral-psa-alert"

    // Prioridade 2: Conduta Final (Fluxograma 3)
    const ipss = patientData.ipssScore
    const prostateVolume = Number(patientData.prostateVolume)
    const psa = Number(patientData.psa)

    if (ipss < 8) return "mild-symptoms" // Sintomas leves
    if (ipss >= 8 && prostateVolume < 40) return "alpha-blocker" // Tratamento com alfa-bloqueador
    if (ipss >= 8 && prostateVolume > 40 && psa > 1.4) return "alpha-blocker-5ar" // Tratamento com associação de alfa-bloqueador e inibidor da 5 alfa-redutase

    // Prioridade 3: Retorno Após Medicações (Fluxograma 4) - Estas são perguntas de acompanhamento
    // A lógica para estas perguntas será gerenciada pelo estado `showFollowUpQuestions`
    // e `currentFollowUpStep` dentro deste componente.
    // Se chegamos aqui e não há um encaminhamento imediato, e o IPSS é >= 8,
    // então o paciente está no caminho de "Retorno Após Medicações"
    if (ipss >= 8 && showFollowUpQuestions) {
      if (patientData.hasImprovedSymptoms) return "antimuscarinic"
      if (patientData.hasErectileDysfunction) return "inhibitor-5pde"
      // Se nenhuma das condições de melhora/disfunção for atendida após as perguntas
      return "referral-no-improvement"
    }

    return "default-referral" // Fallback para qualquer caso não coberto
  }

  const guidanceType = getGuidanceType()

  useEffect(() => {
    // Se a conduta inicial é de medicação (IPSS >= 8), prepare para as perguntas de acompanhamento
    if (
      (guidanceType === "alpha-blocker" || guidanceType === "alpha-blocker-5ar") &&
      !showFollowUpQuestions &&
      currentFollowUpStep === 0
    ) {
      setShowFollowUpQuestions(true)
      setCurrentFollowUpStep(1) // Inicia com a pergunta de disfunção erétil
    } else if (
      guidanceType === "antimuscarinic" ||
      guidanceType === "inhibitor-5pde" ||
      guidanceType === "referral-no-improvement" ||
      guidanceType === "mild-symptoms" ||
      guidanceType === "referral-surgery" ||
      guidanceType === "referral-psa-alert"
    ) {
      // Se a orientação final já foi determinada, não mostre as perguntas de acompanhamento
      setShowFollowUpQuestions(false)
      setCurrentFollowUpStep(0)
    }
  }, [guidanceType, showFollowUpQuestions, currentFollowUpStep])

  const handleErectileDysfunctionAnswer = (answer: boolean) => {
    onUpdatePatientData({ hasErectileDysfunction: answer })
    setCurrentFollowUpStep(2) // Próxima pergunta: melhora dos sintomas
  }

  const handleSymptomImprovementAnswer = (answer: boolean) => {
    onUpdatePatientData({ hasImprovedSymptoms: answer })
    setCurrentFollowUpStep(0) // Finaliza as perguntas de acompanhamento
    setShowFollowUpQuestions(false)
  }

  const renderGuidanceContent = () => {
    switch (guidanceType) {
      case "referral-surgery":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-semibold text-red-700">Atenção!</span>
            </div>
            <p className="text-red-700 text-center">
              Paciente com indicação absoluta de cirurgia.
              <br />
              Encaminhar ao urologista.
            </p>
          </div>
        )
      case "referral-psa-alert":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-semibold text-red-700">ALERTA PARA CÂNCER DE PRÓSTATA!</span>
            </div>
            <p className="text-red-700 text-center">Encaminhar ao urologista.</p>
          </div>
        )
      case "mild-symptoms":
        return (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-semibold text-green-700">Atenção!</span>
              </div>
              <p className="text-green-700 text-center font-semibold">Paciente com sintomas leves.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Oriente o paciente a:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="p-3 bg-gray-50 rounded-lg">Reduzir ingesta hídrica à noite</li>
                <li className="p-3 bg-gray-50 rounded-lg">
                  Diminuir ingesta de alimentos como café, álcool e refrigerantes.
                </li>
                <li className="p-3 bg-gray-50 rounded-lg">Evitar tabagismo.</li>
                <li className="p-3 bg-gray-50 rounded-lg">
                  Realizar ordenha uretral para pacientes com gotejamento pós-miccional.
                </li>
                <li className="p-3 bg-gray-50 rounded-lg">
                  Evitar, desde que seja possível, medicações como: diuréticos, antidepressivos, alfa-agonistas
                </li>
              </ul>
            </div>
          </>
        )
      case "alpha-blocker":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Conduta</h3>
              <p className="text-gray-700 mb-4">Prescreva um alfa-bloqueador.</p>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Doxazosina 2mg</h4>
                  <p className="text-sm text-gray-600 mb-3">1 comprimido à noite antes de dormir.</p>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Contraindicações
                    </span>
                  </div>
                </div>

                <div className="text-center text-gray-500 font-semibold">ou</div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Tansulosina 0,4 mg</h4>
                  <p className="text-sm text-gray-600 mb-3">1 comprimido à noite antes de dormir.</p>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Contraindicações
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "alpha-blocker-5ar":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Conduta</h3>
              <p className="text-gray-700 mb-4">
                Tratamento com associação de alfa-bloqueador e inibidor da 5 alfa-redutase.
              </p>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Doxazosina 2mg + Finasterida 5mg</h4>
                  <p className="text-sm text-gray-600 mb-3">1 comprimido de cada à noite antes de dormir.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Contraindicações Doxazosina
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Contraindicações Finasterida
                    </span>
                  </div>
                </div>

                <div className="text-center text-gray-500 font-semibold">ou</div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Tansulosina 0,4 mg + Dutasterida 0,5mg</h4>
                  <p className="text-sm text-gray-600 mb-3">1 comprimido de cada à noite antes de dormir.</p>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Contraindicações Tansulosina
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "antimuscarinic":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orientação</h3>
            <p className="text-gray-700 mb-4">
              Melhora dos sintomas de esvaziamento e pouca melhora dos sintomas de armazenamento.
            </p>
            <p className="text-gray-700 font-semibold">Orienta associar um antimuscarínico.</p>
          </div>
        )
      case "inhibitor-5pde":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orientação</h3>
            <p className="text-gray-700 mb-4">Paciente com disfunção erétil importante.</p>
            <p className="text-gray-700 font-semibold">Orienta associar um inibidor da 5-fosfodiesterase.</p>
          </div>
        )
      case "referral-no-improvement":
      case "default-referral": // Fallback para encaminhamento
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-semibold text-red-700">Atenção!</span>
              </div>
              <p className="text-red-700 text-center">
                Caso Paciente não tenha tido melhora satisfatória com as medicações, encaminhar ao urologista.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 mb-4">
                Caso o paciente não tenha melhora importante dos sintomas de armazenamento (noctúria, urgência e
                frequência aumentada), considerar associação com anticolinérgico (observar contraindicações).
              </p>
              <p className="text-gray-700 mb-4">
                Caso o paciente tenha sintomas de disfunção erétil, considerar uso de tadalafila 5mg diário (observar
                contraindicações).
              </p>
              <p className="text-gray-700">Em caso de dúvidas, encaminhar ao urologista.</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
            <p>Nenhuma orientação específica no momento. Por favor, preencha todos os dados.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderGuidanceContent()}

      {/* Perguntas de acompanhamento do Fluxograma 4 */}
      {showFollowUpQuestions && currentFollowUpStep === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">O paciente apresenta disfunção erétil importante?</p>
          <div className="flex justify-around space-x-4">
            <button
              onClick={() => handleErectileDysfunctionAnswer(true)}
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              SIM
            </button>
            <button
              onClick={() => handleErectileDysfunctionAnswer(false)}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-full font-semibold hover:bg-gray-400 transition-colors"
            >
              NÃO
            </button>
          </div>
        </div>
      )}

      {showFollowUpQuestions && currentFollowUpStep === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">
            Houve melhora dos sintomas de esvaziamento e pouca melhora dos sintomas de armazenamento?
          </p>
          <div className="flex justify-around space-x-4">
            <button
              onClick={() => handleSymptomImprovementAnswer(true)}
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              SIM
            </button>
            <button
              onClick={() => handleSymptomImprovementAnswer(false)}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-full font-semibold hover:bg-gray-400 transition-colors"
            >
              NÃO
            </button>
          </div>
        </div>
      )}

      {/* Botão Finalizar, visível apenas quando não há mais perguntas de acompanhamento */}
      {!showFollowUpQuestions && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orientação</h3>
          <p className="text-gray-700 mb-6">Encaminhar paciente ao urologista...</p>

          <button
            onClick={onFinish}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            FINALIZAR
          </button>
        </div>
      )}
    </div>
  )
}
