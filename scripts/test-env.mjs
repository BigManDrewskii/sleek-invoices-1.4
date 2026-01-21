import 'dotenv/config';

console.log('Checking required environment variables...\n');

const required = ['DATABASE_URL', 'JWT_SECRET', 'AUTH_SECRET'];
const missing = [];

required.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const masked = varName.includes('SECRET') || varName.includes('PASSWORD') || varName.includes('TOKEN')
      ? '✓ Set (hidden)'
      : value;
    console.log(`✅ ${varName}: ${masked.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    missing.push(varName);
  }
});

if (missing.length > 0) {
  console.log(`\n⚠️  Missing ${missing.length} required variables`);
  process.exit(1);
}

console.log('\n✅ All required variables are set!');
