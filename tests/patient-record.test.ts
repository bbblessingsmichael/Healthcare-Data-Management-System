import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for patient records
const patientRecords = new Map()
let nextPatientId = 1

// Mock functions to simulate contract behavior
function addPatientRecord(encryptedData: string) {
  const patientId = nextPatientId++
  patientRecords.set(patientId, { encryptedData, lastUpdated: Date.now() })
  return patientId
}

function updatePatientRecord(patientId: number, encryptedData: string) {
  if (!patientRecords.has(patientId)) throw new Error("Record not found")
  patientRecords.set(patientId, { encryptedData, lastUpdated: Date.now() })
  return true
}

function getPatientRecord(patientId: number) {
  return patientRecords.get(patientId)
}

describe("Patient Record Contract", () => {
  beforeEach(() => {
    patientRecords.clear()
    nextPatientId = 1
  })
  
  it("should add a new patient record", () => {
    const patientId = addPatientRecord("encrypted data 1")
    expect(patientId).toBe(1)
    expect(patientRecords.size).toBe(1)
    expect(patientRecords.get(1).encryptedData).toBe("encrypted data 1")
  })
  
  it("should update an existing patient record", () => {
    const patientId = addPatientRecord("initial data")
    const result = updatePatientRecord(patientId, "updated data")
    expect(result).toBe(true)
    expect(patientRecords.get(patientId).encryptedData).toBe("updated data")
  })
  
  it("should throw an error when updating a non-existent record", () => {
    expect(() => updatePatientRecord(999, "data")).toThrow("Record not found")
  })
  
  it("should retrieve a patient record", () => {
    const patientId = addPatientRecord("test data")
    const record = getPatientRecord(patientId)
    expect(record).toBeDefined()
    expect(record.encryptedData).toBe("test data")
  })
})

