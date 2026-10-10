const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, isAbsolute, relative, resolve, sep } = require('node:path');
const nodemailer = require('nodemailer');

const frontendRoot = resolve(__dirname, '..', 'frontend');
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

/* ================= Email Configuration ================= */
// Set this environment variable before starting the server:
//   GMAIL_APP_PASSWORD — a 16-char App Password from https://myaccount.google.com/apppasswords
//   GMAIL_USER        — (optional) defaults to manasdabhade12@gmail.com
//   RECEIVER_EMAIL    — (optional) defaults to manasdabhade12@gmail.com
const GMAIL_USER = process.env.GMAIL_USER || 'manasdabhade12@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'ybdo clyy ejcj ujqg';
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'manasdabhade12@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

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

      // Validate required fields
      const required = ['name', 'email', 'service', 'budget', 'timeline', 'message'];
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

      // Build the email
      const mailOptions = {
        from: `"${body.name}" <${GMAIL_USER}>`,
        replyTo: body.email,
        to: RECEIVER_EMAIL,
        subject: `New Inquiry: ${body.service} — from ${body.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0f2027, #2c5364); color: #fff; padding: 32px 28px;">
              <h1 style="margin: 0; font-size: 22px;">🎨 New Project Inquiry</h1>
              <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Someone wants to work with you!</p>
            </div>
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr><td style="padding: 10px 0; color: #888; width: 130px;">Name</td><td style="padding: 10px 0; font-weight: 600;">${body.name}</td></tr>
                <tr><td style="padding: 10px 0; color: #888;">Company</td><td style="padding: 10px 0;">${body.company || '—'}</td></tr>
                <tr><td style="padding: 10px 0; color: #888;">Email</td><td style="padding: 10px 0;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: #888;">Phone</td><td style="padding: 10px 0;">${body.phone || '—'}</td></tr>
                <tr><td style="padding: 10px 0; color: #888;">Country</td><td style="padding: 10px 0;">${body.country || '—'}</td></tr>
                <tr style="background: #f0f0f0;"><td style="padding: 10px; color: #888;">Service</td><td style="padding: 10px; font-weight: 600;">${body.service}</td></tr>
                <tr><td style="padding: 10px 0; color: #888;">Budget</td><td style="padding: 10px 0;">${body.budget}</td></tr>
                <tr><td style="padding: 10px 0; color: #888;">Timeline</td><td style="padding: 10px 0;">${body.timeline}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px; border-left: 4px solid #2c5364;">
                <p style="margin: 0 0 6px; color: #888; font-size: 13px;">Project Description</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6;">${body.message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="margin-top: 24px; font-size: 13px; color: #aaa;">This inquiry was sent from your Romanshu portfolio website.</p>
            </div>
          </div>
        `
      };

      // Send the email
      await transporter.sendMail(mailOptions);

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
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const relativePath = pathname.replace(/^[/\\]+/, '') || 'index.html';
  const filePath = resolve(frontendRoot, relativePath);
  const relativeToRoot = relative(frontendRoot, filePath);
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

    console.error('Failed to serve frontend asset:', error);
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
