document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.querySelector('#users-table tbody');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-input');
  const roleFilter = document.getElementById('role-filter');
  const logoutBtn = document.getElementById('logout-btn');

  function apiGet(url) {
    return fetch(url, { credentials: 'same-origin' })
      .then(handleResponse);
  }

  function apiPatch(url, data) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(data)
    }).then(handleResponse);
  }

  function handleResponse(res) {
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    return res.json();
  }

  function showNotification(message, type = 'success') {
    // Simple fallback notification; you can reuse project's notification if available
    alert((type === 'error' ? 'Error: ' : '') + message);
  }

  function loadUsers() {
    apiGet('/api/users')
      .then(data => {
        const users = data.users || data; // support both {success, users} and []
        renderUsers(users);
      })
      .catch(err => {
        console.error(err);
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
      });
  }

  function renderUsers(users) {
    const q = (searchInput.value || '').toLowerCase().trim();
    const rf = roleFilter.value;

    const filtered = users.filter(u => {
      const matchRole = !rf || (u.role === rf);
      const text = `${u.fullname || ''} ${u.username || ''} ${u.email || ''} ${u.role || ''}`.toLowerCase();
      const matchText = !q || text.includes(q);
      return matchRole && matchText;
    });

    tableBody.innerHTML = '';

    if (!filtered.length) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach((u, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${escapeHtml(u.fullname || '-')}
        </td>
        <td>${escapeHtml(u.username || '-')}</td>
        <td>${escapeHtml(u.email || '-')}</td>
        <td>
          <select class="role-select" data-user-id="${u.user_id}">
            ${renderRoleOption('admin', u.role)}
            ${renderRoleOption('staff', u.role)}
            ${renderRoleOption('user', u.role)}
          </select>
        </td>
        <td class="actions">
          <button class="btn-edit btn-save-role" data-user-id="${u.user_id}"><i class="fas fa-save"></i> บันทึก</button>
        </td>`;
      tableBody.appendChild(tr);
    });
  }

  function renderRoleOption(role, current) {
    const selected = role === current ? 'selected' : '';
    return `<option value="${role}" ${selected}>${role}</option>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-save-role')) {
      const btn = e.target.closest('.btn-save-role');
      const userId = btn.getAttribute('data-user-id');
      const select = document.querySelector(`select.role-select[data-user-id="${userId}"]`);
      const newRole = select.value;

      btn.disabled = true;
      apiPatch(`/api/users/${userId}/role`, { role: newRole })
        .then(res => {
          if (res.success) {
            showNotification('อัปเดตบทบาทสำเร็จ');
          } else {
            showNotification(res.message || 'อัปเดตไม่สำเร็จ', 'error');
          }
        })
        .catch(err => {
          console.error(err);
          showNotification('เกิดข้อผิดพลาดในการอัปเดตบทบาท', 'error');
        })
        .finally(() => {
          btn.disabled = false;
          loadUsers();
        });
    }
  });

  searchInput.addEventListener('input', loadUsers);
  roleFilter.addEventListener('change', loadUsers);

  function handleLogout(e) {
    e?.preventDefault?.();
    fetch('/auth/logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }})
      .then(r => r.json())
      .then(() => window.location.href = '/login')
      .catch(() => window.location.href = '/login');
  }
  logoutBtn?.addEventListener('click', handleLogout);

  loadUsers();
});
