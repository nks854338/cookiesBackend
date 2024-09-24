const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'https://cookies-zuip.vercel.app',
  methods: ['GET', 'POST'],                   
  credentials: true                          
}));

const isProduction = process.env.NODE_ENV === 'production';

app.post('/setCookie', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username, {
    httpOnly: true,     
    secure: isProduction,  
    sameSite: 'None',     
    maxAge: 12 * 60 * 60 * 1000, 
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

app.get('/response/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const cookieOptions = {
    maxAge: 12 * 60 * 60 * 1000,
    sameSite: 'None',
    secure: isProduction
  };

  switch (code) {
    case 200:
      res.cookie('status', 'OK', cookieOptions);
      res.status(200).json({ message: 'OK' });
      break;
    case 201:
      res.cookie('status', 'Created', cookieOptions);
      res.status(201).json({ message: 'Created' });
      break;
    case 400:
      res.cookie('status', 'Bad_Request', cookieOptions);
      res.status(400).json({ message: 'Bad_Request' });
      break;
    case 404:
      res.cookie('status', 'Not_Found', cookieOptions);
      res.status(404).json({ message: 'Not_Found' });
      break;
    case 500:
      res.cookie('status', 'Internal_Server_Error', cookieOptions);
      res.status(500).json({ message: 'Internal_Server_Error' });
      break;
    default:
      res.status(400).json({ message: 'Invalid_response_code' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
