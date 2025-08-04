const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./supabaseDB');

// Middleware
dotenv.config();
app.use(cors());
app.use(express.json());

// Main page
app.get('/', (req, res) => {
    console.log("Supabase URL: " + process.env.SUPABASE_URL + "\nSupabase Key: " + process.env.SUPABASE_KEY);
    res.send("Check terminal for Supabase credentials");
})

// Events
app.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*') // You can specify columns if needed

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*') // You can specify columns if needed

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todo', async (req, res) => {
  try {
    const { task, is_completed } = req.body;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task, is_completed }]);

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to insert todo' });
  }
})


app.listen(5000, () => {
    console.log("Server has started on port 5000 - http://localhost:5000/")
})