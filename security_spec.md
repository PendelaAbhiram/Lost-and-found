# Security Specification & Threat Model

## 1. Data Invariants
1. An item report cannot be created by an unauthenticated user or on behalf of another user (`userId` must equal `request.auth.uid`).
2. An item report's immutable fields (`id`, `userId`, `submittedAt`) cannot be overwritten or altered after creation.
3. Item reports can only have status `open` or `solved`. Once solved, a non-admin cannot alter it or re-open it.
4. Users can only update their own item reports, or admins can update any report.
5. Deletion of an item report is strictly restricted to its owner (`userId == request.auth.uid`) or an administrator.
6. Feedback submissions require authenticated users and must reference an existing item; `userId` must equal `request.auth.uid`.
7. Rating in feedback must be between 1 and 5.
8. User profiles in `/users/{userId}` can only be read/written by the authenticated user whose `uid == userId` or an admin.
9. Admin status is guarded via `/admins/{uid}` or bootstrapped root admin email (`abhirampendela3@gmail.com`).
10. All document IDs must conform to `isValidId` (`^[a-zA-Z0-9_\-]+$`, length <= 128).

## 2. The Dirty Dozen Payloads (Designed to Break Identity, Integrity, and State)

1. **Unauthenticated Item Creation**: An unauthenticated user attempts to create an item report in `/items/item_999`.
2. **Identity Spoofing on Item Report**: User A attempts to submit an item report setting `userId: "user_B"`.
3. **Ghost Field Injection**: User sends an item creation payload containing unauthorized ghost fields like `{ "isAdmin": true, "superUser": true }`.
4. **ID Poisoning Attack**: An attacker attempts to create a document with a 2KB junk character string ID `/items/%%%%%INVALID$$$`.
5. **Unauthorized Status Modification**: A third-party authenticated user attempts to change another user's item status to `solved`.
6. **Immutable Field Tampering**: An item owner attempts to change `userId` or `submittedAt` in an update payload.
7. **Invalid Rating Score**: User submits feedback with `rating: 99` or `rating: -1`.
8. **Feedback Identity Forgery**: User A submits feedback with `userId: "user_victim"`.
9. **Malicious Giant String Injection**: An attacker attempts to submit an item report with a 500KB payload in `name` to cause resource exhaustion.
10. **Terminal State Regression**: A regular user attempts to regress a solved report back to open status without admin permissions.
11. **Profile Hijacking**: User A attempts to write or overwrite `/users/user_B`.
12. **Admin Directory Self-Promotion**: A standard user attempts to write themselves into `/admins/{request.auth.uid}`.
