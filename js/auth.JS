window.onload = function () {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        updateNavbarForLoggedInUser(user.name);
        if (window.location.pathname.toLowerCase().includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
};

function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const mobile = document.getElementById("regMobile").value;
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !password || !mobile) {
        alert('All Fields Are Required...');
        return;
    }
    const user = { name, email, password, mobile };
    localStorage.setItem(email, JSON.stringify(user));
    alert('User Registered Successfully! Now you can Login!');
    window.location.href = 'login.html';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('logPassword').value;
    const user = JSON.parse(localStorage.getItem(email));
    if (user && user.password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('User logged in successfully!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
}

function updateNavbarForLoggedInUser(name) {
    const authButtons = document.getElementById("authButtons");
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn btn-primary bi bi-person">${name}</button>
            <button class="btn btn-danger" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}
