"use client"

import { useState, useCallback, useEffect } from "react"
import { ArrowLeft, Share } from "lucide-react"
import WelcomeScreen from "@/components/welcome-screen"
import MissingExamsScreen from "@/components/missing-exams-screen"
import SurgeryIndicationsScreen from "@/components/surgery-indications-screen"
import ExamsScreen from "@/components/exams-screen"
import IpssScreen from "@/components/ipss-screen"
import GuidanceScreen from "@/components/guidance-screen"
import EmailReportScreen from "@/components/email-report-screen"
import { offlineStorage } from "@/lib/storage"

export default function HPBApp() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [screenHistory, setScreenHistory] = useState([])
  const [patientData, setPatientData] = useState({
    age: "",
    ipssScore: 0,
    psa: "",
    prostateVolume: "",
    ipssAnswers: {},
    surgeryAnswers: [], // Para armazenar as respostas das indicações de cirurgia
    hasSurgeryIndication: null, // true/false/null
    hasErectileDysfunction: false,
    hasImprovedSymptoms: false,
    psaAlertTriggered: false, // Para o alerta de câncer de próstata
  })

  // Initialize offline storage
  useEffect(() => {
    offlineStorage.init().catch(console.error)
  }, [])

  const getScreenTitle = useCallback(() => {
    const titles = {
      welcome: "Bem vindo ao UroHPB",
      "missing-exams": "Exames Necessários",
      "surgery-indications": "Indicações de cirurgia",
      exams: "Exames",
      ipss: "IPSS",
      guidance: "Orientação",
      "email-report": "Enviar Relatório",
    }
    return titles[currentScreen] || "HPB Assistant"
  }, [currentScreen])

  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1]
      setScreenHistory((prev) => prev.slice(0, -1))
      setCurrentScreen(previousScreen)
    } else {
      if (currentScreen !== "welcome") {
        setCurrentScreen("welcome")
      }
    }
  }, [screenHistory, currentScreen])

  const navigateTo = useCallback(
    (screen: string) => {
      setScreenHistory((prev) => [...prev, currentScreen])
      setCurrentScreen(screen)
    },
    [currentScreen],
  )

  const updatePatientData = useCallback((newData: Partial<typeof patientData>) => {
    setPatientData((prev) => ({ ...prev, ...newData }))
  }, [])

  const resetPatientData = useCallback(() => {
    setPatientData({
      age: "",
      ipssScore: 0,
      psa: "",
      prostateVolume: "",
      ipssAnswers: {},
      surgeryAnswers: [],
      hasSurgeryIndication: null,
      hasErectileDysfunction: false,
      hasImprovedSymptoms: false,
      psaAlertTriggered: false,
    })
    setScreenHistory([])
    setCurrentScreen("welcome")
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center p-2 -ml-2"
          aria-label="Voltar"
          disabled={currentScreen === "welcome" || screenHistory.length === 0}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">{getScreenTitle()}</h1>
        <button className="p-2 -mr-2" aria-label="Compartilhar">
          <Share className="w-6 h-6" />
        </button>
      </header>

      {/* Screen Content */}
      <main className="flex-1">
        {currentScreen === "welcome" && (
          <WelcomeScreen
            onStartDiagnostic={() => navigateTo("surgery-indications")}
            onMissingExams={() => navigateTo("missing-exams")}
          />
        )}

        {currentScreen === "missing-exams" && <MissingExamsScreen onGoBack={() => navigateTo("welcome")} />}

        {currentScreen === "surgery-indications" && (
          <SurgeryIndicationsScreen
            onComplete={(hasIndication, answers) => {
              updatePatientData({
                hasSurgeryIndication: hasIndication,
                surgeryAnswers: answers,
              })
              if (hasIndication) {
                navigateTo("guidance") // Encaminhar direto se houver indicação cirúrgica
              } else {
                navigateTo("ipss") // Vai direto para IPSS se não houver indicação
              }
            }}
          />
        )}

        {currentScreen === "ipss" && (
          <IpssScreen
            patientData={patientData}
            onUpdatePatientData={updatePatientData}
            onComplete={() => navigateTo("exams")} // Após IPSS vai para Exames
          />
        )}

        {currentScreen === "exams" && (
          <ExamsScreen
            patientData={patientData}
            onUpdatePatientData={updatePatientData}
            onComplete={() => {
              // Lógica do alerta de câncer de próstata do fluxograma 2
              const age = Number(patientData.age)
              const psa = Number(patientData.psa)
              const psaAlert = (age < 60 && psa > 2.5) || (age >= 60 && psa > 4.0)

              if (psaAlert) {
                updatePatientData({ psaAlertTriggered: true })
              }
              navigateTo("guidance") // Sempre vai para guidance após exames
            }}
          />
        )}

        {currentScreen === "guidance" && (
          <GuidanceScreen
            patientData={patientData}
            onFinish={() => navigateTo("email-report")} // Vai para tela de e-mail em vez de resetar
            onUpdatePatientData={updatePatientData}
          />
        )}

        {currentScreen === "email-report" && (
          <EmailReportScreen patientData={patientData} onFinish={resetPatientData} />
        )}
      </main>
    </div>
  )
}
