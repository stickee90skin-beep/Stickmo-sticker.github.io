const { createServer } = require('node:http');
const { readFile, writeFile } = require('node:fs/promises');
const { extname, isAbsolute, join, relative, resolve, sep } = require('node:path');
const nodemailer = require('nodemailer');

const siteRoot = resolve(__dirname, '..');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

/* ================= Mail Data & State ================= */
const MAIL_DATA_PATH = join(__dirname, 'data', 'mail.json');
const MAIL_STATE_PATH = join(siteRoot, 'state', 'mail.json');

// Load mail configuration from backend/data/mail.json
const mailConfig = JSON.parse(require('node:fs').readFileSync(MAIL_DATA_PATH, 'utf-8'));

// Environment variables still override the JSON config when set
const GMAIL_USER = process.env.GMAIL_USER || mailConfig.sender.user;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || mailConfig.sender.appPassword;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || mailConfig.receiver;

const transporter = nodemailer.createTransport({
  service: mailConfig.sender.service || 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

/* ================= State Persistence ================= */
let mailState;
try {
  mailState = JSON.parse(require('node:fs').readFileSync(MAIL_STATE_PATH, 'utf-8'));
} catch {
  mailState = { inquiries: [], stats: { totalSent: 0, lastSentAt: null } };
}

async function saveMailState() {
  await writeFile(MAIL_STATE_PATH, JSON.stringify(mailState, null, 2), 'utf-8');
}

/* ================= Helpers ================= */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    request.on('error', reject);
  });
}

/* ================= Server ================= */
const server = createServer(async (request, response) => {

  /* --- CORS preflight --- */
  if (request.method === 'OPTIONS') {
    response.writeHead(204, corsHeaders());
    response.end();
    return;
  }

  /* --- Health check --- */
  if (request.url === '/api/health' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  /* --- Inquiry endpoint (POST) --- */
  if (request.url === '/api/inquiry' && request.method === 'POST') {
    try {
      const body = await readBody(request);

      // Validate required fields (driven by backend/data/mail.json)
      const required = mailConfig.requiredFields;
      const missing = required.filter(f => !body[f] || !body[f].trim());
      if (missing.length) {
        response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() });
        response.end(JSON.stringify({ success: false, error: `Missing required fields: ${missing.join(', ')}` }));
        return;
      }

      // Check email config
      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('Email not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
        response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() });
        response.end(JSON.stringify({ success: false, error: 'Email service is not configured on the server.' }));
        return;
      }

      // Template values from backend/data/mail.json
      const tpl = mailConfig.template;
      const c = tpl.colors;

      // Build the email using template config
      const mailOptions = {
        from: `"${body.name}" <${GMAIL_USER}>`,
        replyTo: body.email,
        to: RECEIVER_EMAIL,
        subject: `${tpl.subjectPrefix}: ${body.service} — from ${body.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: ${c.background}; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd}); color: #fff; padding: 32px 28px;">
              <h1 style="margin: 0; font-size: 22px;">${tpl.heading}</h1>
              <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">${tpl.tagline}</p>
            </div>
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr><td style="padding: 10px 0; color: ${c.textMuted}; width: 130px;">Name</td><td style="padding: 10px 0; font-weight: 600;">${body.name}</td></tr>
                <tr><td style="padding: 10px 0; color: ${c.textMuted};">Company</td><td style="padding: 10px 0;">${body.company || '—'}</td></tr>
                <tr><td style="padding: 10px 0; color: ${c.textMuted};">Email</td><td style="padding: 10px 0;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: ${c.textMuted};">Phone</td><td style="padding: 10px 0;">${body.phone || '—'}</td></tr>
                <tr><td style="padding: 10px 0; color: ${c.textMuted};">Country</td><td style="padding: 10px 0;">${body.country || '—'}</td></tr>
                <tr style="background: #f0f0f0;"><td style="padding: 10px; color: ${c.textMuted};">Service</td><td style="padding: 10px; font-weight: 600;">${body.service}</td></tr>
                <tr><td style="padding: 10px 0; color: ${c.textMuted};">Budget</td><td style="padding: 10px 0;">${body.budget}</td></tr>
                <tr><td style="padding: 10px 0; color: ${c.textMuted};">Timeline</td><td style="padding: 10px 0;">${body.timeline}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px; border-left: 4px solid ${c.accent};">
                <p style="margin: 0 0 6px; color: ${c.textMuted}; font-size: 13px;">Project Description</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6;">${body.message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="margin-top: 24px; font-size: 13px; color: ${c.textLight};">${tpl.footer}</p>
            </div>
          </div>
        `
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      // Save inquiry to state/mail.json
      const now = new Date().toISOString();
      const entry = {
        id: `inq_${Date.now()}`,
        ...body,
        sentAt: now,
        emailStatus: 'sent'
      };
      mailState.inquiries.push(entry);
      mailState.stats.totalSent += 1;
      mailState.stats.lastSentAt = now;
      await saveMailState();

      console.log(`✅ Inquiry email sent to ${RECEIVER_EMAIL} from ${body.name} (${body.email})`);
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() });
      response.end(JSON.stringify({ success: true, message: 'Inquiry sent successfully!' }));

    } catch (error) {
      console.error('❌ Failed to process inquiry:', error);
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() });
      response.end(JSON.stringify({ success: false, error: 'Failed to send inquiry. Please try again later.' }));
    }
    return;
  }


  /* --- Static file serving (GET / HEAD only) --- */
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD, POST, OPTIONS' });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'https://stickee90skin-beep.github.io/portfolio-romanshu.github.io/#/freelance').pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const relativePath = pathname.replace(/^[/\\]+/, '') || 'index.html';
  if (relativePath !== 'index.html' && !relativePath.startsWith('frontend/')) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  const filePath = resolve(siteRoot, relativePath);
  const relativeToRoot = relative(siteRoot, filePath);
  if (relativeToRoot === '..' || relativeToRoot.startsWith('..' + sep) || isAbsolute(relativeToRoot)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    console.error('Failed to serve site file:', error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Portfolio server listening on port ${port}`);
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Email is NOT configured. Set the GMAIL_APP_PASSWORD environment variable.');
    console.warn('   Example: set GMAIL_APP_PASSWORD=abcd efgh ijkl mnop');
  } else {
    console.log(`📧 Email configured: inquiries will be sent to ${RECEIVER_EMAIL}`);
  }
});
