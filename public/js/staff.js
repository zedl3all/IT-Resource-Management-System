document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    // * Handle menu item clicks
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
                    if (targetSection === 'rooms') {
                        loadRooms();
                    }
                    else if (targetSection === 'items') {
                        loadEquipments();
                    }
                    else if (targetSection === 'repairs') {
                        loadMaintenance();
                    }
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // *load rooms data
    function loadRooms() {
        fetch('/api/rooms')
            .then(response => response.json())
            .then(data => {
                const roomsTableBody = document.querySelector('#rooms-table tbody');
                console.log(data);
                roomsTableBody.innerHTML = '';
                data.rooms.forEach(room => {
                    const row = document.createElement('tr');

                    // กำหนดสถานะห้อง
                    let statusClass, statusText;
                    if (room.status === 1) {
                        statusClass = 'available';
                        statusText = 'ว่าง';
                    } else if (room.status === 0) {
                        statusClass = 'booked';
                        statusText = 'จองแล้ว';
                    } else {
                        statusClass = 'maintenance';
                        statusText = 'กำลังซ่อม';
                    }

                    row.innerHTML = `
                    <td>${room.room_id}</td>
                    <td>${room.room_name}</td>
                    <td>${room.description}</td>
                    <td>${room.capacity} คน</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td class="actions">
                        <button class="btn-view-room" data-room-id="${room.room_id}"><i class="fas fa-calendar"></i></button>
                        <button class="btn-edit" data-room-id="${room.room_id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-room-id="${room.room_id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                    roomsTableBody.appendChild(row);
                });
                // อัพเดทการ์ดสถิติ
                updateRoomStats(data.rooms);
            })
            .catch(error => console.error('Error loading rooms:', error));
    }

    // *update room stats
    function updateRoomStats(rooms) {
        const stats = {
            total: rooms.length,
            available: rooms.filter(room => room.status === 1).length,
            booked: rooms.filter(room => room.status === 0).length
        };
        const statCards = document.querySelectorAll('#rooms .stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.available;
            statCards[2].textContent = stats.booked;
        }
    }

    // *load equipments data
    function loadEquipments() {
        fetch('/api/equipments')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const itemsTableBody = document.querySelector('#items-table tbody');
                itemsTableBody.innerHTML = '';

                // ตรวจสอบว่า data มีโครงสร้างอย่างไร
                const equipments = data.equipments || data;

                equipments.forEach(item => {
                    const row = document.createElement('tr');

                    // กำหนดสถานะอุปกรณ์
                    let statusClass, statusText;
                    if (item.status === 1) {
                        statusClass = 'available';
                        statusText = 'ว่าง';
                    } else if (item.status === 0) {
                        statusClass = 'booked';
                        statusText = 'จองแล้ว';
                    } else {
                        statusClass = 'maintenance';
                        statusText = 'ซ่อมบำรุง';
                    }

                    row.innerHTML = `
                    <td>${item.equipment_id || item.e_id}</td>
                    <td>${item.equipment_name || item.name}</td>
                    <td>${item.type || item.description}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>${item.purchase_date || '15/06/2022'}</td>
                    <td class="actions">
                        <button class="btn-edit" data-item-id="${item.equipment_id || item.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-view" data-item-id="${item.equipment_id || item.id}"><i class="fas fa-eye"></i></button>
                        <button class="btn-delete" data-item-id="${item.equipment_id || item.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                    itemsTableBody.appendChild(row);
                });

                // อัพเดทการ์ดสถิติ
                updateEquipmentStats(equipments);
            })
            .catch(error => console.error('Error loading equipments:', error));
    }

    // *update equipment stats
    function updateEquipmentStats(equipments) {
        const stats = {
            total: equipments.length,
            available: equipments.filter(item => item.status === 1).length,
            booked: equipments.filter(item => item.status === 0).length
        };

        const statCards = document.querySelectorAll('#items .stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.available;
            statCards[2].textContent = stats.booked;
        }
    }

    // *load maintenance data
    function loadMaintenance() {
        fetch('/api/repairs')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const repairsTableBody = document.querySelector('#repairs-table tbody');
                repairsTableBody.innerHTML = '';

                // ตรวจสอบว่า data มีโครงสร้างอย่างไร
                const repairs = data.repairs || data;

                repairs.forEach(repair => {
                    const row = document.createElement('tr');

                    // กำหนดสถานะการซ่อม
                    let statusClass, statusText;
                    if (repair.status === 'pending') {
                        statusClass = 'pending';
                        statusText = 'รอดำเนินการ';
                    } else if (repair.status === 'in-progress') {
                        statusClass = 'in-progress';
                        statusText = 'กำลังซ่อม';
                    } else {
                        statusClass = 'completed';
                        statusText = 'ซ่อมเสร็จแล้ว';
                    }

                    // กำหนดเจ้าหน้าที่ผู้รับผิดชอบ
                    const staffName = repair.staff_name || repair.staff || '-';

                    // กำหนดรูปภาพ (ถ้ามี)
                    const images = repair.images ? repair.images.join(',') : '';

                    row.innerHTML = `
                    <td>${repair.repair_id || repair.id}</td>
                    <td>${repair.equipment_name || repair.item}</td>
                    <td>${repair.issue || repair.description}</td>
                    <td>${repair.location || '-'}</td>
                    <td>${staffName}</td>
                    <td>${repair.report_date || repair.date}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td class="actions">
                        <button class="btn-edit" data-repair-id="${repair.repair_id || repair.id}"><i class="fas fa-edit"></i></button>
                        ${images ? `<button class="btn-images" data-images="${images}"><i class="fas fa-images"></i></button>` : ''}
                    </td>
                `;
                    repairsTableBody.appendChild(row);
                });

                // อัพเดทการ์ดสถิติ
                updateRepairStats(repairs);
            })
            .catch(error => console.error('Error loading repairs:', error));
    }

    // *update repair stats
    function updateRepairStats(repairs) {
        const stats = {
            total: repairs.length,
            pending: repairs.filter(repair => repair.status === 'pending').length,
            inProgress: repairs.filter(repair => repair.status === 'in-progress').length,
            completed: repairs.filter(repair => repair.status === 'completed').length
        };

        const statCards = document.querySelectorAll('#repairs .stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.pending;
            statCards[2].textContent = stats.inProgress;
        }
    }

    // Modal functionality
    const modals = {
        room: document.getElementById('room-modal'),
        item: document.getElementById('item-modal'),
        repair: document.getElementById('repair-modal')
    };

    const addButtons = {
        room: document.getElementById('add-room-btn'),
        item: document.getElementById('add-item-btn'),
        repair: document.getElementById('add-repair-btn')
    };

    const closeButtons = document.querySelectorAll('.close, .btn-cancel');

    // Open modal functions
    addButtons.room.addEventListener('click', () => openModal('room'));
    addButtons.item.addEventListener('click', () => openModal('item'));
    addButtons.repair.addEventListener('click', () => openModal('repair'));

    // Close modal functions
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            for (const key in modals) {
                modals[key].style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        for (const key in modals) {
            if (e.target === modals[key]) {
                modals[key].style.display = 'none';
            }
        }
    });

    function openModal(type, data = null) {
        const modal = modals[type];
        const form = document.getElementById(`${type}-form`);
        
        // Reset form
        form.reset();
        
        // Set edit mode flag - initialize as false (new item)
        form.setAttribute('data-edit-mode', 'false');
        
        // If we have data (for edit), populate form fields
        if (data) {
            // Set edit mode flag to true
            form.setAttribute('data-edit-mode', 'true');

            document.getElementById(`${type}-modal-title`).textContent = `แก้ไขข้อมูล${type === 'room' ? 'ห้อง' : type === 'item' ? 'อุปกรณ์' : 'รายการซ่อม'}`;

            
            // Populate form fields based on data object
            for (const key in data) {
                const input = form.querySelector(`#${type}-${key}`);
                if (input) {
                    input.value = data[key];
                }
            }
        }
        
        // Show modal
        modal.style.display = 'block';
    }

    // Form submission handlers
    const forms = {
        room: document.getElementById('room-form'),
        item: document.getElementById('item-form'),
        repair: document.getElementById('repair-form')
    };

    forms.room.addEventListener('submit', (e) => {
        e.preventDefault();
        saveData('room', forms.room);
    });

    forms.item.addEventListener('submit', (e) => {
        e.preventDefault();
        saveData('item', forms.item);
    });

    forms.repair.addEventListener('submit', (e) => {
        e.preventDefault();
        saveData('repair', forms.repair);
    });

    // *Save data function (with update capability)
    function saveData(type, form) {
        // Get form data
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key.split('-')[1]] = value;
        }
        
        // Check if we're in edit mode
        const isEditMode = form.getAttribute('data-edit-mode') === 'true';
        const id = data.id;
        
        console.log(`${isEditMode ? 'Updating' : 'Creating new'} ${type} data:`, data);
        
        // Determine API endpoint and HTTP method based on edit mode
        let endpoint, method;
        
        if (isEditMode) {
            if (type === 'room') {
                endpoint = `/api/rooms/${id}`;
                method = 'PUT';
            } else if (type === 'item') {
                endpoint = `/api/equipments/${id}`;
                method = 'PUT';
            } else if (type === 'repair') {
                endpoint = `/api/repairs/${id}`;
                method = 'PUT';
            }
        } else {
            if (type === 'room') {
                endpoint = '/api/rooms';
                method = 'POST';
            } else if (type === 'item') {
                endpoint = '/api/equipments';
                method = 'POST';
            } else if (type === 'repair') {
                endpoint = '/api/repairs';
                method = 'POST';
            }
        }
        
        // Make API call
        fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            
            // Refresh data list based on type
            if (type === 'room') {
                loadRooms();
            } else if (type === 'item') {
                loadEquipments();
            } else if (type === 'repair') {
                loadMaintenance();
            }
            
            // Close modal
            modals[type].style.display = 'none';
            
            // Show success message
            const action = isEditMode ? 'อัพเดท' : 'บันทึก';
            const typeText = type === 'room' ? 'ห้อง' : type === 'item' ? 'อุปกรณ์' : 'รายการซ่อม';
            alert(`${action}ข้อมูล${typeText}สำเร็จ`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`เกิดข้อผิดพลาด! ไม่สามารถ${isEditMode ? 'อัพเดท' : 'บันทึก'}ข้อมูลได้`);
        });
    }

    // ใช้ event delegation สำหรับปุ่มทั้งหมด
    document.addEventListener('click', function (e) {
        // * 1. จัดการปุ่ม View Room
        if (e.target.closest('.btn-view-room')) {
            const button = e.target.closest('.btn-view-room');
            const row = button.closest('tr');
            const roomId = row.querySelector('td:first-child').textContent;
            const roomName = row.querySelector('td:nth-child(2)').textContent;
            const roomDescription = row.querySelector('td:nth-child(3)').textContent;
            const roomCapacity = row.querySelector('td:nth-child(4)').textContent;

            // อัพเดทข้อมูลห้องใน modal
            document.getElementById('booking-room-name').textContent = `${roomName} (${roomId})`;
            document.getElementById('booking-room-description').textContent = `รายละเอียด: ${roomDescription}`;
            document.getElementById('booking-room-capacity').textContent = `ความจุ: ${roomCapacity}`;

            // ตั้งค่าเดือนปัจจุบันในช่อง filter
            const currentDate = new Date();
            const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            document.getElementById('booking-month').value = currentMonth;

            // โหลดข้อมูลการจอง
            fetchRoomBookings(roomId);

            // แสดง modal
            document.getElementById('room-booking-modal').style.display = 'block';

            // เพิ่ม event listener สำหรับปุ่ม filter
            document.getElementById('filter-bookings').onclick = function () {
                const selectedMonth = document.getElementById('booking-month').value;
                fetchRoomBookings(roomId, selectedMonth);
            };
        }

        // * 2. จัดการปุ่ม Edit
        else if (e.target.closest('.btn-edit')) {
            const button = e.target.closest('.btn-edit');
            const row = button.closest('tr');
            const tableId = button.closest('table').id;
            const type = tableId.split('-')[0]; // rooms, items, or repairs

            // Get data from the row
            const data = {};
            const cells = row.querySelectorAll('td');

            if (type === 'rooms') {
                console.log(data);
                data.id = cells[0].textContent;
                data.name = cells[1].textContent;
                data.description = cells[2].textContent;
                data.capacity = cells[3].textContent.replace(' คน', '');
                if (cells[4].querySelector('.status').classList.contains('available')) {
                    data.status = "1";
                } else if (cells[4].querySelector('.status').classList.contains('booked')) {
                    data.status = "0";
                } else {
                    data.status = "-1"; // maintenance
                }
            } else if (type === 'items') {
                data.id = cells[0].textContent;
                data.name = cells[1].textContent;
                data.type = cells[2].textContent;
                data.status = cells[3].querySelector('.status').classList.contains('available') ? 'available' :
                    cells[3].querySelector('.status').classList.contains('booked') ? 'booked' : 'maintenance';
                data['purchase-date'] = cells[4].textContent;
            } else if (type === 'repairs') {
                data.id = cells[0].textContent;
                data.item = cells[1].textContent;
                data.issue = cells[2].textContent;
                data.location = cells[3].textContent;
                data.staff = cells[4].textContent;
                data.date = cells[5].textContent;
                data.status = cells[6].querySelector('.status').classList.contains('pending') ? 'pending' :
                    cells[6].querySelector('.status').classList.contains('in-progress') ? 'in-progress' : 'completed';
            }

            // Open modal with data
            openModal(type.slice(0, -1), data);
        }

        // * 3. จัดการปุ่ม Delete
        else if (e.target.closest('.btn-delete')) {
            const button = e.target.closest('.btn-delete');
            const row = button.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            let type = button.closest('table').id.split('-')[0]; // rooms or items
            if (type === 'items') {
                type = 'equipments'; // Adjust for API endpoint
            }
            console.log(`Attempting to delete ${type} with ID: ${id}`);
            if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ${type === 'rooms' ? 'ห้อง' : 'อุปกรณ์'} ${id}?`)) {
                // TODO: Add API call to delete data
                fetch(`/api/${type}/${id}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log('Deleted successfully:', result);
                    console.log(`Deleting ${type} with ID: ${id}`);
                })
                .catch(error => {
                    console.error('Error deleting:', error);
                });
                // Refresh data list based on type
                if (type === 'rooms') {
                    loadRooms();
                } else if (type === 'items') {
                    loadEquipments();
                } else if (type === 'repairs') {
                    loadMaintenance();
                }
                alert('ลบข้อมูลสำเร็จ');
            }
        }

        // * 4. จัดการปุ่ม View (สำหรับอุปกรณ์)
        else if (e.target.closest('.btn-view')) {
            const button = e.target.closest('.btn-view');
            const row = button.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            const name = row.querySelector('td:nth-child(2)').textContent;
            const type = row.querySelector('td:nth-child(3)').textContent;
            const status = row.querySelector('td:nth-child(4) .status').textContent;
            const purchaseDate = row.querySelector('td:nth-child(5)').textContent;

            // อัพเดตข้อมูลใน modal
            document.getElementById('details-item-name').textContent = `${name} (${id})`;
            document.getElementById('details-item-types').innerHTML = `<span class="item-type">${type}</span>`;
            document.getElementById('details-purchase-date').textContent = purchaseDate;

            // แสดง modal
            document.getElementById('item-details-modal').style.display = 'block';
        }

        // * 5. จัดการปุ่มดูรูปภาพ
        else if (e.target.closest('.btn-images')) {
            const button = e.target.closest('.btn-images');
            const imageList = button.getAttribute('data-images').split(',');
            const images = imageList.map(img => `/images/${img.trim()}`);
            const imageThumbnails = document.getElementById('image-thumbnails');

            // Clear existing thumbnails
            imageThumbnails.innerHTML = '';

            // Add thumbnails
            images.forEach((src, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = `image-thumbnail ${index === 0 ? 'active' : ''}`;

                const img = document.createElement('img');
                img.src = src;
                img.alt = `Thumbnail ${index + 1}`;

                thumbnail.appendChild(img);
                imageThumbnails.appendChild(thumbnail);

                thumbnail.addEventListener('click', () => {
                    setCurrentImage(index);
                });
            });

            // Set first image as current
            currentImageIndex = 0;
            setCurrentImage(currentImageIndex);

            // Show modal
            document.getElementById('image-viewer-modal').style.display = 'block';
        }
    });

    // Modals close buttons - คงเดิม
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Navigation functions for image viewer
    function setCurrentImage(index) {
        // ใช้โค้ดเดิม
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        currentImageIndex = index;
        mainImage.src = images[index];
        imageCounter.textContent = `${index + 1}/${images.length}`;

        // Update active thumbnail
        document.querySelectorAll('.image-thumbnail').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // เพิ่ม global variables ที่จำเป็น
    const mainImage = document.getElementById('main-image');
    const imageCounter = document.getElementById('image-counter');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    let currentImageIndex = 0;
    let images = [];

    // เพิ่ม event listeners สำหรับปุ่มเลื่อนรูป
    prevButton.addEventListener('click', () => {
        setCurrentImage(currentImageIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        setCurrentImage(currentImageIndex + 1);
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            fetch('/auth/logout', {
                method: 'POST',
                credentials: 'same-origin', // ส่ง cookies ไปด้วย
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        alert('ออกจากระบบสำเร็จ');
                        window.location.href = '/login'; // redirect ไปที่หน้า login
                    } else {
                        alert('เกิดข้อผิดพลาดในการออกจากระบบ');
                    }
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                });
        });
    }


    // !Load initial data
    loadRooms();

    // *ฟังก์ชันสำหรับดึงข้อมูลการจองห้อง
    function fetchRoomBookings(roomId, month = null) {
        // ในกรณีมีการเลือกเดือน จะส่งเดือนไปด้วย
        const queryParams = month ? `/month/?month=${month}` : '';

        // แสดง loading indicator
        const bookingsContainer = document.getElementById('bookings-container');
        bookingsContainer.innerHTML = '<div class="loading-spinner">กำลังโหลดข้อมูล...</div>';

        // เพิ่ม element no-bookings ทุกครั้งที่โหลดข้อมูลใหม่
        const noBookingsMsg = document.createElement('div');
        noBookingsMsg.id = 'no-bookings';
        noBookingsMsg.className = 'no-bookings';
        noBookingsMsg.style.textAlign = 'center';
        noBookingsMsg.style.padding = '20px';
        noBookingsMsg.style.display = 'none';
        noBookingsMsg.textContent = 'ไม่พบข้อมูลการจองในช่วงเวลาที่เลือก';
        bookingsContainer.appendChild(noBookingsMsg);

        console.log(`/api/rooms/${roomId}/bookings${queryParams}`);

        // เรียกข้อมูลจาก API
        fetch(`/api/rooms/${roomId}/bookings${queryParams}`)
            .then(response => response.json())
            .then(data => {
                console.log('Room bookings data:', data);
                // เคลียร์ container
                bookingsContainer.innerHTML = '';

                // เพิ่ม element no-bookings อีกครั้งหลังจาก clear container
                const noBookingsMsg = document.createElement('div');
                noBookingsMsg.id = 'no-bookings';
                noBookingsMsg.className = 'no-bookings';
                noBookingsMsg.style.textAlign = 'center';
                noBookingsMsg.style.padding = '20px';
                noBookingsMsg.style.display = 'none';
                noBookingsMsg.textContent = 'ไม่พบข้อมูลการจองในช่วงเวลาที่เลือก';
                bookingsContainer.appendChild(noBookingsMsg);

                // ตรวจสอบว่ามีข้อมูลการจองหรือไม่ และข้อมูลมีโครงสร้างแบบไหน
                const bookings = Array.isArray(data) ? data : (data.bookings || []);

                if (bookings.length === 0) {
                    document.getElementById('no-bookings').style.display = 'block';
                    return;
                }

                document.getElementById('no-bookings').style.display = 'none';

                // เรียงลำดับตามวันที่และเวลา
                bookings.sort((a, b) => {
                    const dateA = new Date(a.booking_date);
                    const dateB = new Date(b.booking_date);
                    return dateA - dateB;
                });

                // จัดกลุ่มตามวันที่
                const bookingsByDate = {};

                bookings.forEach(booking => {
                    const date = new Date(booking.booking_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    if (!bookingsByDate[date]) {
                        bookingsByDate[date] = [];
                    }

                    bookingsByDate[date].push(booking);
                });

                // สร้าง HTML สำหรับแต่ละกลุ่มวันที่
                for (const date in bookingsByDate) {
                    const bookings = bookingsByDate[date];

                    // ตรวจสอบว่าวันนี้เป็นวันปัจจุบันหรือไม่
                    const bookingDate = new Date(bookings[0].booking_date);
                    const today = new Date();
                    const isToday = bookingDate.toDateString() === today.toDateString();

                    bookings.forEach(booking => {
                        // ตรวจสอบสถานะการจอง
                        let statusClass, statusText;
                        const now = new Date();
                        const startTime = new Date(booking.booking_date + 'T' + booking.start_time);
                        const endTime = new Date(booking.booking_date + 'T' + booking.end_time);

                        if (now >= startTime && now <= endTime) {
                            statusClass = 'current';
                            statusText = 'กำลังใช้งาน';
                        } else if (now < startTime) {
                            statusClass = 'upcoming';
                            statusText = 'รอใช้งาน';
                        } else {
                            statusClass = 'completed';
                            statusText = 'เสร็จสิ้น';
                        }

                        // สร้าง element สำหรับการจองนี้
                        const bookingItem = document.createElement('div');
                        bookingItem.className = 'booking-item';

                        bookingItem.innerHTML = `
                        <div class="booking-header">
                            <div class="booking-date">${isToday ? 'วันนี้' : date}</div>
                            <span class="booking-status ${statusClass}">${statusText}</span>
                        </div>
                        <div class="booking-body">
                            <div class="booking-time">
                                <i class="fas fa-clock"></i>
                                <span>${formatTime(booking.start_time)} - ${formatTime(booking.end_time)} น.</span>
                            </div>
                            <div class="booking-user">
                                <i class="fas fa-user"></i>
                                <span>${booking.username} ${booking.department ? `(${booking.department})` : ''}</span>
                            </div>
                            <div class="booking-purpose">
                                <i class="fas fa-clipboard"></i>
                                <span>${booking.purpose || 'ไม่ระบุ'}</span>
                            </div>
                        </div>
                    `;

                        bookingsContainer.appendChild(bookingItem);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching room bookings:', error);
                bookingsContainer.innerHTML = `
                    <div class="error-message">ไม่สามารถโหลดข้อมูลการจองได้</div>
                    <div id="no-bookings" style="display:none;"></div>
                `;
            });
    }

    // ฟังก์ชันช่วย format เวลา
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    }
});