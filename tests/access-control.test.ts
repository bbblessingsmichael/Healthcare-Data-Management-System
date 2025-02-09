import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for access rights
const accessRights = new Map()

// Mock functions to simulate contract behavior
function grantAccess(patientId: number, user: string, canRead: boolean, canWrite: boolean) {
  accessRights.set(`${patientId}-${user}`, { canRead, canWrite })
  return true
}

function revokeAccess(patientId: number, user: string) {
  accessRights.delete(`${patientId}-${user}`)
  return true
}

function hasReadAccess(user: string, patientId: number) {
  const rights = accessRights.get(`${patientId}-${user}`)
  return rights ? rights.canRead : false
}

function hasWriteAccess(user: string, patientId: number) {
  const rights = accessRights.get(`${patientId}-${user}`)
  return rights ? rights.canWrite : false
}

describe("Access Control Contract", () => {
  beforeEach(() => {
    accessRights.clear()
  })
  
  it("should grant access rights", () => {
    const result = grantAccess(1, "doctor1", true, true)
    expect(result).toBe(true)
    expect(accessRights.size).toBe(1)
    expect(accessRights.get("1-doctor1")).toEqual({ canRead: true, canWrite: true })
  })
  
  it("should revoke access rights", () => {
    grantAccess(1, "doctor1", true, true)
    const result = revokeAccess(1, "doctor1")
    expect(result).toBe(true)
    expect(accessRights.size).toBe(0)
  })
  
  it("should correctly check read access", () => {
    grantAccess(1, "doctor1", true, false)
    expect(hasReadAccess("doctor1", 1)).toBe(true)
    expect(hasReadAccess("doctor2", 1)).toBe(false)
  })
  
  it("should correctly check write access", () => {
    grantAccess(1, "doctor1", true, true)
    grantAccess(2, "doctor1", true, false)
    expect(hasWriteAccess("doctor1", 1)).toBe(true)
    expect(hasWriteAccess("doctor1", 2)).toBe(false)
  })
})

