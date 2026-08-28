const http = require('http');

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json || data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      if (typeof options.body === 'string') {
        req.write(options.body);
      } else {
        req.write(JSON.stringify(options.body));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log(`🧪 Lancement de la suite de tests automatisés NestJS (${BASE_URL})...`);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name} : ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /health retourne 200 OK', async () => {
    const res = await makeRequest('/health');
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    if (res.body?.data?.status !== 'ok' && res.body?.status !== 'ok') throw new Error('Status non ok');
  });

  // 2. Categories
  await test('GET /api/v1/categories retourne les 4 catégories', async () => {
    const res = await makeRequest('/api/v1/categories');
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    const cats = res.body.data.categories;
    if (!Array.isArray(cats) || cats.length < 4) throw new Error(`Catégories reçues: ${cats?.length}`);
  });

  // 3. Products
  await test('GET /api/v1/products retourne les produits paginés', async () => {
    const res = await makeRequest('/api/v1/products?limit=5');
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    const prods = res.body.data;
    if (!Array.isArray(prods) || prods.length !== 5) throw new Error(`Nb produits: ${prods?.length}`);
    if (!res.body.pagination || res.body.pagination.total < 16) throw new Error('Pagination absente ou incorrecte');
  });

  // 4. Products Filter by Category
  await test('GET /api/v1/products?category=textile filtre correctement', async () => {
    const res = await makeRequest('/api/v1/products?category=textile');
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    const prods = res.body.data;
    if (!prods.every(p => p.categorySlug === 'textile' || p.category_slug === 'textile')) {
      throw new Error('Filtrage de catégorie non respecté');
    }
  });

  // 5. Auth Login
  let adminToken = '';
  await test('POST /api/v1/auth/login réussit avec identifiants valides', async () => {
    const res = await makeRequest('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: 'admin@havaglobaltrade.com',
        password: 'HavaAdmin2026!'
      }
    });
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}: ${JSON.stringify(res.body)}`);
    adminToken = res.body.data.token;
    if (!adminToken) throw new Error('Token JWT manquant');
  });

  // 6. Auth Me (Protected)
  await test('GET /api/v1/auth/me avec token JWT retourne le profil admin', async () => {
    const res = await makeRequest('/api/v1/auth/me', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    if (!res.body.data.admin || res.body.data.admin.email !== 'admin@havaglobaltrade.com') {
      throw new Error('Profil admin invalide');
    }
  });

  // 7. Submit Inquiry
  let createdInquiryId = null;
  await test('POST /api/v1/inquiries enregistre un nouveau devis', async () => {
    const res = await makeRequest('/api/v1/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Test Entreprise Partner NestJS',
        email: 'test.partner@example.com',
        phone: '+90 555 123 45 67',
        company: 'Global Trade Partner SA',
        country: 'Turquie',
        subject: 'Demande de cotation test automatisé NestJS',
        categorySlug: 'alimentaire',
        message: 'Ceci est un test automatisé de validation de devis B2B NestJS.'
      }
    });
    if (res.statusCode !== 201) throw new Error(`Code ${res.statusCode}: ${JSON.stringify(res.body)}`);
    createdInquiryId = res.body.data.inquiry_id || res.body.data.inquiry?.id;
  });

  // 8. Stats Dashboard (Protected)
  await test('GET /api/v1/stats/dashboard retourne les KPIs complets', async () => {
    const res = await makeRequest('/api/v1/stats/dashboard', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    const kpis = res.body.data.kpis;
    if (kpis.totalProducts < 16 || kpis.totalCategories < 4) {
      throw new Error('KPIs incorrects');
    }
  });

  // 9. Export CSV (Protected)
  await test('GET /api/v1/inquiries/export/csv retourne un flux CSV', async () => {
    const res = await makeRequest('/api/v1/inquiries/export/csv', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.statusCode !== 200) throw new Error(`Code ${res.statusCode}`);
    if (!res.headers['content-type']?.includes('text/csv')) throw new Error('Content-Type non CSV');
  });

  // 10. Update Inquiry Status & Delete
  await test('PATCH & DELETE /api/v1/inquiries/:id met à jour puis supprime le devis test', async () => {
    if (!createdInquiryId) throw new Error('ID devis manquant');
    const updateRes = await makeRequest(`/api/v1/inquiries/${createdInquiryId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: { status: 'in_progress', notes: 'En cours de validation test NestJS' }
    });
    if (updateRes.statusCode !== 200) throw new Error(`Update code ${updateRes.statusCode}`);

    const delRes = await makeRequest(`/api/v1/inquiries/${createdInquiryId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (delRes.statusCode !== 200) throw new Error(`Delete code ${delRes.statusCode}`);
  });

  console.log(`\n📊 Bilan des tests : ${passed} réussis, ${failed} échoués sur ${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
