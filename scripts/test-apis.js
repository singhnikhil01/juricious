const http = require('http');
const fs = require('fs');

// Read .env if not loaded
if (!process.env.DATABASE_URL && fs.existsSync('.env')) {
  const content = fs.readFileSync('.env', 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  });
}

const PORT = 3009;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(body);
          } catch {}
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body,
            json,
          });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE API & AUTH TESTS ---');

  // 1. Public waitlist count
  console.log('\n[Test 1] GET /api/waitlist (public count)');
  const wlCountRes = await request('/api/waitlist');
  console.log('Status:', wlCountRes.status, 'Total in DB:', wlCountRes.json?.total);
  if (wlCountRes.status !== 200 || !wlCountRes.json?.success) throw new Error('Waitlist count failed');

  // 2. Public waitlist submit
  console.log('\n[Test 2] POST /api/waitlist (public signup)');
  const testEmail = `test_advocate_${Date.now()}@example.com`;
  const wlSubmitRes = await request('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'Advocate Rajesh Sharma',
      email: testEmail,
      phone: '9841000000',
      role: 'Advocate',
      place: 'Kathmandu District Court',
      firstFeature: 'Tareekh Dastoor reminders',
      note: 'Looking forward to testing digital tareekh tracker',
      consent: true,
      source: 'Automated Test Suite',
    },
  });
  console.log('Status:', wlSubmitRes.status, 'Created id:', wlSubmitRes.json?.id);
  if (wlSubmitRes.status !== 201 || !wlSubmitRes.json?.success) throw new Error('Waitlist submit failed');

  // 3. Duplicate waitlist check
  console.log('\n[Test 3] POST /api/waitlist (duplicate check)');
  const dupRes = await request('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'Advocate Rajesh Sharma',
      email: testEmail,
      role: 'Advocate',
    },
  });
  console.log('Duplicate status (expected 409):', dupRes.status, 'errorType:', dupRes.json?.errorType);
  if (dupRes.status !== 409) throw new Error('Expected 409 duplicate conflict');

  // 4. Public feedback submit
  console.log('\n[Test 4] POST /api/feedback (public submit)');
  const fbSubmitRes = await request('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      kind: 'Idea',
      message: 'Nepali Bikram Sambat calendar date integration would be very helpful',
      name: 'Senior Adv. Thapa',
      email: 'thapa@example.com',
    },
  });
  console.log('Status:', fbSubmitRes.status, 'Feedback id:', fbSubmitRes.json?.id);
  if (fbSubmitRes.status !== 201 || !fbSubmitRes.json?.success) throw new Error('Feedback submit failed');

  // 5. Unauthenticated admin access
  console.log('\n[Test 5] Protected admin route unauthenticated check (expected 401)');
  const unauthRes = await request('/api/admin/waitlist');
  console.log('Unauth waitlist status:', unauthRes.status);
  if (unauthRes.status !== 401) throw new Error('Expected 401 for unauthenticated waitlist');

  // 6. Admin login with invalid password
  console.log('\n[Test 6] Admin login with wrong password (expected 401)');
  const wrongLoginRes = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      email: 'admin@juricious.com',
      password: 'WrongPassword123!',
    },
  });
  console.log('Wrong password status:', wrongLoginRes.status, 'Error:', wrongLoginRes.json?.error);
  if (wrongLoginRes.status !== 401) throw new Error('Expected 401 for wrong password');

  // 7. Admin login with correct credentials
  console.log('\n[Test 7] Admin login with valid credentials');
  const defaultPw = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@1234';
  const loginRes = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      email: 'admin@juricious.com',
      password: defaultPw,
    },
  });
  console.log('Login status:', loginRes.status, 'Token returned:', !!loginRes.json?.token, 'User:', loginRes.json?.user);
  if (loginRes.status !== 200 || !loginRes.json?.token) throw new Error('Admin login failed');

  const token = loginRes.json.token;
  const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : '';
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Cookie: cookie,
  };

  // 8. Verify session with GET /api/admin/auth
  console.log('\n[Test 8] GET /api/admin/auth (verify session)');
  const sessionRes = await request('/api/admin/auth', { headers: authHeaders });
  console.log('Session status:', sessionRes.status, 'User:', sessionRes.json?.user);
  if (sessionRes.status !== 200 || !sessionRes.json?.success) throw new Error('Session verify failed');

  // 9. Fetch waitlist with authenticated session
  console.log('\n[Test 9] GET /api/admin/waitlist (authenticated)');
  const authWlRes = await request('/api/admin/waitlist', { headers: authHeaders });
  console.log('Status:', authWlRes.status, 'Records found:', authWlRes.json?.waitlist?.length);
  if (authWlRes.status !== 200 || !Array.isArray(authWlRes.json?.waitlist)) throw new Error('Auth waitlist fetch failed');

  // 10. Update waitlist entry status
  console.log('\n[Test 10] PATCH /api/admin/waitlist/:id (update status to Contacted)');
  const entryId = wlSubmitRes.json.id;
  const updateRes = await request(`/api/admin/waitlist/${entryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: {
      status: 'Contacted',
      internalNotes: 'Contacted via phone, interested in demo',
    },
  });
  console.log('Update status:', updateRes.status, 'Success:', updateRes.json?.success);
  if (updateRes.status !== 200 || !updateRes.json?.success) throw new Error('Waitlist update failed');

  // 11. Fetch feedback with authenticated session
  console.log('\n[Test 11] GET /api/admin/feedback (authenticated)');
  const authFbRes = await request('/api/admin/feedback', { headers: authHeaders });
  console.log('Status:', authFbRes.status, 'Feedback count:', authFbRes.json?.feedback?.length);
  if (authFbRes.status !== 200 || !Array.isArray(authFbRes.json?.feedback)) throw new Error('Auth feedback fetch failed');

  // 12. Fetch audit logs
  console.log('\n[Test 12] GET /api/admin/audit (authenticated audit trail)');
  const auditRes = await request('/api/admin/audit', { headers: authHeaders });
  console.log('Status:', auditRes.status, 'Audit logs count:', auditRes.json?.auditLogs?.length);
  if (auditRes.status !== 200 || !Array.isArray(auditRes.json?.auditLogs)) throw new Error('Audit trail fetch failed');
  console.log('Recent audit log action:', auditRes.json.auditLogs[0]?.action, 'Details:', auditRes.json.auditLogs[0]?.details);

  // 13. Logout
  console.log('\n[Test 13] DELETE /api/admin/auth (logout)');
  const logoutRes = await request('/api/admin/auth', {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('Logout status:', logoutRes.status, 'Success:', logoutRes.json?.success);
  if (logoutRes.status !== 200) throw new Error('Logout failed');

  // 14. Verify token revoked
  console.log('\n[Test 14] Verify revoked token cannot access protected route (expected 401)');
  const revokedRes = await request('/api/admin/waitlist', { headers: { Authorization: `Bearer ${token}` } });
  console.log('Revoked token status (expected 401):', revokedRes.status);
  if (revokedRes.status !== 401) throw new Error('Expected 401 for revoked session');

  console.log('\nALL 14 TESTS PASSED FLAWLESSLY!');
}

runTests().catch((e) => {
  console.error('\nTEST SUITE FAILED:', e);
  process.exit(1);
});
