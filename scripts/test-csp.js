import http from 'http'
import https from 'https'
import chalk from 'chalk'

const ENDPOINTS = [
  '/',
  '/venues',
  '/profile',
  '/api/venues',
  'https://api.mapbox.com/styles/v1/mapbox/streets-v11',
  'https://fonts.googleapis.com/css2',
  'https://fonts.gstatic.com',
]

const TEST_RESOURCES = [
  { type: 'script-src', url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11' },
  { type: 'img-src', url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11' },
  { type: 'connect-src', url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11' }
];

async function testEndpoint(urlStr) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const client = url.protocol === 'https:' ? https : http;
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET'
      };

      client.request(options, (res) => {
        const cspHeader = res.headers['content-security-policy'];
        const response = {
          url: urlStr,
          hasCSP: !!cspHeader,
          policies: cspHeader ? parseCspHeader(cspHeader) : null
        };
        resolve(response);
      }).on('error', (error) => {
        resolve({
          url: urlStr,
          hasCSP: false,
          error: error.message || 'Unknown error'
        });
      }).end();
    } catch (error) {
      resolve({
        url: urlStr,
        hasCSP: false,
        error: error.message || 'Unknown error'
      });
    }
  });
}

function parseCspHeader(header) {
  const policies = {}
  header.split(';').forEach(policy => {
    const [directive, ...sources] = policy.trim().split(/\s+/)
    policies[directive] = sources
  })
  return policies
}

function testResourceAgainstPolicy(policies, resource) {
  if (!policies) return null;
  
  const { type, url } = resource;
  const policy = policies[type];
  
  if (!policy) return null;
  
  // Check if URL matches any policy directive
  return policy.some(directive => {
    if (directive === '*') return true;
    if (directive === "'none'") return false;
    if (directive === "'self'" && url.startsWith(process.env.NEXT_PUBLIC_URL)) return true;
    return url.startsWith(directive);
  });
}

async function runTests() {
  console.log(chalk.blue('🔒 Testing Content Security Policy\n'));

  for (const endpoint of ENDPOINTS) {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const fullUrl = endpoint.startsWith('http') ? endpoint : new URL(endpoint, baseUrl).toString();
    
    const response = await testEndpoint(fullUrl);
    
    if (response.error) {
      console.log(chalk.red(`✗ Error testing ${endpoint}: ${response.error}`));
      continue;
    }
    
    if (!response.hasCSP) {
      console.log(chalk.yellow(`⚠️  ${endpoint}: No CSP headers found (this is normal in development)`));
      continue;
    }

    console.log(chalk.green(`✓ Testing ${endpoint}`));
    
    for (const resource of TEST_RESOURCES) {
      const result = testResourceAgainstPolicy(response.policies, resource);
      if (result === null) {
        console.log(chalk.yellow(`  ⚠️  Cannot test ${resource.type} (no CSP headers)`));
      } else if (result) {
        console.log(chalk.green(`  ✓ ${resource.type} allows ${resource.url}`));
      } else {
        console.log(chalk.red(`  ✗ ${resource.type} blocks ${resource.url}`));
      }
    }
  }
}

runTests().catch(console.error) 