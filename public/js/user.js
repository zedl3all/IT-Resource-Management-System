document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
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
                    console.log(`Switched to section: ${targetSection}`);
                    
                    // Load data based on section
                    switch(targetSection) {
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
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // Load my bookings
    function loadMyBookings() {
        fetch('/api/user/bookings')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('my-bookings-container');
                container.innerHTML = '';

                if (data.bookings && data.bookings.length > 0) {
                    data.bookings.forEach(booking => {
                        const bookingElement = createBookingElement(booking);
                        container.appendChild(bookingElement);
                    });
                    
                    // Update stats
                    updateBookingStats(data.bookings);
                } else {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-calendar"></i>
                            <h3>ยังไม่มีการจอง</h3>
                            <p>เริ่มต้นจองห้องหรืออุปกรณ์เพื่อดูรายการที่นี่</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading bookings:', error);
            });
    }

    // Create booking element
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
                ${status.class === 'upcoming' ? `
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

    // Get booking status
    function getBookingStatus(booking) {
        const now = new Date();
        const bookingDate = new Date(booking.booking_date);
        const startTime = new Date(`${booking.booking_date}T${booking.start_time}`);
        const endTime = new Date(`${booking.booking_date}T${booking.end_time}`);

        if (now >= startTime && now <= endTime) {
            return { class: 'active', text: 'กำลังใช้งาน' };
        } else if (now < startTime) {
            return { class: 'upcoming', text: 'กำลังจะมาถึง' };
        } else {
            return { class: 'completed', text: 'เสร็จสิ้นแล้ว' };
        }
    }

    // Load available rooms
    function loadAvailableRooms() {
        fetch('/api/rooms')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#available-rooms-table tbody');
                tbody.innerHTML = '';

                const availableRooms = data.rooms.filter(room => room.status === 1);

                availableRooms.forEach(room => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${room.room_id}</td>
                        <td>${room.room_name}</td>
                        <td>${room.description}</td>
                        <td>${room.capacity} คน</td>
                        <td><span class="status available">ว่าง</span></td>
                        <td class="actions">
                            <button class="btn-book" data-room-id="${room.room_id}" data-room-name="${room.room_name}" data-room-description="${room.description}" data-room-capacity="${room.capacity}">
                                <i class="fas fa-calendar-plus"></i> จอง
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading rooms:', error));
    }

    // Load available equipment
    function loadAvailableEquipment() {
        fetch('/api/equipments')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#available-equipment-table tbody');
                tbody.innerHTML = '';

                const availableEquipment = data.equipments.filter(item => item.status === 1);

                availableEquipment.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.equipment_id}</td>
                        <td>${item.equipment_name}</td>
                        <td>${item.type_name}</td>
                        <td><span class="status available">ว่าง</span></td>
                        <td class="actions">
                            <button class="btn-book" data-equipment-id="${item.equipment_id}" data-equipment-name="${item.equipment_name}" data-equipment-type="${item.type_name}">
                                <i class="fas fa-calendar-plus"></i> จอง
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading equipment:', error));
    }

    // Load my maintenance requests
    function loadMyMaintenanceRequests() {
        fetch('/api/user/maintenance-requests')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#my-maintenance-table tbody');
                tbody.innerHTML = '';

                if (data.requests && data.requests.length > 0) {
                    data.requests.forEach(request => {
                        const row = document.createElement('tr');
                        
                        let statusClass, statusText;
                        switch(request.status) {
                            case 'pending':
                                statusClass = 'pending';
                                statusText = 'รอดำเนินการ';
                                break;
                            case 'in-progress':
                                statusClass = 'in-progress';
                                statusText = 'กำลังซ่อม';
                                break;
                            case 'completed':
                                statusClass = 'completed';
                                statusText = 'ซ่อมเสร็จแล้ว';
                                break;
                        }

                        row.innerHTML = `
                            <td>${request.request_id}</td>
                            <td>${request.equipment}</td>
                            <td>${request.problem_description}</td>
                            <td>${formatDate(request.date_reported)}</td>
                            <td><span class="status ${statusClass}">${statusText}</span></td>
                            <td class="actions">
                                <button class="btn-view" data-request-id="${request.request_id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => console.error('Error loading maintenance requests:', error));
    }

    // Modal functionality
    const modals = {
        roomBooking: document.getElementById('room-booking-modal'),
        equipmentBooking: document.getElementById('equipment-booking-modal'),
        maintenance: document.getElementById('maintenance-modal')
    };

    const closeButtons = document.querySelectorAll('.close, .btn-cancel');

    // Close modal functions
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            Object.values(modals).forEach(modal => {
                if (modal) modal.style.display = 'none';
            });
        });
    });

    // Event delegation for buttons
    document.addEventListener('click', function(e) {
        // Room booking
        if (e.target.closest('.btn-book') && e.target.closest('#available-rooms-table')) {
            const button = e.target.closest('.btn-book');
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

        // Equipment booking
        else if (e.target.closest('.btn-book') && e.target.closest('#available-equipment-table')) {
            const button = e.target.closest('.btn-book');
            const equipmentId = button.getAttribute('data-equipment-id');
            const equipmentName = button.getAttribute('data-equipment-name');
            const equipmentType = button.getAttribute('data-equipment-type');

            document.getElementById('selected-equipment-name').textContent = `${equipmentName} (${equipmentId})`;
            document.getElementById('selected-equipment-details').textContent = `ประเภท: ${equipmentType}`;
            
            // Set hidden equipment ID
            document.getElementById('equipment-booking-form').setAttribute('data-equipment-id', equipmentId);
            
            modals.equipmentBooking.style.display = 'block';
        }

        // Cancel booking
        else if (e.target.closest('.btn-cancel-booking')) {
            const button = e.target.closest('.btn-cancel-booking');
            const bookingId = button.getAttribute('data-booking-id');
            const type = button.getAttribute('data-type');

            if (confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?')) {
                cancelBooking(bookingId, type);
            }
        }
    });

    // Add maintenance request button
    document.getElementById('add-maintenance-btn').addEventListener('click', () => {
        modals.maintenance.style.display = 'block';
    });

    // Form submissions
    document.getElementById('room-booking-form').addEventListener('submit', function(e) {
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

        fetch('/api/user/book-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('จองห้องสำเร็จ!');
                modals.roomBooking.style.display = 'none';
                loadMyBookings();
            } else {
                alert('เกิดข้อผิดพลาด: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่สามารถจองห้องได้');
        });
    });

    document.getElementById('equipment-booking-form').addEventListener('submit', function(e) {
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

        fetch('/api/user/book-equipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('จองอุปกรณ์สำเร็จ!');
                modals.equipmentBooking.style.display = 'none';
                loadMyBookings();
            } else {
                alert('เกิดข้อผิดพลาด: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่สามารถจองอุปกรณ์ได้');
        });
    });

    document.getElementById('maintenance-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        const maintenanceData = {
            equipment: formData.get('maintenance-equipment'),
            problem_description: formData.get('maintenance-problem'),
            location: formData.get('maintenance-location'),
            urgency: formData.get('maintenance-urgency')
        };

        fetch('/api/user/maintenance-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(maintenanceData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('แจ้งซ่อมสำเร็จ!');
                modals.maintenance.style.display = 'none';
                loadMyMaintenanceRequests();
            } else {
                alert('เกิดข้อผิดพลาด: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่สามารถแจ้งซ่อมได้');
        });
    });

    // Utility functions
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('th-TH');
    }

    function updateBookingStats(bookings) {
        const stats = {
            total: bookings.length,
            active: bookings.filter(b => getBookingStatus(b).class === 'active').length,
            upcoming: bookings.filter(b => getBookingStatus(b).class === 'upcoming').length
        };

        const statCards = document.querySelectorAll('#bookings .stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.active;
            statCards[2].textContent = stats.upcoming;
        }
    }

    function cancelBooking(bookingId, type) {
        fetch(`/api/user/cancel-booking/${bookingId}?type=${type}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('ยกเลิกการจองสำเร็จ!');
                loadMyBookings();
            } else {
                alert('เกิดข้อผิดพลาด: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่สามารถยกเลิกการจองได้');
        });
    }

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        fetch('/auth/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                alert('ออกจากระบบสำเร็จ');
                window.location.href = '/login';
            } else {
                alert('เกิดข้อผิดพลาดในการออกจากระบบ');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        });
    });

    // Load initial data
    loadMyBookings();
});