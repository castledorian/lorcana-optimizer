const puppeteer = require('puppeteer');

async function fetchData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://inkdecks.com/meta', { waitUntil: 'networkidle2' });

    // Extraire les données du tableau (exemple)
    const archetypes = await page.evaluate(() => {
        const rows = document.querySelectorAll('table.meta-table tbody tr');
        return Array.from(rows).map(row => {
            const cols = row.querySelectorAll('td');
            return {
                name: cols[0]?.textContent.trim(),
                colors: cols[1]?.textContent.split('/').map(s => s.trim()),
                globalWinrate: parseFloat(cols[2]?.textContent),
                gamesPlayed: parseInt(cols[3]?.textContent.replace(/\D/g, ''))
            };
        });
    });

    await browser.close();
    return { archetypes };
}

module.exports = { fetchData };
