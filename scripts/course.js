// course.js — renders course cards with filter buttons and credit total

const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming',     credits: 2, completed: true  },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals',                credits: 2, completed: true  },
  { subject: 'CSE', number: 111, title: 'Programming with Functions',       credits: 2, completed: false },
  { subject: 'CSE', number: 210, title: 'Programming with Classes',         credits: 2, completed: false },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals',         credits: 2, completed: true  },
  { subject: 'WDD', number: 231, title: 'Frontend Web Development I',       credits: 2, completed: false },
];

const courseContainer = document.querySelector('#course-cards');
const creditTotal     = document.querySelector('#credit-total');

function displayCourses(filter) {
  // Filter the array
  const filtered = filter === 'WDD'
    ? courses.filter(c => c.subject === 'WDD')
    : filter === 'CSE'
      ? courses.filter(c => c.subject === 'CSE')
      : [...courses];

  // Total credits using reduce — shown ABOVE the cards
  const total = filtered.reduce((sum, c) => sum + c.credits, 0);
  creditTotal.textContent = `The total number of course listed below is ${total}`;

  // Render cards — completed gets a checkmark, not-completed gets terracotta style
  courseContainer.innerHTML = filtered.map(course => `
    <div class="course-card ${course.completed ? 'completed' : 'not-completed'}">
      ${course.completed ? '✓ ' : ''}${course.subject} ${course.number}
    </div>
  `).join('');
}

// Initial display — all courses
displayCourses('ALL');

// Active button helper
function setActive(activeId) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === activeId);
  });
}

// Button listeners
document.querySelector('#btn-all').addEventListener('click', () => {
  setActive('btn-all');
  displayCourses('ALL');
});
document.querySelector('#btn-cse').addEventListener('click', () => {
  setActive('btn-cse');
  displayCourses('CSE');
});
document.querySelector('#btn-wdd').addEventListener('click', () => {
  setActive('btn-wdd');
  displayCourses('WDD');
});
