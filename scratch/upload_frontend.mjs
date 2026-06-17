import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();

const config = {
  host: '2.25.186.209',
  port: 22,
  username: 'root',
  password: '5iMbO&Ajp6QAH2CW',
  readyTimeout: 180000
};

conn.on('ready', () => {
  console.log('[SSH] Conectado. Iniciando SFTP para o frontend...');
  conn.sftp(async (err, sftp) => {
    if (err) throw err;

    const filesToUpload = [
      { local: 'public/favicon.ico', remote: '/var/www/frontend/public/favicon.ico' },
      { local: 'public/favicon-96x96.png', remote: '/var/www/frontend/public/favicon-96x96.png' },
      { local: 'public/favicon.svg', remote: '/var/www/frontend/public/favicon.svg' },
      { local: 'public/apple-touch-icon.png', remote: '/var/www/frontend/public/apple-touch-icon.png' },
      { local: 'public/site.webmanifest', remote: '/var/www/frontend/public/site.webmanifest' },
      { local: 'public/web-app-manifest-192x192.png', remote: '/var/www/frontend/public/web-app-manifest-192x192.png' },
      { local: 'public/web-app-manifest-512x512.png', remote: '/var/www/frontend/public/web-app-manifest-512x512.png' },
      { local: 'src/app/layout.tsx', remote: '/var/www/frontend/src/app/layout.tsx' }
    ];

    try {
      for (const file of filesToUpload) {
        const localPath = path.join(process.cwd(), file.local);
        if (fs.existsSync(localPath)) {
          console.log(`[SFTP] Fazendo upload de ${localPath} para ${file.remote}...`);
          await new Promise((resolve, reject) => {
            sftp.fastPut(localPath, file.remote, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        } else {
          console.log(`[SFTP] Arquivo local não encontrado: ${localPath}`);
        }
      }

      console.log('[SFTP] Upload concluído!');

      console.log('[SSH] Executando build no frontend...');
      conn.exec('cd /var/www/frontend && npm run build && pm2 restart globalpharmahuman-frontend', (err, stream) => {
        if (err) throw err;
        stream.on('data', data => process.stdout.write(data.toString()));
        stream.stderr.on('data', data => process.stderr.write(`[ERR] ${data}`));
        stream.on('close', (code) => {
          console.log(`\n[Build] Processo de build e restart concluído com código ${code}.`);
          conn.end();
        });
      });
    } catch (e) {
      console.error('[SFTP] Erro durante o upload:', e);
      conn.end();
    }
  });
}).on('error', err => {
  console.error('[SSH] Erro:', err);
}).connect(config);
