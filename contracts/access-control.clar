;; Access Control Contract

;; Define data structures
(define-map access-rights
  { patient-id: uint, user: principal }
  { can-read: bool, can-write: bool }
)

(define-map patient-owners
  { patient-id: uint }
  { owner: principal }
)

;; Error codes
(define-constant err-unauthorized (err u100))
(define-constant err-not-found (err u101))

;; Functions
(define-public (set-patient-owner (patient-id uint))
  (ok (map-set patient-owners
    { patient-id: patient-id }
    { owner: tx-sender }
  ))
)

(define-public (grant-access (patient-id uint) (user principal) (can-read bool) (can-write bool))
  (let ((owner (get owner (default-to { owner: tx-sender } (map-get? patient-owners { patient-id: patient-id })))))
    (asserts! (is-eq tx-sender owner) err-unauthorized)
    (ok (map-set access-rights
      { patient-id: patient-id, user: user }
      { can-read: can-read, can-write: can-write }
    ))
  )
)

(define-public (revoke-access (patient-id uint) (user principal))
  (let ((owner (get owner (default-to { owner: tx-sender } (map-get? patient-owners { patient-id: patient-id })))))
    (asserts! (is-eq tx-sender owner) err-unauthorized)
    (ok (map-delete access-rights { patient-id: patient-id, user: user }))
  )
)

(define-read-only (has-read-access (user principal) (patient-id uint))
  (default-to false (get can-read (map-get? access-rights { patient-id: patient-id, user: user })))
)

(define-read-only (has-write-access (user principal) (patient-id uint))
  (default-to false (get can-write (map-get? access-rights { patient-id: patient-id, user: user })))
)

(define-read-only (get-patient-owner (patient-id uint))
  (match (map-get? patient-owners { patient-id: patient-id })
    owner-data (ok (get owner owner-data))
    err-not-found
  )
)

