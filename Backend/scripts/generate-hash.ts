import * as bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'Admin123'; // your desired password
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
}

generateHash();
