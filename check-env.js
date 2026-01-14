const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('Verificando .env.local...');

try {
    if (!fs.existsSync(envPath)) {
        console.error('❌ Error: El archivo .env.local no existe.');
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const env = {};

    lines.forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            if (key && !key.startsWith('#')) {
                env[key] = val;
            }
        }
    });

    const required = [
        { key: 'NEXT_PUBLIC_SUPABASE_URL', check: (v) => v.startsWith('https://'), msg: 'Debe empezar con https://' },
        { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', check: (v) => v.length > 20, msg: 'Parece muy corta' },
        { key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', check: (v) => v.length > 2, msg: 'Parece vacía' },
        { key: 'NEXT_PUBLIC_CLOUDINARY_API_KEY', check: (v) => /^\d+$/.test(v), msg: 'Debe ser numérica (usualmente)' },
        { key: 'CLOUDINARY_API_SECRET', check: (v) => v.length > 5, msg: 'Parece muy corta' }
    ];

    let errors = 0;

    required.forEach(({ key, check, msg }) => {
        if (!env[key]) {
            console.error(`❌ Faltante: ${key}`);
            errors++;
        } else {
            if (!check(env[key])) {
                console.warn(`⚠️ Advertencia en ${key}: ${msg}`);
            } else {
                console.log(`✅ ${key}: Presente y formato correcto`);
            }
        }
    });

    if (errors === 0) {
        console.log('\n✨ Todo parece correcto en .env.local');
    } else {
        console.log(`\n❌ Se encontraron ${errors} errores.`);
    }

} catch (err) {
    console.error('Error leyendo archivo:', err);
}
