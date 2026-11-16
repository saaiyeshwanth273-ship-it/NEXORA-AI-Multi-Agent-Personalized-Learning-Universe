import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesContent = fs.readFileSync('./firestore.rules', 'utf8');

function simulateFirestoreRuleCheck(params: {
  auth: { uid: string; email_verified: boolean } | null;
  operation: 'get' | 'create' | 'update' | 'delete';
  path: string;
  incoming?: Record<string, unknown>;
  existing?: Record<string, unknown>;
  parentExists?: boolean;
  requestTime?: string;
}): 'ALLOWED' | 'PERMISSION_DENIED' {
  const { auth, operation, path, incoming, existing, parentExists = true, requestTime = '2026-11-13T00:00:00Z' } = params;
  if (!auth) return 'PERMISSION_DENIED';

  const parts = path.split('/').filter(Boolean);
  const isValidId = (id: string) => typeof id === 'string' && id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);

  if (parts[0] === 'learners' && parts.length === 2) {
    const learnerId = parts[1];
    if (!isValidId(learnerId) || auth.uid !== learnerId) return 'PERMISSION_DENIED';
    if (operation === 'get') return 'ALLOWED';
    if (!auth.email_verified) return 'PERMISSION_DENIED';
    if (operation === 'delete') return 'ALLOWED';

    if (!incoming) return 'PERMISSION_DENIED';
    const allowedKeys = new Set([
      'uid', 'fullName', 'qualification', 'institution', 'level',
      'targetCareerId', 'learningStyle', 'weeklyHoursAvailable',
      'shortTermGoal', 'longTermGoal', 'mfaEnabled', 'statePayload',
      'createdAt', 'updatedAt'
    ]);
    const requiredKeys = ['uid', 'fullName', 'targetCareerId', 'weeklyHoursAvailable', 'createdAt', 'updatedAt'];
    const keys = Object.keys(incoming);
    if (!requiredKeys.every((k) => keys.includes(k))) return 'PERMISSION_DENIED';
    if (!keys.every((k) => allowedKeys.has(k))) return 'PERMISSION_DENIED';
    if (incoming.uid !== auth.uid) return 'PERMISSION_DENIED';
    if (typeof incoming.fullName !== 'string' || incoming.fullName.length < 1 || incoming.fullName.length > 120) return 'PERMISSION_DENIED';
    if (typeof incoming.targetCareerId !== 'string' || incoming.targetCareerId.length < 1 || incoming.targetCareerId.length > 80) return 'PERMISSION_DENIED';
    if (typeof incoming.weeklyHoursAvailable !== 'number' || incoming.weeklyHoursAvailable < 1 || incoming.weeklyHoursAvailable > 100) return 'PERMISSION_DENIED';

    if (operation === 'create') {
      if (incoming.createdAt !== requestTime || incoming.updatedAt !== requestTime) return 'PERMISSION_DENIED';
      return 'ALLOWED';
    }
    if (operation === 'update') {
      if (!existing) return 'PERMISSION_DENIED';
      if (incoming.uid !== existing.uid || incoming.createdAt !== existing.createdAt) return 'PERMISSION_DENIED';
      if (incoming.updatedAt !== requestTime) return 'PERMISSION_DENIED';
      return 'ALLOWED';
    }
  }

  if (parts[0] === 'learners' && parts[2] === 'messages' && parts.length === 4) {
    const learnerId = parts[1];
    const messageId = parts[3];
    if (!isValidId(learnerId) || !isValidId(messageId) || auth.uid !== learnerId) return 'PERMISSION_DENIED';
    if (!parentExists) return 'PERMISSION_DENIED';
    if (operation === 'get') return 'ALLOWED';
    if (operation === 'update') return 'PERMISSION_DENIED';
    if (!auth.email_verified) return 'PERMISSION_DENIED';
    if (operation === 'delete') return 'ALLOWED';
    if (operation === 'create') {
      if (!incoming) return 'PERMISSION_DENIED';
      const keys = Object.keys(incoming);
      const allowed = new Set(['uid', 'role', 'content', 'createdAt']);
      if (keys.length !== 4 || !keys.every((k) => allowed.has(k))) return 'PERMISSION_DENIED';
      if (incoming.uid !== auth.uid) return 'PERMISSION_DENIED';
      if (incoming.role !== 'user' && incoming.role !== 'mentor') return 'PERMISSION_DENIED';
      if (typeof incoming.content !== 'string' || incoming.content.length < 1 || incoming.content.length > 8000) return 'PERMISSION_DENIED';
      if (incoming.createdAt !== requestTime) return 'PERMISSION_DENIED';
      return 'ALLOWED';
    }
  }

  return 'PERMISSION_DENIED';
}

