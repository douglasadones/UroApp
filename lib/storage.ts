// Utility functions for offline storage
export interface PatientDataStorage {
  id: string
  timestamp: number
  data: any
  synced: boolean
}

export interface PendingEmail {
  id: string
  timestamp: number
  doctorEmail: string
  patientEmail: string
  report: string
  attempts: number
}

class OfflineStorage {
  private dbName = "UroHPBDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Store for patient data
        if (!db.objectStoreNames.contains("patientData")) {
          const patientStore = db.createObjectStore("patientData", { keyPath: "id" })
          patientStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Store for pending emails
        if (!db.objectStoreNames.contains("pendingEmails")) {
          const emailStore = db.createObjectStore("pendingEmails", { keyPath: "id" })
          emailStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  async savePatientData(data: any): Promise<string> {
    if (!this.db) await this.init()

    const id = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const patientData: PatientDataStorage = {
      id,
      timestamp: Date.now(),
      data,
      synced: false,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["patientData"], "readwrite")
      const store = transaction.objectStore("patientData")
      const request = store.add(patientData)

      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(request.error)
    })
  }

  async savePendingEmail(doctorEmail: string, patientEmail: string, report: string): Promise<string> {
    if (!this.db) await this.init()

    const id = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const pendingEmail: PendingEmail = {
      id,
      timestamp: Date.now(),
      doctorEmail,
      patientEmail,
      report,
      attempts: 0,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingEmails"], "readwrite")
      const store = transaction.objectStore("pendingEmails")
      const request = store.add(pendingEmail)

      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingEmails(): Promise<PendingEmail[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingEmails"], "readonly")
      const store = transaction.objectStore("pendingEmails")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deletePendingEmail(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingEmails"], "readwrite")
      const store = transaction.objectStore("pendingEmails")
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPatientHistory(): Promise<PatientDataStorage[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["patientData"], "readonly")
      const store = transaction.objectStore("patientData")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const offlineStorage = new OfflineStorage()
