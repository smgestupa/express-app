import express from 'express';
const app = express();

export const handler = async(event) => {
  try {
    const res = await fetch("/");
    console.info("status", res.status);
    const { data } = res.json();
    return data;
  } catch (error) {
    console.error(error);
    return 500;
  }
};

app.get('/', (req, res) => {
  res.send('<h1>Hello World! And World!</h1>')
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})