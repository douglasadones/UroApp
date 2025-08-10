"use client"

import { useState } from "react"
import { Mail, Send, FileText, CheckCircle, Wifi, WifiOff } from "lucide-react"
import { ipssQuestions } from "@/lib/data"
import { offlineStorage } from "@/lib/storage"

interface EmailReportScreenProps {
  patientData: any
  onFinish: () => void
}

export default function EmailReportScreen({ patientData, onFinish }: EmailReportScreenProps) {
  const [doctorEmail, setDoctorEmail] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // Listen for online/offline events
  useState(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  })

  const generateReport = () => {
    const surgeryAnswers = patientData.surgeryAnswers || []
    const ipssAnswers = patientData.ipssAnswers || {}

    let report = `
RELATÓRIO DE AVALIAÇÃO HPB
==========================

DADOS DO PACIENTE:
- Idade: ${patientData.age} anos
- PSA: ${patientData.psa} ng/mL
- Volume da Próstata: ${patientData.prostateVolume} g
- Pontuação IPSS: ${patientData.ipssScore}

INDICAÇÕES ABSOLUTAS DE CIRURGIA:
`

    surgeryAnswers.forEach((item: any) => {
      if (item.answer !== null) {
        report += `- ${item.question}: ${item.answer ? "SIM" : "NÃO"}\n`
      }
    })

    report += `\nQUESTIONÁRIO IPSS:\n`

    ipssQuestions.forEach((question) => {
      const answer = ipssAnswers[question.id]
      if (answer !== undefined) {
        report += `- ${question.text}\n  Resposta: ${answer} pontos\n\n`
      }
    })

    report += `\nORIENTAÇÃO MÉDICA:\n`

    if (patientData.hasSurgeryIndication) {
      report += `- Paciente com indicação absoluta de cirurgia. Encaminhar ao urologista.\n`
    } else if (patientData.psaAlertTriggered) {
      report += `- ALERTA PARA CÂNCER DE PRÓSTATA! Encaminhar ao urologista.\n`
    } else {
      const ipss = patientData.ipssScore
      const prostateVolume = Number(patientData.prostateVolume)
      const psa = Number(patientData.psa)

      if (ipss < 8) {
        report += `- Paciente com sintomas leves. Orientações comportamentais.\n`
      } else if (ipss >= 8 && prostateVolume < 40) {
        report += `- Prescrever alfa-bloqueador.\n`
      } else if (ipss >= 8 && prostateVolume > 40 && psa > 1.4) {
        report += `- Tratamento com associação de alfa-bloqueador e inibidor da 5 alfa-redutase.\n`
      }
    }

    return report
  }

  const handleSendEmail = async () => {
    if (!doctorEmail && !patientEmail) {
      alert("Por favor, preencha pelo menos um e-mail.")
      return
    }

    setIsLoading(true)

    try {
      const report = generateReport()

      // Save patient data offline
      await offlineStorage.savePatientData(patientData)

      if (isOffline) {
        // Save email to send later when online
        await offlineStorage.savePendingEmail(doctorEmail, patientEmail, report)
        alert("Você está offline. O e-mail será enviado quando a conexão for restabelecida.")
      } else {
        // Try to send email immediately
        try {
          // Simular envio de e-mail (aqui você integraria com um serviço real)
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // Simulate network failure sometimes
              if (Math.random() > 0.8) {
                reject(new Error("Network error"))
              } else {
                resolve(true)
              }
            }, 2000)
          })

          console.log("Relatório enviado:", report)
          console.log("E-mail do médico:", doctorEmail)
          console.log("E-mail do paciente:", patientEmail)
        } catch (error) {
          // If sending fails, save for later
          await offlineStorage.savePendingEmail(doctorEmail, patientEmail, report)
          alert("Falha no envio. O e-mail será enviado quando a conexão for restabelecida.")
        }
      }

      setEmailSent(true)

      setTimeout(() => {
        onFinish()
      }, 3000)
    } catch (error) {
      alert("Erro ao processar solicitação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    // Save patient data even if skipping email
    await offlineStorage.savePatientData(patientData)
    onFinish()
  }

  if (emailSent) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isOffline ? "Salvo para Envio!" : "E-mail Enviado!"}
          </h2>
          <p className="text-gray-600 mb-6">
            {isOffline
              ? "O relatório será enviado quando você estiver online."
              : "O relatório foi enviado com sucesso para os e-mails informados."}
          </p>
          <p className="text-sm text-gray-500">Redirecionando para o início...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enviar Relatório</h2>
            <p className="text-gray-600 text-sm">Deseja receber o relatório completo da avaliação por e-mail?</p>

            {/* Status de conexão */}
            <div
              className={`flex items-center justify-center mt-3 text-sm ${isOffline ? "text-red-600" : "text-green-600"}`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 mr-1" /> : <Wifi className="w-4 h-4 mr-1" />}
              {isOffline ? "Offline" : "Online"}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Médico (opcional)</label>
              <input
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                placeholder="medico@exemplo.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Paciente (opcional)</label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="paciente@exemplo.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {isOffline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <WifiOff className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800 mb-1">Modo Offline</p>
                  <p className="text-sm text-yellow-700">
                    O e-mail será salvo e enviado automaticamente quando você estiver online.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">O relatório incluirá:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Dados do paciente e exames</li>
                  <li>• Respostas das indicações de cirurgia</li>
                  <li>• Questionário IPSS completo</li>
                  <li>• Orientação médica final</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSendEmail}
              disabled={isLoading || (!doctorEmail && !patientEmail)}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                isLoading || (!doctorEmail && !patientEmail)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isOffline ? "Salvando..." : "Enviando..."}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {isOffline ? "Salvar para Envio" : "Enviar Relatório"}
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Pular e Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
