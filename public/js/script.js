document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        alert('Login successful!');
        // Optionally, redirect to another page
    } else {
        alert(data.msg || 'Login failed!');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (data.token) {
        alert('Registration successful!');
        // Optionally, redirect to login page
    } else {
        alert(data.msg || 'Registration failed!');
    }
});
