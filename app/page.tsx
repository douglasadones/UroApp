"use client"

import { useState, useCallback, useEffect } from "react"
import { ArrowLeft, Share, Wifi, WifiOff } from "lucide-react"
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
  const [isOnline, setIsOnline] = useState(true)
  const [patientData, setPatientData] = useState({
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

  // Initialize offline storage and network status
  useEffect(() => {
    // Initialize storage
    offlineStorage.init().catch(console.error)

    // Network status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Initial status
    updateOnlineStatus()

    // Register for background sync when coming back online
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        window.addEventListener("online", () => {
          registration.sync.register("email-report").catch(console.error)
        })
      })
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
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
    <div className="min-h-screen min-h-[100dvh] bg-gray-50 select-none">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={goBack}
          className="flex items-center p-2 -ml-2 touch-manipulation"
          aria-label="Voltar"
          disabled={currentScreen === "welcome" || screenHistory.length === 0}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">{getScreenTitle()}</h1>
        <div className="flex items-center space-x-2">
          {/* Indicador de status de rede */}
          <div className={`p-1 rounded ${isOnline ? "text-white" : "text-red-200"}`}>
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <button className="p-2 -mr-2 touch-manipulation" aria-label="Compartilhar">
            <Share className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 text-sm font-medium">
          📱 Modo Offline - Dados serão sincronizados quando voltar online
        </div>
      )}

      {/* Screen Content */}
      <main className="flex-1 pb-safe">
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
                navigateTo("guidance")
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
            onComplete={() => navigateTo("exams")}
          />
        )}

        {currentScreen === "exams" && (
          <ExamsScreen
            patientData={patientData}
            onUpdatePatientData={updatePatientData}
            onComplete={() => {
              const age = Number(patientData.age)
              const psa = Number(patientData.psa)
              const psaAlert = (age < 60 && psa > 2.5) || (age >= 60 && psa > 4.0)

              if (psaAlert) {
                updatePatientData({ psaAlertTriggered: true })
              }
              navigateTo("guidance")
            }}
          />
        )}

        {currentScreen === "guidance" && (
          <GuidanceScreen
            patientData={patientData}
            onFinish={() => navigateTo("email-report")}
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
