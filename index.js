const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'https://cookies-zuip.vercel.app',  // Frontend URL
  methods: 'GET, POST',
  credentials: true,                          // Allow cookies
}));

app.post('/setCookie', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username, {
    httpOnly: true,
    maxAge: 1 * 60 * 60 * 1000,  // 1 hour
    secure: true,                 // Only sent over HTTPS
    sameSite: 'None',             // Cross-origin requests allowed
  });
  res.status(200).json({ message: 'Cookie set successfully' });
});

app.get('/getCookie', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.status(200).json({ username });
  } else {
    res.status(404).json({ message: 'Cookie not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
