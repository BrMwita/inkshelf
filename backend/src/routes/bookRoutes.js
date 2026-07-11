const express = require('express');
const router = express.Router();

// Placeholder - will add later
router.get('/', (req, res) => res.json({ message: 'Books route' }));

module.exports = router;
EOF

cat > src/routes/orderRoutes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Orders route' }));

module.exports = router;
EOF

cat > src/routes/reviewRoutes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Reviews route' }));

module.exports = router;
EOF

cat > src/routes/adminRoutes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Admin route' }));

module.exports = router;
