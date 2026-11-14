# NEXORA AI — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Identity Isolation (`learners/{learnerId}`)**: A learner profile document ID `{learnerId}` must strictly equal `request.auth.uid`, and `incoming().uid == request.auth.uid`. Only verified users (`request.auth.token.email_verified == true`) may create or update documents.
2. **Relational Master Gate (`learners/{learnerId}/messages/{messageId}`)**: A mentor conversation message can only be created or read if the parent `/learners/{learnerId}` document exists and belongs to `request.auth.uid`.
3. **Strict Keys & Anti-Shadow-Update**: No undocumented fields may be injected during `create` or `update`.
4. **Immutable Ownership & Temporal Integrity**: `uid` and `createdAt` are immutable across updates; `createdAt` and `updatedAt` must equal `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Write**: `auth = null`, creating `/learners/user_1`.
2. **Unverified Email Spoof**: `auth.uid = 'user_1', email_verified = false`, creating `/learners/user_1`.
3. **Cross-User Profile Read (PII Leak)**: `auth.uid = 'attacker'`, reading `/learners/victim_1`.
4. **UID Spoofing on Create**: `auth.uid = 'user_1'`, creating `/learners/user_1` with `uid: 'victim_1'`.
5. **Shadow Field Injection on Create**: Creating `/learners/user_1` with extra field `isAdmin: true`.
6. **Shadow Field Injection on Update**: Updating `/learners/user_1` with extra field `role: 'superadmin'`.
7. **Immutable Field Mutation**: Updating `/learners/user_1` by changing `createdAt` or `uid`.
8. **Client Timestamp Forgery**: Creating `/learners/user_1` with a past/future `createdAt` != `request.time`.
9. **Oversized String DoW Attack**: Creating `/learners/user_1` with `fullName` of 5,000 characters (> 120 max).
10. **Path ID Poisoning**: Creating `/learners/user_1/messages/invalid$id!` with non-alphanumeric ID.
11. **Orphaned Subcollection Write**: Creating `/learners/user_1/messages/msg_1` when `/learners/user_1` does not exist.
12. **Subcollection Mutation**: Attempting to update an immutable chat message in `/learners/user_1/messages/msg_1`.
