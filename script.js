const API = 'https://jsonplaceholder.typicode.com/users';
const usersContainer = document.getElementById('usersContainer');
const statusEl = document.getElementById('status');
const reloadBtn = document.getElementById('reloadBtn');

async function fetchAndRender() {
  usersContainer.innerHTML = '';
  statusEl.textContent = 'Loading users...';
  try {
    const res = await fetch(API, { cache: 'no-store' }); // no-cache during dev
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const users = await res.json();
    if (!Array.isArray(users)) throw new Error('Invalid data format');
    statusEl.textContent = `Fetched ${users.length} users.`;
    users.forEach(renderUserCard);
  } catch (err) {
    console.error(err);
    statusEl.innerHTML = `<span class="error">Error: ${err.message}. Try reloading or check network.</span>`;
    // show a friendly retry card
    const errCard = document.createElement('div');
    errCard.className = 'card';
    errCard.innerHTML = `<p class="small">If you want to test offline handling: disable your internet and click Reload to see the error handling.</p>`;
    usersContainer.appendChild(errCard);
  }
}

function renderUserCard(user) {
  const card = document.createElement('div');
  card.className = 'card';
  const address = user.address ? `${user.address.suite}, ${user.address.street}, ${user.address.city} - ${user.address.zipcode}` : 'Address not available';
  card.innerHTML = `
    <h3>${escapeHtml(user.name)}</h3>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(user.email)}">${escapeHtml(user.email)}</a></p>
    <p><strong>Address:</strong> <span class="small">${escapeHtml(address)}</span></p>
  `;
  usersContainer.appendChild(card);
}

// tiny sanitizer for displayed strings
function escapeHtml(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

reloadBtn.addEventListener('click', fetchAndRender);

// initial load
fetchAndRender();
