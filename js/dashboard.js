// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// User data management
let userData = {
    name: 'Guest User',
    email: 'user@mindspace.co.ke',
    phone: '+254 712 345 678',
    profilePic: 'https://ui-avatars.com/api/?name=Guest+User&background=10b981&color=fff&size=200',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    sessions: 12,
    appointments: []
};

// Profile picture options
const profilePicOptions = [
    'https://ui-avatars.com/api/?name=User+1&background=10b981&color=fff&size=200',
    'https://ui-avatars.com/api/?name=User+2&background=059669&color=fff&size=200',
    'https://ui-avatars.com/api/?name=User+3&background=064e3b&color=fff&size=200',
    'https://ui-avatars.com/api/?name=User+4&background=6366f1&color=fff&size=200',
    'https://ui-avatars.com/api/?name=User+5&background=8b5cf6&color=fff&size=200',
    'https://ui-avatars.com/api/?name=User+6&background=ec4899&color=fff&size=200'
];

// Sample appointments data
const sampleAppointments = [
    {
        therapist: 'Dr. Amina Hassan',
        specialty: 'Anxiety & Stress',
        date: 'Today, 2:00 PM',
        status: 'upcoming'
    },
    {
        therapist: 'Dr. John Kamau',
        specialty: 'Depression',
        date: 'Tomorrow, 10:00 AM',
        status: 'upcoming'
    }
];

// Initialize the dashboard
function initDashboard() {
    loadUserData();
    updateUI();
    setupEventListeners();
    renderAppointments();
    renderMoodChart();
    setupAIChat();
}

