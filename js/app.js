let currentUser = JSON.parse(localStorage.getItem('mindspace_user')) || null;
let moodsData = JSON.parse(localStorage.getItem('mindspace_moods')) || [];
let appointments = JSON.parse(localStorage.getItem('mindspace_appointments')) || [];
let verificationCode = '';

const therapistOptions = [
  { name: 'Dr. Aisha Mwangi', pic: 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg' },
  { name: 'Dr. Juma Otieno', pic: 'https://images.pexels.com/photos/5691717/pexels-photo-5691717.jpeg' },
  { name: 'Dr. Fatuma Ali', pic: 'https://images.pexels.com/photos/7746658/pexels-photo-7746658.jpeg' }
];

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();

  if (path === 'dashboard.html') {
    if (!currentUser) return window.location.href = 'login.html';
    loadDashboard();
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const btn = loginForm.querySelector('.login-btn');
      const btnText = btn.querySelector('.btn-text');
      const loading = btn.querySelector('.loading');

      const users = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('mindspace_user', JSON.stringify({ name: user.name, email: user.email }));
        alert('Welcome back, ' + user.name + '!');
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid email or password.');
      }
    });
  }

  // Signup
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    sendCodeBtn.addEventListener('click', () => {
      const email = document.getElementById('signupEmail').value.trim();
      if (!email || !/\S+@\S+\.\S+/.test(email)) return alert('Enter valid email');
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`%cCODE: ${verificationCode}`, 'background:#10b981;color:white;font-size:18px;padding:10px');
      alert('Code sent! Check browser console (F12)');
      sendCodeBtn.disabled = true;
      sendCodeBtn.textContent = 'Sent!';
      document.getElementById('verificationCode').disabled = false;
      document.getElementById('codeSent').classList.remove('hidden');
    });

    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('confirmPassword').value;
      const code = document.getElementById('verificationCode').value;

      if (password !== confirm) return alert('Passwords do not match');
      if (code !== verificationCode) return alert('Wrong verification code');

      let users = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
      if (users.some(u => u.email === email)) return alert('Email already registered');

      users.push({ name, email, password });
      localStorage.setItem('mindspace_users', JSON.stringify(users));
      localStorage.setItem('mindspace_user', JSON.stringify({ name, email }));
      alert('Account created! Welcome ' + name);
      window.location.href = 'dashboard.html';
    });
  }
});

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem('mindspace_user'));
  if (!user) return window.location.href = 'login.html';

  document.getElementById('userName').textContent = user.name;
  document.getElementById('headerName').textContent = user.name.split(' ')[0];
  const pic = localStorage.getItem('profile_pic') || 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg';
  document.getElementById('headerPic').src = pic;
  // ... rest of your dashboard load code
  // Load user data into header + modal
function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem('mindspace_user'));
  if (!user) return window.location.href = 'login.html';

  const pic = localStorage.getItem('profile_pic') || 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg';
  const username = localStorage.getItem('user_username') || '@' + user.name.toLowerCase().replace(' ', '');

  document.getElementById('headerName').textContent = user.name.split(' ')[0];
  document.getElementById('headerUsername').textContent = username;
  document.getElementById('headerPic').src = pic;
  document.getElementById('modalPicPreview').src = pic;

  // Fill modal fields
  document.getElementById('editName').value = user.name;
  document.getElementById('editUsername').value = username;
  document.getElementById('editPhone').value = user.phone || '';
}

// Toggle dropdown
function toggleDropdown() {
  document.getElementById('dropdownMenu').classList.toggle('show');
}

// Open/Close Edit Modal
function openEditModal() {
  document.getElementById('editProfileModal').style.display = 'flex';
  loadUserProfile();
}
function closeEditModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}

// Change profile picture
function changePic(url) {
  localStorage.setItem('profile_pic', url);
  document.getElementById('modalPicPreview').src = url;
  document.getElementById('headerPic').src = url;
}

function saveProfileChanges() {
  const newName = document.getElementById('editName').value.trim();
  const rawUsername = document.getElementById('editUsername').value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const newUsername = '@' + rawUsername;
  const newPhone = document.getElementById('editPhone').value.trim();

  if (!newName || rawUsername.length < 3) {
    alert('Name and username (min 3 chars) are required');
    return;
  }

  // CHECK IF USERNAME IS ALREADY TAKEN
  const allUsers = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('mindspace_user'));
  const oldUsername = localStorage.getItem('user_username') || '';

  const usernameTaken = allUsers.some(u => 
    (localStorage.getItem('user_username') || '@' + u.email.split('@')[0]) === newUsername &&
    u.email !== currentUser.email
  );

  if (usernameTaken && oldUsername !== newUsername) {
    alert('Sorry, @' + rawUsername + ' is already taken. Choose another!');
    return;
  }

  // Save updated user
  currentUser.name = newName;
  currentUser.phone = newPhone;

  // Update in all users list
  const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
  if (userIndex !== -1) allUsers[userIndex] = { ...allUsers[userIndex], name: newName, phone: newPhone };

  localStorage.setItem('mindspace_user', JSON.stringify(currentUser));
  localStorage.setItem('mindspace_users', JSON.stringify(allUsers));
  localStorage.setItem('user_username', newUsername);

  alert(`Profile updated! Your new username is ${newUsername}`);
  closeEditModal();
  loadUserProfile();
  setTimeout(() => location.reload(), 800);
}

