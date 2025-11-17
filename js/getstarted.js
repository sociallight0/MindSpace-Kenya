let assessmentData = {
  name: '',
  concerns: [],
  therapyBefore: '',
  gender: '',
  phone: '',
  password: ''
};

let currentStep = 1;
const totalSteps = 6;

function nextStep(step) {
  if (step === 2 && !assessmentData.name.trim()) {
    alert("Please enter your name");
    return;
  }
  if (step === 3) {
    const checkboxes = document.querySelectorAll('#step2 input[type="checkbox"]:checked');
    assessmentData.concerns = Array.from(checkboxes).map(cb => cb.value);
    if (assessmentData.concerns.length === 0) {
      alert("Please select at least one concern");
      return;
    }
  }
  if (step === 6) {
    const phone = document.getElementById('phoneInput').value;
    if (!/^07\d{8}$/.test(phone)) {
      alert("Please enter a valid Kenyan mobile number");
      return;
    }
    assessmentData.phone = phone;
  }

  document.getElementById(`step${currentStep}`).classList.remove('active');
  document.getElementById(`step${step}`).classList.add('active');
  currentStep = step;
  updateProgress();
}

function setAnswer(answer) {
  if (currentStep === 3) assessmentData.therapyBefore = answer;
  if (currentStep === 4) assessmentData.gender = answer;
}

function updateProgress() {
  document.getElementById('currentStep').textContent = currentStep;
  const percentage = (currentStep / totalSteps) * 100;
  document.getElementById('progressFill').style.width = percentage + '%';
}

function completeSignup() {
  const password = document.getElementById('passwordInput').value;
  const confirm = document.getElementById('confirmPassword').value;

  if (password.length < 6) return alert("Password must be at least 6 characters");
  if (password !== confirm) return alert("Passwords don't match");

  assessmentData.name = document.getElementById('userNameInput').value.trim();
  assessmentData.password = password;

  // Save to localStorage (same system as before)
  let users = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
  if (users.some(u => u.email === assessmentData.phone + '@mindspace.co.ke')) {
    alert("Account already exists! Please log in.");
    window.location.href = 'login.html';
    return;
  }

  const newUser = {
    name: assessmentData.name,
    email: assessmentData.phone + '@mindspace.co.ke',
    password: assessmentData.password,
    phone: assessmentData.phone,
    concerns: assessmentData.concerns,
    verified: true
  };

  users.push(newUser);
  localStorage.setItem('mindspace_users', JSON.stringify(users));
  localStorage.setItem('mindspace_user', JSON.stringify({ name: newUser.name, email: newUser.email }));

  // Save assessment for therapist matching
  localStorage.setItem('user_assessment', JSON.stringify(assessmentData));

  alert(`Welcome to MindSpace Kenya, ${assessmentData.name}!\nWe're matching you with the perfect therapist...`);
  window.location.href = 'dashboard.html';
}

// Auto-focus first input
document.getElementById('userNameInput').focus();
updateProgress();
