let currentUser = JSON.parse(localStorage.getItem('mindspace_user')) || null;
let moods = JSON.parse(localStorage.getItem('mindspace_moods')) || [];
let appointments = JSON.parse(localStorage.getItem('mindspace_appointments')) || [];
const therapistOptions = [
  { name: 'Dr. Aisha Mwangi', pic: 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg' },
  { name: 'Dr. Juma Otieno', pic: 'https://images.pexels.com/photos/5691717/pexels-photo-5691717.jpeg' },
  { name: 'Dr. Fatuma Ali', pic: 'https://images.pexels.com/photos/7746658/pexels-photo-7746658.jpeg' }
];

function openModal(modalId) { document.getElementById(modalId).style.display = 'block'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
  // Nav triggers
  document.getElementById('loginBtn')?.addEventListener('click', (e) => { e.preventDefault(); openModal('loginModal'); });
  document.getElementById('signupBtn')?.addEventListener('click', (e) => { e.preventDefault(); openModal('signupModal'); });

  // Login form (BetterHelp style with validation/loading)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const submitBtn = document.querySelector('.login-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const loading = submitBtn.querySelector('.loading');
      const emailError = document.getElementById('emailError');
      const passwordError = document.getElementById('passwordError');

      // Validation
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        emailError.classList.remove('hidden');
        return;
      }
      if (password.length < 6) {
        passwordError.classList.remove('hidden');
        return;
      }
      emailError.classList.add('hidden');
      passwordError.classList.add('hidden');

      // Loading
      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      loading.classList.remove('hidden');

      // Simulate API (1s delay)
      setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem('mindspace_user'));
        if (storedUser && storedUser.email === email) {
          alert('Login successful! Welcome back.');
          closeModal('loginModal');
          window.location.href = 'dashboard.html';
        } else {
          alert('Invalid credentials. Try signing up.');
        }
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        loading.classList.add('hidden');
      }, 1500);
    });
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      if (name && email && password.length >= 6) {
        currentUser = { name, email };
        localStorage.setItem('mindspace_user', JSON.stringify(currentUser));
        closeModal('signupModal');
        alert(`Welcome, ${name}! Redirecting to dashboard.`);
        window.location.href = 'dashboard.html';
      } else {
        alert('Please fill all fields correctly.');
      }
    });
  }

  // Dashboard load
  if (window.location.pathname.includes('dashboard.html')) {
    if (!currentUser) window.location.href = 'index.html';
    else loadDashboard();
  }

  // Outside click to close modals
  window.onclick = (e) => {
    if (e.target.classList.contains('modal')) closeModal(e.target.id);
  };
});

function loadDashboard() {
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;

  // Random therapist
  const therapist = therapistOptions[Math.floor(Math.random() * therapistOptions.length)];
  document.getElementById('therapistName').textContent = therapist.name;
  document.getElementById('therapistPic').src = therapist.pic;

  // Profile pic from storage
  document.getElementById('profilePic').src = localStorage.getItem('profile_pic') || 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg';

  loadAppointments();
  renderChart();
}

function changeProfilePic() {
  const pics = [
    'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg',
    'https://images.pexels.com/photos/5691717/pexels-photo-5691717.jpeg',
    'https://images.pexels.com/photos/7746658/pexels-photo-7746658.jpeg'
  ];
  const newPic = pics[Math.floor(Math.random() * pics.length)];
  document.getElementById('profilePic').src = newPic;
  localStorage.setItem('profile_pic', newPic);
  alert('Profile picture updated!');
}

function bookAppointment() { addAppointment(); }
function addAppointment() {
  const date = prompt('Enter date (YYYY-MM-DD):');
  if (date && !isNaN(Date.parse(date))) {
    appointments.push({ date, therapist: document.getElementById('therapistName').textContent });
    localStorage.setItem('mindspace_appointments', JSON.stringify(appointments));
    loadAppointments();
    alert('Appointment added!');
  } else {
    alert('Invalid date. Use YYYY-MM-DD format.');
  }
}
function loadAppointments() {
  const list = document.getElementById('appointmentList');
  list.innerHTML = appointments.map(apt => `<li>${apt.date} with ${apt.therapist}</li>`).join('') || '<li>No appointments yet. Add one!</li>';
}

function logMood() {
  const moods = ['happy', 'calm', 'okay', 'sad', 'anxious'];
  const mood = prompt('How are you feeling? (' + moods.join('/') + ')');
  if (moods.includes(mood)) {
    moodsData.push({ mood, value: {happy:5,calm:4,okay:3,sad:2,anxious:1}[mood], date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('mindspace_moods', JSON.stringify(moodsData));
    renderChart();
    alert('Mood logged! Great job tracking.');
  }
}

let moodsData = moods; // Global for chart
function renderChart() {
  const ctx = document.getElementById('moodChart')?.getContext('2d');
  if (ctx && moodsData.length > 0) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodsData.slice(-7).map(m => m.date.slice(5,10)),
        datasets: [{
          label: 'Mood Level',
          data: moodsData.slice(-7).map(m => m.value),
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: { scales: { y: { min: 0, max: 5 } } }
    });
  }
}

function writeJournal() {
  const entry = prompt('Write your journal entry...');
  if (entry) alert('Entry saved privately.');
}

function breathingExercise() {
  alert('Guided Breathing: Inhale 4s, Hold 4s, Exhale 6s. Repeat 5 times. You got this!');
}

function forgotPassword(e) {
  e.preventDefault();
  const email = prompt('Enter email for reset:');
  if (email) alert(`Reset link sent to ${email}. Check your inbox!`);
}

function toggleToSignup(e) {
  e.preventDefault();
  closeModal('loginModal');
  openModal('signupModal');
}

function logout() {
  if (confirm('Log out?')) {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}
