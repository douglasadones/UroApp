"use client"

import ExamsScreen from "@/components/exams-screen"
import GuidanceScreen from "@/components/guidance-screen"
import HomeScreen from "@/components/home-screen"; // Novo componente para a tela principal de navegação
import IpssScreen from "@/components/ipss-screen"
import MissingExamsScreen from "@/components/missing-exams-screen"
import SurgeryIndicationsScreen from "@/components/surgery-indications-screen"
import WelcomeScreen from "@/components/welcome-screen"
import { ArrowLeft, Share } from "lucide-react"
import { useCallback, useState } from "react"

export default function HPBApp() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [screenHistory, setScreenHistory] = useState([])
  const [patientData, setPatientData] = useState({
    age: "",
    ipssScore: 0,
    psa: "",
    prostateVolume: "",
    ipssAnswers: {},
    hasSurgeryIndication: null, // true/false/null
    hasErectileDysfunction: false,
    hasImprovedSymptoms: false,
    psaAlertTriggered: false, // Para o alerta de câncer de próstata
  })

  const getScreenTitle = useCallback(() => {
    const titles = {
      welcome: "Bem vindo ao UroHPB",
      "missing-exams": "Exames Necessários",
      home: "HPB Assistant",
      "surgery-indications": "Indicações de cirurgia",
      exams: "Exames",
      ipss: "IPSS",
      guidance: "Orientação",
    }
    return titles[currentScreen] || "HPB Assistant"
  }, [currentScreen])

  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1]
      setScreenHistory((prev) => prev.slice(0, -1))
      setCurrentScreen(previousScreen)
    } else {
      // Se não há histórico, e não estamos na tela de boas-vindas, volta para a home
      if (currentScreen !== "welcome") {
        setCurrentScreen("home")
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
      hasSurgeryIndication: null,
      hasErectileDysfunction: false,
      hasImprovedSymptoms: false,
      psaAlertTriggered: false,
    })
    setScreenHistory([])
    setCurrentScreen("welcome") // Volta para a tela de boas-vindas no reset
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center p-2 -ml-2"
          aria-label="Voltar"
          disabled={currentScreen === "welcome" || (currentScreen === "home" && screenHistory.length === 0)}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">{getScreenTitle()}</h1>
        <button className="p-2 -mr-2" aria-label="Compartilhar">
          <Share className="w-6 h-6" />
        </button>
      </header>

      {/* Screen Content */}
      <main className="p-4">
        {currentScreen === "welcome" && (
          <WelcomeScreen
            onStartDiagnostic={() => navigateTo("home")}
            onMissingExams={() => navigateTo("missing-exams")}
          />
        )}

        {currentScreen === "missing-exams" && <MissingExamsScreen onGoBack={() => navigateTo("welcome")} />}

        {currentScreen === "home" && (
          <HomeScreen
            onNavigateToObjectives={() => navigateTo("objectives")}
            onNavigateToSurgery={() => navigateTo("surgery-indications")}
            onNavigateToExams={() => navigateTo("exams")}
            onNavigateToIpss={() => navigateTo("ipss")}
          />
        )}

        {currentScreen === "surgery-indications" && (
          <SurgeryIndicationsScreen
            onComplete={(hasIndication) => {
              updatePatientData({ hasSurgeryIndication: hasIndication })
              if (hasIndication) {
                navigateTo("guidance") // Encaminhar direto se houver indicação cirúrgica
              } else {
                navigateTo("exams")
              }
            }}
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
                navigateTo("guidance") // Encaminhar direto se houver alerta de PSA
              } else {
                navigateTo("ipss")
              }
            }}
          />
        )}

        {currentScreen === "ipss" && (
          <IpssScreen
            patientData={patientData}
            onUpdatePatientData={updatePatientData}
            onComplete={() => navigateTo("guidance")}
          />
        )}

        {currentScreen === "guidance" && (
          <GuidanceScreen
            patientData={patientData}
            onFinish={resetPatientData}
            onUpdatePatientData={updatePatientData}
          />
        )}
      </main>
    </div>
  )
}
