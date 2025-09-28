/**
 * IT Resource Management System - User Dashboard
 * Main JavaScript file for user interface interactions
 */
document.addEventListener('DOMContentLoaded', function () {
    
    // ===== Constants =====
    const STATUS_CLASS_MAP = {
        // Room & Equipment status classes
        AVAILABLE: 'available',
        BOOKED: 'booked',
        MAINTENANCE: 'maintenance',
        // Booking status classes
        ACTIVE: 'active',
        UPCOMING: 'upcoming',
        COMPLETED: 'completed',
        // Maintenance status classes
        PENDING: 'pending',
        IN_PROGRESS: 'in-progress'
    };

    const STATUS_TEXT_MAP = {
        // Room status text
        ROOM: {
            1: 'ว่าง',
            0: 'ถูกใช้งานอยู่',
            '-1': 'ซ่อมบำรุง'
        },
        // Equipment status text
        EQUIPMENT: {
            1: 'ว่าง',
            0: 'ถูกจอง',
            '-1': 'ซ่อมบำรุง'
        },
        // Maintenance status text
        MAINTENANCE: {
            'pending': 'รอดำเนินการ',
            'in-progress': 'กำลังซ่อม',
            'completed': 'ซ่อมเสร็จแล้ว'
        }
    };

    // ===== DOM Elements =====
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    const modals = {
        roomBooking: document.getElementById('room-booking-modal'),
        equipmentBooking: document.getElementById('equipment-booking-modal'),
        maintenance: document.getElementById('maintenance-modal')
    };
    
    // ===== Initialization =====
    function initialize() {
        setupEventListeners();
        initializeUserName();
        loadMyBookings();
        initializeSocketIO();
    }

    function setupEventListeners() {
        // Tab switching
        menuItems.forEach(item => {
            item.addEventListener('click', handleMenuItemClick);
        });

        // Modal closing
        document.querySelectorAll('.close, .btn-cancel').forEach(button => {
            button.addEventListener('click', closeAllModals);
        });

        // Booking filtering
        document.getElementById('booking-filter')?.addEventListener('change', filterBookings);

        // Add maintenance button
        document.getElementById('add-maintenance-btn')?.addEventListener('click', () => {
            modals.maintenance.style.display = 'block';
        });

        // Form submissions
        document.getElementById('room-booking-form')?.addEventListener('submit', handleRoomBooking);
        document.getElementById('equipment-booking-form')?.addEventListener('submit', handleEquipmentBooking);
        document.getElementById('maintenance-form')?.addEventListener('submit', handleMaintenanceRequest);

        // Button click delegations
        document.addEventListener('click', handleButtonClicks);

        // Logout functionality
        document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    }

    function initializeUserName() {
        const profileNameElem = document.getElementById('user-name');
        const userName = localStorage.getItem("userName");
        if (profileNameElem && userName) {
            profileNameElem.textContent = userName;
        }
    }

    function initializeSocketIO() {
        const socket = window.io ? io() : null;
        if (!socket) return;

        // Status update events
        socket.on('rooms:status-updated', handleRoomsUpdate);
        socket.on('equipments:status-updated', handleEquipmentsUpdate);
        
        // Data change events
        socket.on('rooms:changed', handleRoomsUpdate);
        socket.on('equipments:changed', handleEquipmentsUpdate);
        socket.on('maintenances:changed', handleMaintenanceUpdate);
    }

    // ===== Event Handlers =====
    function handleMenuItemClick(e) {
        if (this.classList.contains('logout')) return;
        e.preventDefault();

        const targetSection = this.getAttribute('data-section');

        // Update active menu item
        menuItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');

        // Update active section
        sections.forEach(section => {
            if (section.id === targetSection) {
                section.classList.add('active');
                loadSectionData(targetSection);
            } else {
                section.classList.remove('active');
            }
        });
    }

    function handleButtonClicks(e) {
        // Room booking button
        if (e.target.closest('.btn-book') && e.target.closest('#available-rooms-table')) {
            handleRoomBookingButton(e.target.closest('.btn-book'));
        }
        // Equipment booking button
        else if (e.target.closest('.btn-book') && e.target.closest('#available-equipment-table')) {
            handleEquipmentBookingButton(e.target.closest('.btn-book'));
        }
        // Cancel booking button
        else if (e.target.closest('.btn-cancel-booking')) {
            handleCancelBookingButton(e.target.closest('.btn-cancel-booking'));
        }
    }

    function handleRoomBookingButton(button) {
        const roomId = button.getAttribute('data-room-id');
        const roomName = button.getAttribute('data-room-name');
        const roomDescription = button.getAttribute('data-room-description');
        const roomCapacity = button.getAttribute('data-room-capacity');

        document.getElementById('selected-room-name').textContent = `${roomName} (${roomId})`;
        document.getElementById('selected-room-details').textContent = `${roomDescription} - ความจุ: ${roomCapacity} คน`;

        // Set hidden room ID
        document.getElementById('room-booking-form').setAttribute('data-room-id', roomId);
        modals.roomBooking.style.display = 'block';
    }

    function handleEquipmentBookingButton(button) {
        const equipmentId = button.getAttribute('data-equipment-id');
        const equipmentName = button.getAttribute('data-equipment-name');
        const equipmentType = button.getAttribute('data-equipment-type');

        document.getElementById('selected-equipment-name').textContent = `${equipmentName} (${equipmentId})`;
        document.getElementById('selected-equipment-details').textContent = `ประเภท: ${equipmentType}`;

        // Set hidden equipment ID
        document.getElementById('equipment-booking-form').setAttribute('data-equipment-id', equipmentId);
        modals.equipmentBooking.style.display = 'block';
    }

    function handleCancelBookingButton(button) {
        const bookingId = button.getAttribute('data-booking-id');
        const type = button.getAttribute('data-type');

        if (confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?')) {
            cancelBooking(bookingId, type);
        }
    }

    function handleRoomBooking(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const roomId = this.getAttribute('data-room-id');

        const bookingData = {
            room_id: roomId,
            booking_date: formData.get('booking-date'),
            start_time: formData.get('booking-start-time'),
            end_time: formData.get('booking-end-time'),
            purpose: formData.get('booking-purpose')
        };

        apiPost('/api/user/book-room', bookingData)
            .then(result => {
                if (result.success) {
                    showNotification('จองห้องสำเร็จ!');
                    modals.roomBooking.style.display = 'none';
                    loadMyBookings();
                } else {
                    showNotification('เกิดข้อผิดพลาด: ' + result.message, 'error');
                }
            })
            .catch(error => handleApiError(error, 'ไม่สามารถจองห้องได้'));
    }

    function handleEquipmentBooking(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const equipmentId = this.getAttribute('data-equipment-id');

        const bookingData = {
            equipment_id: equipmentId,
            booking_date: formData.get('equipment-booking-date'),
            booking_time: formData.get('equipment-booking-time'),
            return_date: formData.get('equipment-return-date'),
            return_time: formData.get('equipment-return-time'),
            purpose: formData.get('equipment-purpose')
        };

        apiPost('/api/user/book-equipment', bookingData)
            .then(result => {
                if (result.success) {
                    showNotification('จองอุปกรณ์สำเร็จ!');
                    modals.equipmentBooking.style.display = 'none';
                    loadMyBookings();
                } else {
                    showNotification('เกิดข้อผิดพลาด: ' + result.message, 'error');
                }
            })
            .catch(error => handleApiError(error, 'ไม่สามารถจองอุปกรณ์ได้'));
    }

    function handleMaintenanceRequest(e) {
        e.preventDefault();
        const formData = new FormData(this);

        const maintenanceData = {
            equipment: formData.get('maintenance-equipment'),
            problem_description: formData.get('maintenance-problem'),
            location: formData.get('maintenance-location'),
            urgency: formData.get('maintenance-urgency')
        };

        apiPost('/api/user/maintenance-request', maintenanceData)
            .then(result => {
                if (result.success) {
                    showNotification('แจ้งซ่อมสำเร็จ!');
                    modals.maintenance.style.display = 'none';
                    loadMyMaintenanceRequests();
                } else {
                    showNotification('เกิดข้อผิดพลาด: ' + result.message, 'error');
                }
            })
            .catch(error => handleApiError(error, 'ไม่สามารถแจ้งซ่อมได้'));
    }

    function handleLogout(e) {
        e.preventDefault();

        apiPost('/auth/logout', {}, 'POST')
            .then(response => {
                if (response.ok) {
                    showNotification('ออกจากระบบสำเร็จ');
                    window.location.href = '/';
                } else {
                    showNotification('เกิดข้อผิดพลาดในการออกจากระบบ', 'error');
                }
            })
            .catch(() => showNotification('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error'));
    }

    // ===== Socket Event Handlers =====
    function handleRoomsUpdate() {
        const active = document.querySelector('.menu-item.active[data-section="rooms"]');
        if (active) loadAvailableRooms();
    }

    function handleEquipmentsUpdate() {
        const active = document.querySelector('.menu-item.active[data-section="equipment"]');
        if (active) loadAvailableEquipment();
    }

    function handleMaintenanceUpdate() {
        const active = document.querySelector('.menu-item.active');
        if (!active) return;
        
        const section = active.getAttribute('data-section');
        if (section === 'maintenance') {
            loadMyMaintenanceRequests();
        } else if (section === 'bookings') {
            loadMyBookings();
        }
    }

    // ===== Data Loading Functions =====
    function loadSectionData(section) {
        switch (section) {
            case 'bookings':
                loadMyBookings();
                break;
            case 'rooms':
                loadAvailableRooms();
                break;
            case 'equipment':
                loadAvailableEquipment();
                break;
            case 'maintenance':
                loadMyMaintenanceRequests();
                break;
        }
    }

    function loadMyBookings() {
        apiGet('/api/user/bookings')
            .then(data => {
                // Separate room and equipment bookings
                const roomBookings = data.bookings.filter(booking => booking.room_id);
                const equipmentBookings = data.bookings.filter(booking => booking.equipment_id);

                // Display room bookings
                displayRoomBookings(roomBookings);
                
                // Display equipment bookings
                displayEquipmentBookings(equipmentBookings);

                // Update booking statistics
                updateBookingStats(data.bookings);
            })
            .catch(error => {
                handleApiError(error, 'Error loading bookings');
                displayBookingError();
            });
    }

    function loadAvailableRooms() {
        apiGet('/api/rooms')
            .then(data => {
                const tbody = document.querySelector('#available-rooms-table tbody');
                tbody.innerHTML = '';

                data.rooms.forEach(room => {
                    const statusInfo = getRoomStatusInfo(room.status);
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${room.room_id}</td>
                        <td>${room.room_name}</td>
                        <td>${room.description}</td>
                        <td>${room.capacity} คน</td>
                        <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
                        <td class="actions">
                            ${room.status === 1 || room.status === 0 ? 
                                `<button class="btn-book" data-room-id="${room.room_id}" 
                                  data-room-name="${room.room_name}" 
                                  data-room-description="${room.description}" 
                                  data-room-capacity="${room.capacity}">
                                    <i class="fas fa-calendar-plus"></i> จอง
                                </button>` : 
                                `<button class="btn-disabled" disabled>
                                    <i class="fas fa-calendar-times"></i> ไม่สามารถจองได้
                                </button>`
                            }
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => handleApiError(error, 'Error loading rooms'));
    }

    function loadAvailableEquipment() {
        apiGet('/api/equipments')
            .then(data => {
                const tbody = document.querySelector('#available-equipment-table tbody');
                tbody.innerHTML = '';

                data.equipments.forEach(item => {
                    const statusInfo = getEquipmentStatusInfo(item.status);
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${item.e_id}</td>
                        <td>${item.name}</td>
                        <td>${item.type_name}</td>
                        <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
                        <td class="actions">
                            ${item.status === 1 ? 
                                `<button class="btn-book" data-equipment-id="${item.e_id}" 
                                  data-equipment-name="${item.name}" 
                                  data-equipment-type="${item.type_name}">
                                    <i class="fas fa-calendar-plus"></i> จอง
                                </button>` : 
                                `<button class="btn-disabled" disabled>
                                    <i class="fas fa-calendar-times"></i> ไม่สามารถจองได้
                                </button>`
                            }
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => handleApiError(error, 'Error loading equipment'));
    }

    function loadMyMaintenanceRequests() {
        apiGet('/api/user/maintenance-requests')
            .then(data => {
                const tbody = document.querySelector('#my-maintenance-table tbody');
                tbody.innerHTML = '';

                if (data.requests && data.requests.length > 0) {
                    data.requests.forEach(request => {
                        const statusInfo = getMaintenanceStatusInfo(request.status);
                        const row = document.createElement('tr');
                        
                        row.innerHTML = `
                            <td>${request.request_id}</td>
                            <td>${request.equipment}</td>
                            <td>${request.problem_description}</td>
                            <td>${formatDate(request.date_reported)}</td>
                            <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
                            <td class="actions">
                                <button class="btn-view" data-request-id="${request.request_id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    displayNoMaintenanceRequests(tbody);
                }
            })
            .catch(error => handleApiError(error, 'Error loading maintenance requests'));
    }

    // ===== Display Helper Functions =====
    function displayRoomBookings(roomBookings) {
        const container = document.getElementById('my-room-bookings-container');
        container.innerHTML = '';

        if (roomBookings.length > 0) {
            roomBookings.forEach(booking => {
                const bookingElement = createBookingElement(booking);
                container.appendChild(bookingElement);
            });
        } else {
            container.innerHTML = createEmptyStateHTML('door-open', 'ยังไม่มีการจองห้อง', 'เลือกจองห้องเพื่อดูรายการที่นี่');
        }
    }

    function displayEquipmentBookings(equipmentBookings) {
        const container = document.getElementById('my-equipment-bookings-container');
        container.innerHTML = '';

        if (equipmentBookings.length > 0) {
            equipmentBookings.forEach(booking => {
                const bookingElement = createBookingElement(booking);
                container.appendChild(bookingElement);
            });
        } else {
            container.innerHTML = createEmptyStateHTML('laptop', 'ยังไม่มีการจองอุปกรณ์', 'เลือกจองอุปกรณ์เพื่อดูรายการที่นี่');
        }
    }

    function displayBookingError() {
        const containers = [
            document.getElementById('my-room-bookings-container'),
            document.getElementById('my-equipment-bookings-container')
        ];
        
        containers.forEach(container => {
            if (container) {
                container.innerHTML = createEmptyStateHTML(
                    'exclamation-circle',
                    'ไม่สามารถโหลดข้อมูลได้',
                    'โปรดลองอีกครั้งในภายหลัง'
                );
            }
        });
    }

    function displayNoMaintenanceRequests(tbody) {
        const row = document.createElement('tr');
        row.className = 'no-data-row';
        row.innerHTML = `
            <td colspan="6" class="no-data-cell">
                <div class="empty-state">
                    <i class="fas fa-tools"></i>
                    <h3>ยังไม่มีรายการแจ้งซ่อม</h3>
                    <p>เมื่อคุณแจ้งซ่อม รายการจะปรากฏที่นี่</p>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    }

    // ===== UI Helper Functions =====
    function createBookingElement(booking) {
        const bookingElement = document.createElement('div');
        bookingElement.className = 'booking-item';

        const status = getBookingStatus(booking);
        const isRoom = booking.room_id ? true : false;

        bookingElement.innerHTML = `
            <div class="booking-header">
                <div class="booking-type">
                    <i class="fas fa-${isRoom ? 'door-open' : 'laptop'}"></i>
                    ${isRoom ? 'จองห้อง' : 'จองอุปกรณ์'}: ${isRoom ? booking.room_name : booking.equipment_name}
                </div>
                <span class="booking-status ${status.class}">${status.text}</span>
            </div>
            <div class="booking-body">
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>วันที่: ${formatDate(booking.booking_date)}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>เวลา: ${booking.start_time} - ${booking.end_time}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clipboard"></i>
                        <span>วัตถุประสงค์: ${booking.purpose || 'ไม่ระบุ'}</span>
                    </div>
                </div>
                ${status.class === STATUS_CLASS_MAP.UPCOMING ? `
                <div class="booking-actions">
                    <button class="btn-cancel-booking" data-booking-id="${booking.booking_id}" data-type="${isRoom ? 'room' : 'equipment'}">
                        ยกเลิกการจอง
                    </button>
                </div>
                ` : ''}
            </div>
        `;

        return bookingElement;
    }

    function createEmptyStateHTML(icon, title, message) {
        return `
            <div class="empty-state">
                <i class="fas fa-${icon}"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function filterBookings() {
        const filterValue = document.getElementById('booking-filter').value;
        const roomBookings = document.querySelectorAll('#my-room-bookings-container .booking-item');
        const equipmentBookings = document.querySelectorAll('#my-equipment-bookings-container .booking-item');
        const allBookings = [...roomBookings, ...equipmentBookings];
        
        allBookings.forEach(booking => {
            const statusElement = booking.querySelector('.booking-status');
            const status = getStatusClassFromElement(statusElement);
            
            if (filterValue === 'all' || status === filterValue) {
                booking.style.display = '';
            } else {
                booking.style.display = 'none';
            }
        });
        
        // Check and show empty state if needed
        checkEmptyState('my-room-bookings-container', 'ไม่พบการจองห้องที่ตรงกับเงื่อนไข', 'door-open');
        checkEmptyState('my-equipment-bookings-container', 'ไม่พบการจองอุปกรณ์ที่ตรงกับเงื่อนไข', 'laptop');
    }

    function checkEmptyState(containerId, message, iconName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const visibleItems = Array.from(container.querySelectorAll('.booking-item'))
            .filter(item => item.style.display !== 'none');
        
        // If we have booking items but none are visible after filtering
        if (visibleItems.length === 0 && container.querySelectorAll('.booking-item').length > 0) {
            // Hide all booking items
            container.querySelectorAll('.booking-item').forEach(item => {
                item.style.display = 'none';
            });
            
            // Show filter-specific empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state filter-empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-${iconName}"></i>
                <h3>${message}</h3>
                <p>ลองเปลี่ยนตัวกรองเพื่อดูรายการอื่น</p>
            `;
            container.appendChild(emptyState);
        }
        // If we have visible items, remove any filter empty state
        else if (visibleItems.length > 0) {
            const filterEmptyState = container.querySelector('.filter-empty-state');
            if (filterEmptyState) {
                filterEmptyState.remove();
            }
        }
    }

    function closeAllModals() {
        Object.values(modals).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
    }

    function updateBookingStats(bookings) {
        const stats = {
            total: bookings.length,
            active: bookings.filter(b => getBookingStatus(b).class === STATUS_CLASS_MAP.ACTIVE).length,
            upcoming: bookings.filter(b => getBookingStatus(b).class === STATUS_CLASS_MAP.UPCOMING).length
        };

        const statCards = document.querySelectorAll('#bookings .stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.active;
            statCards[2].textContent = stats.upcoming;
        }
    }

    // ===== Status Helper Functions =====
    function getStatusClassFromElement(element) {
        if (element.classList.contains(STATUS_CLASS_MAP.ACTIVE)) return STATUS_CLASS_MAP.ACTIVE;
        if (element.classList.contains(STATUS_CLASS_MAP.UPCOMING)) return STATUS_CLASS_MAP.UPCOMING;
        return STATUS_CLASS_MAP.COMPLETED;
    }

    function getBookingStatus(booking) {
        const now = new Date();
        const bookingDate = new Date(booking.booking_date);
        const startTime = new Date(`${booking.booking_date}T${booking.start_time}`);
        const endTime = new Date(`${booking.booking_date}T${booking.end_time}`);

        if (now >= startTime && now <= endTime) {
            return { class: STATUS_CLASS_MAP.ACTIVE, text: 'กำลังใช้งาน' };
        } else if (now < startTime) {
            return { class: STATUS_CLASS_MAP.UPCOMING, text: 'กำลังจะมาถึง' };
        } else {
            return { class: STATUS_CLASS_MAP.COMPLETED, text: 'เสร็จสิ้นแล้ว' };
        }
    }

    function getRoomStatusInfo(status) {
        const statusCode = parseInt(status);
        return {
            class: statusCode === 1 ? STATUS_CLASS_MAP.AVAILABLE : 
                  statusCode === 0 ? STATUS_CLASS_MAP.BOOKED : 
                  STATUS_CLASS_MAP.MAINTENANCE,
            text: STATUS_TEXT_MAP.ROOM[statusCode] || 'ไม่ทราบสถานะ'
        };
    }

    function getEquipmentStatusInfo(status) {
        const statusCode = parseInt(status);
        return {
            class: statusCode === 1 ? STATUS_CLASS_MAP.AVAILABLE : 
                  statusCode === 0 ? STATUS_CLASS_MAP.BOOKED : 
                  STATUS_CLASS_MAP.MAINTENANCE,
            text: STATUS_TEXT_MAP.EQUIPMENT[statusCode] || 'ไม่ทราบสถานะ'
        };
    }

    function getMaintenanceStatusInfo(status) {
        return {
            class: STATUS_CLASS_MAP[status.toUpperCase()] || STATUS_CLASS_MAP.PENDING,
            text: STATUS_TEXT_MAP.MAINTENANCE[status] || 'ไม่ทราบสถานะ'
        };
    }

    // ===== API Helper Functions =====
    function apiGet(url) {
        return fetch(url)
            .then(handleResponse)
            .catch(error => {
                console.error(`Error fetching from ${url}:`, error);
                throw error;
            });
    }

    function apiPost(url, data, method = 'POST') {
        return fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(handleResponse)
        .catch(error => {
            console.error(`Error posting to ${url}:`, error);
            throw error;
        });
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    function handleApiError(error, defaultMessage) {
        console.error(defaultMessage + ':', error);
        showNotification(defaultMessage, 'error');
    }

    // ===== Utility Functions =====
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('th-TH');
    }

    function showNotification(message, type = 'success') {
        alert(message);
        // This could be enhanced with a nicer notification system
    }

    function cancelBooking(bookingId, type) {
        fetch(`/api/user/cancel-booking/${bookingId}?type=${type}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showNotification('ยกเลิกการจองสำเร็จ!');
                loadMyBookings();
            } else {
                showNotification('เกิดข้อผิดพลาด: ' + result.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('ไม่สามารถยกเลิกการจองได้', 'error');
        });
    }

    // Start the application
    initialize();
});