// Load user data from localStorage
function loadUserData() {
    const storedUser = localStorage.getItem('mindspace_user');
    
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            userData = {
                ...userData,
                ...parsedUser,
                profilePic: parsedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.name || 'User')}&background=10b981&color=fff&size=200`
            };
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    // Load appointments
    const storedAppointments = localStorage.getItem('mindspace_appointments');
    if (storedAppointments) {
        try {
            userData.appointments = JSON.parse(storedAppointments);
        } catch (e) {
            userData.appointments = sampleAppointments;
        }
    } else {
        userData.appointments = sampleAppointments;
    }
}

// Update all UI elements with user data
function updateUI() {
    // Header
    document.getElementById('headerProfilePic').src = userData.profilePic;
    document.getElementById('headerUserName').textContent = userData.name;
    
    // Welcome section
    document.getElementById('welcomeText').textContent = `Welcome back, ${userData.name.split(' ')[0]}!`;
    document.getElementById('joinDate').textContent = userData.joinDate;
    
    // Stats
    document.getElementById('sessionsCount').textContent = userData.sessions || 12;
    
    // Profile card
    document.getElementById('profilePic').src = userData.profilePic;
    document.getElementById('profileName').textContent = userData.name;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Modal
    document.getElementById('modalProfilePic').src = userData.profilePic;
    document.getElementById('inputName').value = userData.name;
    document.getElementById('inputEmail').value = userData.email;
    document.getElementById('inputPhone').value = userData.phone;
    
    // Footer year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Edit profile button
    document.getElementById('editProfileBtn').addEventListener('click', openEditModal);
    
    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    
    // Save profile
    document.getElementById('saveProfile').addEventListener('click', saveProfile);
    
    // Profile picture options
    renderProfilePicOptions();
    
    // Click outside modal to close
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeEditModal();
        }
    });
}

// Render profile picture options
function renderProfilePicOptions() {
    const container = document.getElementById('profilePicOptions');
    container.innerHTML = '';
    
    profilePicOptions.forEach(pic => {
        const img = document.createElement('img');
        img.src = pic;
        img.alt = 'Profile option';
        img.className = 'w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300 hover:border-emerald-500 transition-all';
        img.onclick = () => selectProfilePic(pic);
        container.appendChild(img);
    });
}

// Select profile picture
function selectProfilePic(pic) {
    userData.profilePic = pic;
    document.getElementById('modalProfilePic').src = pic;
    
    // Highlight selected
    document.querySelectorAll('#profilePicOptions img').forEach(img => {
        img.className = img.src === pic 
            ? 'w-16 h-16 rounded-full cursor-pointer border-4 border-emerald-500 transition-all'
            : 'w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300 hover:border-emerald-500 transition-all';
    });
}

// Open edit modal
function openEditModal() {
    document.getElementById('editModal').classList.remove('hidden');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

// Save profile changes
function saveProfile() {
    userData.name = document.getElementById('inputName').value.trim();
    userData.email = document.getElementById('inputEmail').value.trim();
    userData.phone = document.getElementById('inputPhone').value.trim();
    
    // Validation
    if (!userData.name || !userData.email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('mindspace_user', JSON.stringify(userData));
    
    // Update UI
    updateUI();
    
    // Close modal
    closeEditModal();
    
    // Show success message
    alert('Profile updated successfully!');
}

// Render appointments
function renderAppointments() {
    const container = document.getElementById('appointmentsList');
    
    if (userData.appointments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p class="mb-3">No upcoming appointments</p>
                <button class="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    Book Your First Session
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userData.appointments.map(apt => `
        <div class="bg-emerald-50 rounded-xl p-4 mb-3 border-l-4 border-emerald-500">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-emerald-900">${apt.therapist}</h4>
                    <p class="text-sm text-gray-600">${apt.specialty}</p>
                    <p class="text-sm text-emerald-600 mt-2">📅 ${apt.date}</p>
                </div>
                <span class="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ${apt.status}
                </span>
            </div>
        </div>
    `).join('');
}

// Render mood chart
function renderMoodChart() {
    const container = document.getElementById('moodChart');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const moodScores = [3.5, 4.2, 3.8, 4.5, 4.0, 4.3, 4.7];
    
    container.innerHTML = days.map((day, i) => {
        const height = (moodScores[i] / 5) * 100;
        return `
            <div class="flex flex-col items-center gap-2">
                <div class="w-12 bg-emerald-200 rounded-t-lg" style="height: ${height}%"></div>
                <span class="text-xs text-gray-600">${day}</span>
            </div>
        `;
    }).join('');
}

// AI Chat functionality
let chatMessages = [];

function setupAIChat() {
    const triggerBtn = document.getElementById('aiChatTrigger');
    const chatPopup = document.getElementById('aiChatPopup');
    const closeBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');
    const quickActionBtn = document.getElementById('aiChatBtn');
    
    // Open chat
    triggerBtn.addEventListener('click', openAIChat);
    if (quickActionBtn) {
        quickActionBtn.addEventListener('click', openAIChat);
    }
    
    // Close chat
    closeBtn.addEventListener('click', closeAIChat);
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Load initial message
    addChatMessage('Hello! I\'m your AI support assistant. How can I help you today?', 'ai');
}

function openAIChat() {
    document.getElementById('aiChatPopup').classList.remove('hidden');
    document.getElementById('aiChatPopup').classList.add('flex');
    document.getElementById('chatInput').focus();
}

function closeAIChat() {
    document.getElementById('aiChatPopup').classList.add('hidden');
    document.getElementById('aiChatPopup').classList.remove('flex');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = getAIResponse(message);
        addChatMessage(response, 'ai');
    }, 1000);
}

function addChatMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = sender === 'user' 
        ? 'bg-emerald-600 text-white rounded-lg p-3 mb-2 ml-auto max-w-[80%]'
        : 'bg-gray-200 text-gray-800 rounded-lg p-3 mb-2 mr-auto max-w-[80%]';
    
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    chatMessages.push({ text, sender, timestamp: new Date() });
}

function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi')) {
        return 'Hello! How are you feeling today?';
    } else if (msg.includes('anxious') || msg.includes('anxiety')) {
        return 'I understand you\'re feeling anxious. Would you like to try a breathing exercise or would you prefer to talk to a therapist?';
    } else if (msg.includes('sad') || msg.includes('depressed')) {
        return 'I\'m sorry you\'re feeling this way. Remember, you\'re not alone. Would you like me to help you book a session with a therapist?';
    } else if (msg.includes('book') || msg.includes('appointment')) {
        return 'I can help you book an appointment! What day works best for you?';
    } else if (msg.includes('help')) {
        return 'I\'m here to help! I can assist with: booking appointments, mood tracking, breathing exercises, or connecting you with a therapist. What would you like to do?';
    } else {
        return 'Thank you for sharing. Would you like to speak with one of our licensed therapists? They can provide professional support tailored to your needs.';
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
