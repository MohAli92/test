const axios = require('axios');

async function createUser() {
  try {
    const userData = {
      firebaseUid: 'GmlYkdW0PfZHpm6OGQEYCsTpnIi2',
      email: 'hesham+test2@gmail.com',
      firstName: 'Hesham',
      lastName: 'Elmogy',
      gender: 'prefer-not-to-say'
    };

    const response = await axios.post('http://localhost:5000/api/users/profile', userData);
    console.log('User created successfully:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
  }
}

createUser(); 