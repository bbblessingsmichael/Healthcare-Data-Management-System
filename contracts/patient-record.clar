;; Patient Record Contract

;; Define data structures
(define-map patient-records
  { patient-id: uint }
  {
    encrypted-data: (string-utf8 1024),
    last-updated: uint,
    owner: principal
  }
)

(define-data-var next-patient-id uint u1)

;; Error codes
(define-constant err-unauthorized (err u100))
(define-constant err-not-found (err u101))

;; Functions
(define-public (add-patient-record (encrypted-data (string-utf8 1024)))
  (let
    ((patient-id (var-get next-patient-id)))
    (map-set patient-records
      { patient-id: patient-id }
      {
        encrypted-data: encrypted-data,
        last-updated: block-height,
        owner: tx-sender
      }
    )
    (var-set next-patient-id (+ patient-id u1))
    (ok patient-id)
  )
)

(define-public (update-patient-record (patient-id uint) (encrypted-data (string-utf8 1024)))
  (match (map-get? patient-records { patient-id: patient-id })
    record
      (begin
        (asserts! (is-eq (get owner record) tx-sender) err-unauthorized)
        (ok (map-set patient-records
          { patient-id: patient-id }
          {
            encrypted-data: encrypted-data,
            last-updated: block-height,
            owner: (get owner record)
          }
        ))
      )
    err-not-found
  )
)

(define-read-only (get-patient-record (patient-id uint))
  (match (map-get? patient-records { patient-id: patient-id })
    record (ok record)
    err-not-found
  )
)

(define-read-only (get-patient-owner (patient-id uint))
  (match (map-get? patient-records { patient-id: patient-id })
    record (ok (get owner record))
    err-not-found
  )
)