function loadDashboard() {
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;
  document.getElementById('profilePic').src = localStorage.getItem('profile_pic') || 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg';

  const therapist = therapistOptions[Math.floor(Math.random() * therapistOptions.length)];
  document.getElementById('therapistName').textContent = therapist.name;
  document.getElementById('therapistPic').src = therapist.pic;

  loadAppointments();
  renderChart();
  if (localStorage.getItem('premium_user') === 'true') {
    document.querySelector('.greeting h1').innerHTML += ' <span style="background:#10b981;color:white;padding:4px 12px;border-radius:20px;font-size:0.5em;">PREMIUM</span>';
  }
}

function changeProfilePic() {
  const pics = ['https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg', 'https://images.pexels.com/photos/5691717/pexels-photo-5691717.jpeg', 'https://images.pexels.com/photos/7746658/pexels-photo-7746658.jpeg'];
  const newPic = pics[Math.floor(Math.random() * pics.length)];
  document.getElementById('profilePic').src = newPic;
  localStorage.setItem('profile_pic', newPic);
}

function addAppointment() {
  const date = prompt('Enter date (YYYY-MM-DD):');
  if (date && !isNaN(Date.parse(date))) {
    appointments.push({ date, therapist: document.getElementById('therapistName').textContent });
    localStorage.setItem('mindspace_appointments', JSON.stringify(appointments));
    loadAppointments();
  }
}

function loadAppointments() {
  const list = document.getElementById('appointmentList');
  list.innerHTML = appointments.map(a => `<li>${a.date} with ${a.therapist}</li>`).join('') || '<li>No appointments yet</li>';
}

function logMood() {
  const mood = prompt('How are you feeling? (happy/calm/okay/sad/anxious)');
  const values = {happy:5, calm:4, okay:3, sad:2, anxious:1};
  if (values[mood]) {
    moodsData.push({ mood, value: values[mood], date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('mindspace_moods', JSON.stringify(moodsData));
    renderChart();
  }
}

function renderChart() {
  const ctx = document.getElementById('moodChart')?.getContext('2d');
  if (ctx && moodsData.length > 0) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodsData.slice(-7).map(m => m.date.slice(5,10)),
        datasets: [{ label: 'Mood', data: moodsData.slice(-7).map(m => m.value), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.2)', tension: 0.4, fill: true }]
      },
      options: { scales: { y: { min: 0, max: 5 } } }
    });
  }
}

function openChat() {
  document.getElementById('chatModal').style.display = 'flex';
  document.getElementById('chatTherapistName').textContent = document.getElementById('therapistName').textContent;
  document.getElementById('chatTherapistPic').src = document.getElementById('therapistPic').src;
  loadChat();
}

function closeChat() { document.getElementById('chatModal').style.display = 'none'; }

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  messages.push({ text: msg, from: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
  localStorage.setItem('chat_messages', JSON.stringify(messages));
  input.value = '';
  loadChat();

  setTimeout(() => {
    const replies = ["I'm here for you.", "That sounds tough.", "You're not alone.", "How does that make you feel?", "You've got this."];
    messages.push({ text: replies[Math.floor(Math.random() * replies.length)], from: 'therapist', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    loadChat();
  }, 2000);
}

function loadChat() {
  const container = document.getElementById('chatMessages');
  const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  container.innerHTML = messages.map(m => `<div class="message ${m.from}"><small>${m.time}</small><br>${m.text}</div>`).join('');
  container.scrollTop = container.scrollHeight;
}

function payWithMpesa() {
  const phone = prompt('Enter M-PESA number (07xxxxxxxx):');
  if (!/^07\d{8}$/.test(phone)) return alert('Invalid number');
  alert('Sending STK Push...');
  setTimeout(() => {
    if (confirm('Complete payment on phone?')) {
      localStorage.setItem('premium_user', 'true');
      alert('Payment successful! You\'re now Premium!');
      location.reload();
    }
  }, 8000);
}

function writeJournal() { const entry = prompt('Write your journal...'); if (entry) alert('Saved privately'); }
function breathingExercise() { alert('Inhale 4s → Hold 4s → Exhale 6s. Repeat 5 times.'); }
function forgotPassword(e) { e.preventDefault(); alert('Check your email for reset link'); }
function logout() { if (confirm('Log out?')) { localStorage.removeItem('mindspace_user'); window.location.href = 'index.html'; } }
// DARK MODE TOGGLE
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark_mode', isDark ? 'enabled' : 'disabled');
  
  // Update icon (optional)
  const menuItem = event.target;
  menuItem.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

// Load dark mode preference on start
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('dark_mode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }
  loadUserProfile(); // your existing function
});
