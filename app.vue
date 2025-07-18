<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-orange-500 text-white p-4 flex items-center justify-between">
      <button 
        v-if="currentScreen !== 'home'" 
        @click="goBack"
        class="flex items-center"
      >
        <ArrowLeft class="w-6 h-6 mr-2" />
      </button>
      <h1 class="text-lg font-semibold flex-1 text-center">
        {{ getScreenTitle() }}
      </h1>
      <button class="p-2">
        <Share class="w-6 h-6" />
      </button>
    </header>

    <!-- Home Screen -->
    <div v-if="currentScreen === 'home'" class="p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">HPB Assistant</h2>
        <p class="text-gray-600">Aplicativo para auxílio no manejo de hiperplasia prostática benigna</p>
      </div>

      <div class="space-y-4">
        <button 
          @click="currentScreen = 'objectives'"
          class="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <Target class="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <h3 class="font-semibold text-gray-800">Objetivos</h3>
              <p class="text-sm text-gray-600">Conheça os objetivos do aplicativo</p>
            </div>
          </div>
        </button>

        <button 
          @click="currentScreen = 'surgery-indications'"
          class="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <Scissors class="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <h3 class="font-semibold text-gray-800">Indicações de cirurgia</h3>
              <p class="text-sm text-gray-600">Avalie indicações cirúrgicas</p>
            </div>
          </div>
        </button>

        <button 
          @click="currentScreen = 'exams'"
          class="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <FileText class="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <h3 class="font-semibold text-gray-800">Exames</h3>
              <p class="text-sm text-gray-600">Registre dados dos exames</p>
            </div>
          </div>
        </button>

        <button 
          @click="currentScreen = 'ipss'"
          class="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <ClipboardList class="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <h3 class="font-semibold text-gray-800">IPSS</h3>
              <p class="text-sm text-gray-600">Questionário de sintomas prostáticos</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Objectives Screen -->
    <div v-if="currentScreen === 'objectives'" class="p-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-center mb-6">OBJETIVOS</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-orange-500 mb-3">OBJETIVO GERAL:</h3>
            <p class="text-gray-700 leading-relaxed">
              - Desenvolver um aplicativo para celulares que auxilie os médicos não especialistas em urologia 
              a realizar o manejo correto de pacientes com hiperplasia prostática benigna.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-orange-500 mb-3">OBJETIVO ESPECÍFICO:</h3>
            <p class="text-gray-700 leading-relaxed">
              - Verificar se há aumento da capacidade diagnóstica e terapêutica de médicos não especialistas 
              em urologia em pacientes com HPB.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Surgery Indications Screen -->
    <div v-if="currentScreen === 'surgery-indications'" class="p-6">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Indicações absolutas de cirurgia</h3>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start">
            <span class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Hematúria recorrente;
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Infecções urinárias de repetição;
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Divertículos de bexiga e infecção urinária;
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Cálculos vesicais;
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Retenção urinária e uso de sonda;
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Hidronefrose e alteração da função renal.
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <p class="text-gray-700 mb-6">
          Você consegue identificar na história clínica alguma das indicações absolutas de cirurgia?
        </p>
        
        <div class="space-y-3">
          <button 
            @click="handleSurgeryIndication(true)"
            class="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            SIM
          </button>
          <button 
            @click="handleSurgeryIndication(false)"
            class="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            NÃO
          </button>
        </div>
      </div>
    </div>

    <!-- Exams Screen -->
    <div v-if="currentScreen === 'exams'" class="p-6 space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Informe a idade do paciente</h3>
        <input 
          v-model="patientData.age"
          type="number" 
          placeholder="Digite a idade"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Prostatic Score Symptom</h3>
        <h4 class="text-xl font-bold text-gray-800 mb-4">IPSS</h4>
        <div class="bg-gray-100 p-3 rounded-lg mb-4">
          <span class="text-2xl font-bold">{{ patientData.ipss || 13 }}</span>
          <p class="text-sm text-gray-600 mt-1">Não é possível editar este valor</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Antígeno Prostático Específico</h3>
        <h4 class="text-xl font-bold text-gray-800 mb-4">Informe o PSA total</h4>
        <input 
          v-model="patientData.psa"
          type="number" 
          step="0.1"
          placeholder="Digite o PSA"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
        />
        
        <div v-if="patientData.psa > 4" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <AlertTriangle class="w-5 h-5 text-red-500 mr-2" />
            <span class="font-semibold text-red-700">Atenção!</span>
          </div>
          <p class="text-red-700 text-center">
            Risco de câncer de próstata.<br />
            Encaminhar ao urologista.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Próstata</h3>
        <h4 class="text-xl font-bold text-gray-800 mb-4">Informe o volume da próstata</h4>
        <input 
          v-model="patientData.prostateVolume"
          type="number" 
          placeholder="Digite o volume (g)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <button 
        @click="processExamResults"
        class="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
      >
        Continuar
      </button>
    </div>

    <!-- IPSS Screen -->
    <div v-if="currentScreen === 'ipss'" class="p-6">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <span class="text-lg font-semibold">Quase sempre</span>
          <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Sintoma de Armazenamento</h3>
        <p class="text-gray-700 mb-6">
          No último mês, quantas vezes, em média, você teve de se levantar à noite para urinar?
        </p>

        <div class="space-y-4">
          <label v-for="option in ipssOptions" :key="option.value" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span class="text-gray-700">{{ option.label }}</span>
            <input 
              v-model="patientData.ipssNocturia" 
              :value="option.value"
              type="radio" 
              class="w-5 h-5 text-orange-500"
            />
          </label>
        </div>

        <button 
          @click="completeIPSS"
          class="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors mt-6"
        >
          Continuar
        </button>
      </div>
    </div>

    <!-- Guidance Screen -->
    <div v-if="currentScreen === 'guidance'" class="p-6">
      <div v-if="guidanceType === 'mild'" class="space-y-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <CheckCircle class="w-5 h-5 text-green-500 mr-2" />
            <span class="font-semibold text-green-700">Atenção!</span>
          </div>
          <p class="text-green-700 text-center font-semibold">
            Paciente com sintomas leves.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Oriente o paciente a:</h3>
          <ul class="space-y-3 text-gray-700">
            <li class="p-3 bg-gray-50 rounded-lg">Reduzir ingesta hídrica à noite</li>
            <li class="p-3 bg-gray-50 rounded-lg">Diminuir ingesta de alimentos como café, álcool e refrigerantes.</li>
            <li class="p-3 bg-gray-50 rounded-lg">Evitar tabagismo.</li>
            <li class="p-3 bg-gray-50 rounded-lg">Realizar ordenha uretral para pacientes com gotejamento pós-miccional.</li>
            <li class="p-3 bg-gray-50 rounded-lg">Evitar, desde que seja possível, medicações como: diuréticos, antidepressivos, alfa-agonistas</li>
          </ul>
        </div>
      </div>

      <div v-if="guidanceType === 'medication'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Conduta</h3>
          <p class="text-gray-700 mb-4">Prescreva um alfa-bloqueador.</p>
          
          <div class="space-y-4">
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Doxazosina 2mg</h4>
              <p class="text-sm text-gray-600 mb-3">1 comprimido à noite antes de dormir.</p>
              <div class="flex space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Contraindicações
                </span>
              </div>
            </div>

            <div class="text-center text-gray-500 font-semibold">ou</div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Tansulosina 0,4 mg</h4>
              <p class="text-sm text-gray-600 mb-3">1 comprimido à noite antes de dormir.</p>
              <div class="flex space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Contraindicações
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Exemplos</h3>
          
          <div class="space-y-4">
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Doxazosina 2mg + Finasterida 5mg</h4>
              <p class="text-sm text-gray-600 mb-3">1 comprimido de cada à noite antes de dormir.</p>
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Contraindicações Doxazosina
                </span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Contraindicações finasterida
                </span>
              </div>
            </div>

            <div class="text-center text-gray-500 font-semibold">ou</div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Tansulosina 0,4 mg + Dutasterida 0,5mg</h4>
              <p class="text-sm text-gray-600 mb-3">1 comprimido de cada à noite antes de dormir.</p>
              <div class="flex space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Contraindicações Tansulosina
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="guidanceType === 'referral'" class="space-y-6">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <AlertTriangle class="w-5 h-5 text-red-500 mr-2" />
            <span class="font-semibold text-red-700">Atenção!</span>
          </div>
          <p class="text-red-700 text-center">
            Caso Paciente não tenha tido melhora satisfatória com as medicações, encaminhar ao urologista.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <p class="text-gray-700 mb-4">
            Caso o paciente não tenha melhora importante dos sintomas de armazenamento (noctúria, urgência e frequência aumentada), considerar associação com anticolinérgico (observar contraindicações).
          </p>
          <p class="text-gray-700 mb-4">
            Caso o paciente tenha sintomas de disfunção erétil, considerar uso de tadalafila 5mg diário (observar contraindicações).
          </p>
          <p class="text-gray-700">
            Em caso de dúvidas, encaminhar ao urologista.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Orientação</h3>
        <p class="text-gray-700 mb-6">Encaminhar paciente ao urologista...</p>
        
        <button 
          @click="finishAssessment"
          class="w-full bg-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors"
        >
          FINALIZAR
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { 
  ArrowLeft, 
  Share, 
  Target, 
  Scissors, 
  FileText, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-vue-next'

export default {
  name: 'HPBApp',
  components: {
    ArrowLeft,
    Share,
    Target,
    Scissors,
    FileText,
    ClipboardList,
    AlertTriangle,
    CheckCircle
  },
  setup() {
    const currentScreen = ref('home')
    const guidanceType = ref('')
    const screenHistory = ref([])
    
    const patientData = reactive({
      age: '',
      ipss: 13,
      psa: '',
      prostateVolume: '',
      ipssNocturia: '',
      hasSurgeryIndication: null
    })

    const ipssOptions = [
      { label: 'Nenhuma', value: 0 },
      { label: '1 vez', value: 1 },
      { label: '2 vezes', value: 2 },
      { label: '3 vezes', value: 3 },
      { label: '4 vezes', value: 4 },
      { label: '5 vezes', value: 5 }
    ]

    const getScreenTitle = () => {
      const titles = {
        'home': 'HPB Assistant',
        'objectives': 'Objetivos',
        'surgery-indications': 'Indicações de cirurgia',
        'exams': 'Exames',
        'ipss': 'IPSS',
        'guidance': 'Orientação'
      }
      return titles[currentScreen.value] || 'HPB Assistant'
    }

    const goBack = () => {
      if (screenHistory.value.length > 0) {
        currentScreen.value = screenHistory.value.pop()
      } else {
        currentScreen.value = 'home'
      }
    }

    const navigateTo = (screen) => {
      screenHistory.value.push(currentScreen.value)
      currentScreen.value = screen
    }

    const handleSurgeryIndication = (hasIndication) => {
      patientData.hasSurgeryIndication = hasIndication
      if (hasIndication) {
        guidanceType.value = 'referral'
        navigateTo('guidance')
      } else {
        navigateTo('exams')
      }
    }

    const processExamResults = () => {
      // Logic to determine guidance based on exam results
      if (patientData.psa > 4) {
        guidanceType.value = 'referral'
      } else if (patientData.ipss <= 7) {
        guidanceType.value = 'mild'
      } else {
        guidanceType.value = 'medication'
      }
      navigateTo('guidance')
    }

    const completeIPSS = () => {
      // Update IPSS score based on responses
      navigateTo('guidance')
    }

    const finishAssessment = () => {
      // Reset data and return to home
      Object.keys(patientData).forEach(key => {
        if (typeof patientData[key] === 'string') {
          patientData[key] = ''
        } else if (typeof patientData[key] === 'number') {
          patientData[key] = key === 'ipss' ? 13 : ''
        } else {
          patientData[key] = null
        }
      })
      screenHistory.value = []
      currentScreen.value = 'home'
    }

    return {
      currentScreen,
      guidanceType,
      patientData,
      ipssOptions,
      getScreenTitle,
      goBack,
      navigateTo,
      handleSurgeryIndication,
      processExamResults,
      completeIPSS,
      finishAssessment
    }
  }
}
</script>

<style scoped>
/* Custom styles for better mobile experience */
.min-h-screen {
  min-height: 100vh;
  min-height: 100dvh;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* PWA specific styles */
@media (display-mode: standalone) {
  .min-h-screen {
    min-height: 100vh;
  }
}
</style>
