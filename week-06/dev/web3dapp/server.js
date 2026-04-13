const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Chain config endpoint
app.get('/api/chains', (req, res) => {
  res.json({
    eth: { name: 'Ethereum', chainId: 1, chainHex: '0x1', dstEid: 30101, native: 'ETH', color: '#627EEA', icon: '⟠' },
    bsc: { name: 'BSC', chainId: 56, chainHex: '0x38', dstEid: 30102, native: 'BNB', color: '#F0B90B', icon: '⬡' }
  });
});

app.listen(PORT, () => {
  console.log(`\n  ◈ Manual Bridge Server`);
  console.log(`  http://localhost:${PORT}\n`);
});
