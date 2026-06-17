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
  console.log('[SSH] Conectado para atualizar a página principal...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const localFile = path.join(process.cwd(), 'src/app/page.tsx');
    const remoteFile = '/var/www/frontend/src/app/page.tsx';

    console.log(`[SFTP] Fazendo upload de ${localFile} para ${remoteFile}...`);
    sftp.fastPut(localFile, remoteFile, (err) => {
      if (err) throw err;
      console.log('[SFTP] Upload concluído!');

      console.log('[SSH] Executando build no frontend...');
      conn.exec('cd /var/www/frontend && npm run build && pm2 restart globalpharmahuman-frontend', (err, stream) => {
        if (err) throw err;
        stream.on('data', data => process.stdout.write(data.toString()));
        stream.stderr.on('data', data => process.stderr.write(`[ERR] ${data}`));
        stream.on('close', (code) => {
          console.log(`\n[Build] Processo concluído com código ${code}.`);
          conn.end();
        });
      });
    });
  });
}).on('error', err => {
  console.error('[SSH] Erro:', err);
}).connect(config);
