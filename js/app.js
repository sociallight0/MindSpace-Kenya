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

// Profile pictures available for selection
const profilePics = [
    'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5691717/pexels-photo-5691717.jpeg?auto=compress&cs=tinysrgb&w=400'
];

// User data
let user = {
    name: 'Aisha Mwangi',
    email: 'aisha@mindspace.co.ke',
    phone: '0712345678',
    profilePic: profilePics[0],
    joinDate: '2024-01-15',
    sessionsCompleted: 12
};

// Appointments data
const appointments = [
    { id: 1, date: '2024-11-25', time: '10:00 AM', therapist: 'Dr. Juma Otieno', type: 'Video Call' },
    { id: 2, date: '2024-11-28', time: '2:00 PM', therapist: 'Dr. Fatuma Ali', type: 'In-Person' }
];

// Mood data
const moodData = [
    { day: 'Mon', mood: 4 },
    { day: 'Tue', mood: 3 },
    { day: 'Wed', mood: 5 },
    { day: 'Thu', mood: 4 },
    { day: 'Fri', mood: 5 },
    { day: 'Sat', mood: 4 },
    { day: 'Sun', mood: 5 }
];

// Chat messages
let chatMessages = [];

// AI responses for simulation
const aiResponses = [
    "I understand. Can you tell me more about how that makes you feel?",
    "That sounds challenging. Remember, you're taking positive steps by being here.",
    "It's completely normal to feel this way. How can I support you today?",
    "Thank you for sharing. Have you tried any coping strategies that help?",
    "You're doing great by reaching out. Let's work through this together."
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Load user data
    loadUserData();
    
    // Load appointments
    loadAppointments();
    
    // Load mood chart
    loadMoodChart();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Load user data into UI
function loadUserData() {
    const firstName = user.name.split(' ')[0];
    
    document.getElementById('headerProfilePic').src = user.profilePic;
    document.getElementById('headerUserName').textContent = firstName;
    document.getElementById('welcomeText').textContent = `Welcome back, ${firstName}! 👋`;
    document.getElementById('joinDate').textContent = new Date(user.joinDate).toLocaleDateString();
    document.getElementById('sessionsCount').textContent = user.sessionsCompleted;
    document.getElementById('profilePic').src = user.profilePic;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
}

// Load appointments
function loadAppointments() {
    const container = document.getElementById('appointmentsList');
    container.innerHTML = '';
    
    appointments.forEach(apt => {
        const div = document.createElement('div');
        div.className = 'border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-lg mb-3';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold text-emerald-900">${apt.therapist}</p>
                    <p class="text-sm text-gray-600">${apt.type}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium text-emerald-700">${apt.date}</p>
                    <p class="text-sm text-gray-600">${apt.time}</p>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Load mood chart
function loadMoodChart() {
    const container = document.getElementById('moodChart');
    container.innerHTML = '';
    
    moodData.forEach(data => {
        const div = document.createElement('div');
        div.className = 'flex flex-col items-center gap-2 flex-1';
        div.innerHTML = `
            <div class="w-full bg-emerald-100 rounded-t-lg relative" style="height: ${data.mood * 20}%">
                <div class="absolute inset-0 bg-gradient-to-t rounded-t-lg"></div>
            </div>
            <span class="text-xs font-medium text-gray-600">${data.day}</span>
        `;
        container.appendChild(div);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Profile trigger
    document.getElementById('profileTrigger').addEventListener('click', openEditModal);
    document.getElementById('editProfileBtn').addEventListener('click', openEditModal);
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('saveProfile').addEventListener('click', saveProfile);
    
    // AI Chat controls
    document.getElementById('aiChatBtn').addEventListener('click', openAIChat);
    document.getElementById('aiChatTrigger').addEventListener('click', openAIChat);
    document.getElementById('closeChatBtn').addEventListener('click', closeAIChat);
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Close modal on outside click
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') closeEditModal();
    });
}

// Open edit modal
function openEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Populate form
    document.getElementById('inputName').value = user.name;
    document.getElementById('inputEmail').value = user.email;
    document.getElementById('inputPhone').value = user.phone;
    document.getElementById('modalProfilePic').src = user.profilePic;
    
    // Load profile pic options
    const container = document.getElementById('profilePicOptions');
    container.innerHTML = '';
    
    profilePics.forEach((pic, i) => {
        const img = document.createElement('img');
        img.src = pic;
        img.alt = `Option ${i + 1}`;
        img.className = `w-16 h-16 rounded-full cursor-pointer ${user.profilePic === pic ? 'border-emerald-500 border-4' : 'border-gray-300 border-2'} hover:border-emerald-400`;
        img.addEventListener('click', () => selectProfilePic(pic));
        container.appendChild(img);
    });
    
    // Reinitialize icons
    lucide.createIcons();
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Select profile picture
function selectProfilePic(pic) {
    user.profilePic = pic;
    document.getElementById('modalProfilePic').src = pic;
    
    // Update border styles
    const options = document.getElementById('profilePicOptions').children;
    Array.from(options).forEach(img => {
        if (img.src === pic) {
            img.className = 'w-16 h-16 rounded-full cursor-pointer border-emerald-500 border-4 hover:border-emerald-400';
        } else {
            img.className = 'w-16 h-16 rounded-full cursor-pointer border-gray-300 border-2 hover:border-emerald-400';
        }
    });
}

// Save profile
function saveProfile() {
    user.name = document.getElementById('inputName').value;
    user.email = document.getElementById('inputEmail').value;
    user.phone = document.getElementById('inputPhone').value;
    
    loadUserData();
    closeEditModal();
}

// Open AI Chat
function openAIChat() {
    const popup = document.getElementById('aiChatPopup');
    const trigger = document.getElementById('aiChatTrigger');
    
    popup.classList.remove('hidden');
    popup.classList.add('flex');
    trigger.classList.add('hidden');
    
    // Load initial chat view
    renderChatMessages();
    
    // Reinitialize icons
    lucide.createIcons();
}

// Close AI Chat
function closeAIChat() {
    const popup = document.getElementById('aiChatPopup');
    const trigger = document.getElementById('aiChatTrigger');
    
    popup.classList.add('hidden');
    popup.classList.remove('flex');
    trigger.classList.remove('hidden');
}

// Render chat messages
function renderChatMessages() {
    const container = document.getElementById('chatMessages');
    
    if (chatMessages.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 mt-8">
                <i data-lucide="brain" class="w-12 h-12 mx-auto mb-3 text-emerald-400"></i>
                <p>Hi! I'm here to support you. How are you feeling today?</p>
            </div>
        `;
    } else {
        container.innerHTML = '';
        chatMessages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`;
            div.innerHTML = `
                <div class="inline-block max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200'}">
                    <p class="text-sm">${msg.text}</p>
                    <p class="text-xs opacity-70 mt-1">${msg.time}</p>
                </div>
            `;
            container.appendChild(div);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
    
    // Reinitialize icons
    lucide.createIcons();
}

// Send message
function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    chatMessages.push({ text, sender: 'user', time });
    input.value = '';
    renderChatMessages();
    
    // Simulate AI response
    setTimeout(() => {
        const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        chatMessages.push({ text: response, sender: 'ai', time: aiTime });
        renderChatMessages();
    }, 1000);
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