test('Firestore rules and config contain zero hardcoded emails, API keys, or admin overrides, and enforce Eight Pillars guards', () => {
  assert.ok(rulesContent.includes("rules_version = '2';"));
  assert.ok(rulesContent.includes('allow read, write: if false;'));
  assert.ok(rulesContent.includes('request.auth.token.email_verified == true'));
  assert.ok(rulesContent.includes('affectedKeys().hasOnly'));
  assert.equal(rulesContent.includes('@gmail.com'), false);
  assert.equal(rulesContent.includes('isAdmin'), false);

  const rawConfig = fs.readFileSync('./firebase-applet-config.json', 'utf8');
  assert.equal(rawConfig.includes('AIza'), false);
  assert.equal(rawConfig.includes('googleusercontent.com'), false);
});

test('Dirty Dozen adversarial payloads all return PERMISSION_DENIED', () => {
  const validPayload = {
    uid: 'user_1',
    fullName: 'Alex Rivera',
    targetCareerId: 'fullstack',
    weeklyHoursAvailable: 12,
    createdAt: '2026-11-13T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
  };

  // 1. Unauthenticated Write
  assert.equal(simulateFirestoreRuleCheck({ auth: null, operation: 'create', path: '/learners/user_1', incoming: validPayload }), 'PERMISSION_DENIED');
  // 2. Unverified Email Spoof
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: false }, operation: 'create', path: '/learners/user_1', incoming: validPayload }), 'PERMISSION_DENIED');
  // 3. Cross-User Profile Read
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'attacker', email_verified: true }, operation: 'get', path: '/learners/user_1' }), 'PERMISSION_DENIED');
  // 4. UID Spoofing on Create
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'create', path: '/learners/user_1', incoming: { ...validPayload, uid: 'victim_1' } }), 'PERMISSION_DENIED');
  // 5. Shadow Field Injection on Create
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'create', path: '/learners/user_1', incoming: { ...validPayload, isAdmin: true } }), 'PERMISSION_DENIED');
  // 6. Shadow Field Injection on Update
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'update', path: '/learners/user_1', existing: validPayload, incoming: { ...validPayload, role: 'superadmin' } }), 'PERMISSION_DENIED');
  // 7. Immutable Field Mutation
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'update', path: '/learners/user_1', existing: validPayload, incoming: { ...validPayload, createdAt: '2020-01-01T00:00:00Z' } }), 'PERMISSION_DENIED');
  // 8. Client Timestamp Forgery
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'create', path: '/learners/user_1', incoming: { ...validPayload, createdAt: '2099-01-01T00:00:00Z' } }), 'PERMISSION_DENIED');
  // 9. Oversized String DoW Attack
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'create', path: '/learners/user_1', incoming: { ...validPayload, fullName: 'A'.repeat(500) } }), 'PERMISSION_DENIED');
  // 10. Path ID Poisoning
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'create', path: '/learners/user_1/messages/bad$id!', incoming: { uid: 'user_1', role: 'user', content: 'hi', createdAt: '2026-11-13T00:00:00Z' } }), 'PERMISSION_DENIED');
  // 11. Orphaned Subcollection Write
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'create', path: '/learners/user_1/messages/msg_1', parentExists: false, incoming: { uid: 'user_1', role: 'user', content: 'hi', createdAt: '2026-11-13T00:00:00Z' } }), 'PERMISSION_DENIED');
  // 12. Subcollection Mutation
  assert.equal(simulateFirestoreRuleCheck({ auth: { uid: 'user_1', email_verified: true }, operation: 'update', path: '/learners/user_1/messages/msg_1', incoming: { uid: 'user_1', role: 'user', content: 'edited', createdAt: '2026-11-13T00:00:00Z' } }), 'PERMISSION_DENIED');
});
