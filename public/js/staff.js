document.addEventListener('DOMContentLoaded', function () {
    // ===== Constants =====
    const API_ENDPOINTS = {
        ROOMS: '/api/rooms',
        EQUIPMENTS: '/api/equipments',
        MAINTENANCES: '/api/maintenances',
        EQUIPMENT_TYPES: '/api/equipment-types',
        STAFF: '/api/users/staff/all',
        IMAGES: '/api/images'
    };

    const STATUS_MAPPING = {
        // Room & Equipment statuses
        AVAILABLE: 1,
        BOOKED: 0,
        MAINTENANCE: -1,
        // Repair statuses
        PENDING: 0,
        IN_PROGRESS: -1,
        COMPLETED: 1
    };

    // ===== DOM Elements =====
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    
    const modals = {
        room: document.getElementById('room-modal'),
        item: document.getElementById('item-modal'),
        repair: document.getElementById('repair-modal'),
        roomBooking: document.getElementById('room-booking-modal'),
        itemDetails: document.getElementById('item-details-modal'),
        imageViewer: document.getElementById('image-viewer-modal')
    };
    
    const forms = {
        room: document.getElementById('room-form'),
        item: document.getElementById('item-form'),
        repair: document.getElementById('repair-form')
    };
    
    const addButtons = {
        room: document.getElementById('add-room-btn'),
        item: document.getElementById('add-item-btn')
    };
    
    const closeButtons = document.querySelectorAll('.close, .btn-cancel');
    const mainImage = document.getElementById('main-image');
    const imageCounter = document.getElementById('image-counter');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.querySelector('.search-bar input');
    
    // ===== State =====
    let currentImageIndex = 0;
    let images = [];

    // ===== Event Listeners =====
    // Tab switching
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });
    
    // Form submissions
    forms.room.addEventListener('submit', e => handleFormSubmit(e, 'room'));
    forms.item.addEventListener('submit', e => handleFormSubmit(e, 'item'));
    forms.repair.addEventListener('submit', e => handleFormSubmit(e, 'repair'));
    
    // Modal actions
    addButtons.room.addEventListener('click', () => openModal('room'));
    addButtons.item.addEventListener('click', () => openModal('item'));
    
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Image viewer controls
    prevButton.addEventListener('click', () => setCurrentImage(currentImageIndex - 1));
    nextButton.addEventListener('click', () => setCurrentImage(currentImageIndex + 1));
    
    // Global click handlers
    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('click', handleWindowClick);
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Item type selection - make checkbox exclusive (radio-like behavior)
    document.getElementById('item-types-container').addEventListener('change', function(e) {
        if (e.target.name === 'item-type[]') {
            const checkboxes = document.querySelectorAll('input[name="item-type[]"]');
            checkboxes.forEach(checkbox => {
                if (checkbox !== e.target) checkbox.checked = false;
            });
        }
    });
    
    // Search input handling
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // ===== Core Functions =====
    
    // Menu & Section Navigation
    function handleMenuClick(e) {
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
                
                // Load data for active section
                if (targetSection === 'rooms') loadRooms();
                else if (targetSection === 'items') loadEquipments();
                else if (targetSection === 'repairs') loadMaintenance();
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // Data Loading Functions
    function loadRooms() {
        fetchData(API_ENDPOINTS.ROOMS)
            .then(data => {
                const roomsTableBody = document.querySelector('#rooms-table tbody');
                roomsTableBody.innerHTML = '';
                
                data.rooms.forEach(room => {
                    const row = document.createElement('tr');
                    const statusInfo = getRoomStatusInfo(room.status);
                    
                    row.innerHTML = `
                        <td>${room.room_id}</td>
                        <td>${room.room_name}</td>
                        <td>${room.description}</td>
                        <td>${room.capacity} คน</td>
                        <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
                        <td class="actions">
                            <button class="btn-view-room" data-room-id="${room.room_id}"><i class="fas fa-calendar"></i></button>
                            <button class="btn-edit" data-room-id="${room.room_id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" data-room-id="${room.room_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    roomsTableBody.appendChild(row);
                });
                
                updateRoomStats(data.rooms);
            })
            .catch(error => console.error('Error loading rooms:', error));
    }
    
    function loadEquipments() {
        fetchData(API_ENDPOINTS.EQUIPMENTS)
            .then(data => {
                const itemsTableBody = document.querySelector('#items-table tbody');
                itemsTableBody.innerHTML = '';
                
                const equipments = data.equipments;
                
                equipments.forEach(item => {
                    const row = document.createElement('tr');
                    const statusInfo = getEquipmentStatusInfo(item.status);
                    
                    row.innerHTML = `
                        <td>${item.equipment_id || item.e_id}</td>
                        <td>${item.equipment_name || item.name}</td>
                        <td>${item.type_name || item.description}</td>
                        <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
                        <td class="actions">
                            <button class="btn-edit" data-item-id="${item.equipment_id || item.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-view" data-item-id="${item.equipment_id || item.id}"><i class="fas fa-eye"></i></button>
                            <button class="btn-delete" data-item-id="${item.equipment_id || item.id}"><i class="fas fa-trash"></i></button>
                        </td>
                        <td style="display:none;">${item.type_id}</td>
                    `;
                    itemsTableBody.appendChild(row);
                });
                
                updateEquipmentStats(equipments);
            })
            .catch(error => console.error('Error loading equipments:', error));
    }
    
    function loadMaintenance() {
        fetchData(API_ENDPOINTS.MAINTENANCES)
            .then(data => {
                const repairsTableBody = document.querySelector('#repairs-table tbody');
                repairsTableBody.innerHTML = '';
                
                data.Maintenances.forEach(repair => {
                    const row = document.createElement('tr');
                    const statusInfo = getRepairStatusInfo(repair.status);
                    const staffName = repair.staff_fullname|| '-';
                    const images = repair.image ? repair.image : '';
                    const date = repair.DT_report || repair.date || '';
                    const formattedDate = date ? new Date(date).toLocaleDateString('th-TH') : '';
                    
                    row.innerHTML = `
                        <td>${repair.request_id}</td>
                        <td>${repair.equipment}</td>
                        <td>${repair.problem_description}</td>
                        <td>${repair.location || '-'}</td>
                        <td>${staffName}</td>
                        <td>${formattedDate}</td>
                        <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
                        <td class="actions">
                            <button class="btn-edit" data-repair-id="${repair.request_id}"><i class="fas fa-edit"></i></button>
                            ${images ? `<button class="btn-images" data-images="${images}"><i class="fas fa-images"></i></button>` : ''}
                        </td>
                    `;
                    repairsTableBody.appendChild(row);
                });
                
                updateRepairStats(data.Maintenances);
            })
            .catch(error => console.error('Error loading repairs:', error));
    }
    
    // Statistics Updates
    function updateRoomStats(rooms) {
        const stats = {
            total: rooms.length,
            available: rooms.filter(room => room.status === STATUS_MAPPING.AVAILABLE).length,
            booked: rooms.filter(room => room.status === STATUS_MAPPING.BOOKED).length
        };
        
        updateStatCards('#rooms', stats);
    }
    
    function updateEquipmentStats(equipments) {
        const stats = {
            total: equipments.length,
            available: equipments.filter(item => item.status === STATUS_MAPPING.AVAILABLE).length,
            booked: equipments.filter(item => item.status === STATUS_MAPPING.BOOKED).length
        };
        updateStatCards('#items', stats);
    }
    
    function updateRepairStats(repairs) {
        const stats = {
            total: repairs.length,
            pending: repairs.filter(repair => repair.status === STATUS_MAPPING.PENDING).length,
            inProgress: repairs.filter(repair => repair.status === STATUS_MAPPING.IN_PROGRESS).length,
            completed: repairs.filter(repair => repair.status === STATUS_MAPPING.COMPLETED).length
        };
        
        const statCards = document.querySelectorAll('#repairs .stat-card .stat-value');
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.pending;
            statCards[2].textContent = stats.inProgress;
        }
    }
    
    function updateStatCards(selector, stats) {
        const statCards = document.querySelectorAll(`${selector} .stat-card .stat-value`);
        if (statCards.length >= 3) {
            const mid = (stats.available ?? stats.pending) ?? 0;
            const last = (stats.booked ?? stats.inProgress) ?? 0;
            statCards[0].textContent = stats.total ?? 0;
            statCards[1].textContent = mid;
            statCards[2].textContent = last;
        }
    }
    
    // Modal Functions
    function openModal(type, data = null) {
        const modal = modals[type];
        const form = document.getElementById(`${type}-form`);
        
        // Reset form
        form.reset();
        form.setAttribute('data-edit-mode', 'false');
        
        // Reset fields to editable state
        const allInputs = form.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            input.disabled = false;
            input.parentElement.classList.remove('disabled-field');
        });
        
        // Handle edit mode
        if (data) {
            form.setAttribute('data-edit-mode', 'true');
            form.setAttribute('data-item-id', data.id);
            
            updateModalTitle(type);
            populateFormFields(type, form, data);
            
            // Special handling for repair form
            if (type === 'repair') {
                handleRepairEditMode(form, data);
            }
        }
        
        // Load related data
        if (type === 'item') {
            loadEquipmentTypes().then(() => {
                if (data && data.type) {
                    setSelectedEquipmentTypes(data);
                }
            });
        }
        
        if (type === 'repair') {
            loadStaffMembers().then(() => {
                if (data && data.staff) {
                    selectStaffMember(data.staff);
                }
            });
        }
        
        // Show modal
        modal.style.display = 'block';
    }
    
    function handleRepairEditMode(form, data) {
        const fieldsToLock = [
            'repair-id', 'repair-item', 'repair-issue', 'repair-location',
            'repair-images', 'repair-date', 'repair-notes'
        ];
        
        fieldsToLock.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.disabled = true;
                field.parentElement.classList.add('disabled-field');
            }
        });
        
        const fileUploadLabel = form.querySelector('.file-upload-label');
        if (fileUploadLabel) {
            fileUploadLabel.style.pointerEvents = 'none';
            fileUploadLabel.style.opacity = '0.6';
        }
        
        // ดูแลเรื่องการเลือกเจ้าหน้าที่ปัจจุบันในตัวเลือก
        loadStaffMembers().then(() => {
            if (data && data.staff && data.staff !== '-') {
                // ทำการเลือกเจ้าหน้าที่ปัจจุบันในตัวเลือก
                selectStaffMember(data.staff);
            }
        });
    }
    
    function updateModalTitle(type) {
        const modalTitle = document.getElementById(`${type}-modal-title`);
        if (modalTitle) {
            modalTitle.textContent = `แก้ไขข้อมูล${getEntityName(type)}`;
        }
    }
    
    function populateFormFields(type, form, data) {
        for (const key in data) {
            // Skip the types field for equipment as we handle it separately
            if (type === 'item' && key === 'type') continue;
            
            const input = form.querySelector(`#${type}-${key}`);
            if (input) {
                input.value = data[key];
            }
        }
    }
    
    function closeAllModals() {
        const allModals = document.querySelectorAll('.modal');
        allModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Form Submission
    function handleFormSubmit(e, type) {
        e.preventDefault();
        saveData(type, forms[type]);
    }
    
    function saveData(type, form) {
        // Get form data
        const formData = new FormData(form);
        const data = extractFormData(type, formData);
        
        // Check edit mode and get ID
        const isEditMode = form.getAttribute('data-edit-mode') === 'true';
        const id = isEditMode ? form.getAttribute('data-item-id') : null;
        
        // Map status values to numbers
        mapStatusValues(data);
        
        // Determine API endpoint and HTTP method
        const { endpoint, method } = determineApiEndpoint(type, id, isEditMode);
        
        // Make API call
        if (endpoint) {
            if (type === 'repair' && isEditMode) {
                const repairData = {
                    staff_id: data.staff,
                    status: data.status
                };
                
                sendApiRequest(endpoint, method, repairData, type, isEditMode);
            } else {
                sendApiRequest(endpoint, method, data, type, isEditMode);
            }
        } else {
            alert('Error: Cannot determine API endpoint');
        }
    }
    
    function extractFormData(type, formData) {
        const data = {};
        
        // Process regular form fields
        for (const [key, value] of formData.entries()) {
            if (key === 'item-type[]') continue;
            data[key.split('-')[1]] = value;
        }
        
        // Special handling for equipment types
        if (type === 'item') {
            const checkedTypes = [];
            document.querySelectorAll('#item-types-container input[name="item-type[]"]:checked').forEach(checkbox => {
                checkedTypes.push(checkbox.value);
            });
            data.type = checkedTypes.join(',');
        }
        
        return data;
    }
    
    function mapStatusValues(data) {
        if (data.status === "available") data.status = STATUS_MAPPING.AVAILABLE;
        else if (data.status === "booked") data.status = STATUS_MAPPING.BOOKED;
        else if (data.status === "maintenance") data.status = STATUS_MAPPING.MAINTENANCE;
        else if (data.status === "pending") data.status = STATUS_MAPPING.PENDING;
        else if (data.status === "in-progress") data.status = STATUS_MAPPING.IN_PROGRESS;
        else if (data.status === "completed") data.status = STATUS_MAPPING.COMPLETED;
    }
    
    function determineApiEndpoint(type, id, isEditMode) {
        let endpoint, method;
        
        if (isEditMode) {
            if (type === 'room') {
                endpoint = `${API_ENDPOINTS.ROOMS}/${id}`;
                method = 'PUT';
            } else if (type === 'item') {
                endpoint = `${API_ENDPOINTS.EQUIPMENTS}/${id}`;
                method = 'PUT';
            } else if (type === 'repair') {
                endpoint = `${API_ENDPOINTS.MAINTENANCES}/${id}/updateStaffAndStatus`;
                method = 'PATCH';
            }
        } else {
            if (type === 'room') {
                endpoint = API_ENDPOINTS.ROOMS;
                method = 'POST';
            } else if (type === 'item') {
                endpoint = API_ENDPOINTS.EQUIPMENTS;
                method = 'POST';
            } else if (type === 'repair') {
                endpoint = API_ENDPOINTS.MAINTENANCES;
                method = 'POST';
            }
        }
        
        return { endpoint, method };
    }
    
    function sendApiRequest(endpoint, method, data, type, isEditMode) {
        fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(result => {
            // Refresh data
            if (type === 'room') loadRooms();
            else if (type === 'item') loadEquipments();
            else if (type === 'repair') loadMaintenance();
            
            // Close modal and show success message
            modals[type].style.display = 'none';
            const action = isEditMode ? 'อัพเดท' : 'บันทึก';
            const typeText = getEntityName(type);
            alert(`${action}ข้อมูล${typeText}สำเร็จ`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`เกิดข้อผิดพลาด! ไม่สามารถ${isEditMode ? 'อัพเดท' : 'บันทึก'}ข้อมูลได้`);
        });
    }
    
    // Room Booking Modal
    function handleViewRoom(button) {
        const row = button.closest('tr');
        const roomId = row.querySelector('td:first-child').textContent;
        const roomName = row.querySelector('td:nth-child(2)').textContent;
        const roomDescription = row.querySelector('td:nth-child(3)').textContent;
        const roomCapacity = row.querySelector('td:nth-child(4)').textContent;
        
        // Update room info in modal
        document.getElementById('booking-room-name').textContent = `${roomName} (${roomId})`;
        document.getElementById('booking-room-description').textContent = `รายละเอียด: ${roomDescription}`;
        document.getElementById('booking-room-capacity').textContent = `ความจุ: ${roomCapacity}`;
        
        // Set current month in filter
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        document.getElementById('booking-month').value = currentMonth;
        
        // Load bookings
        fetchRoomBookings(roomId);
        
        // Show modal
        modals.roomBooking.style.display = 'block';
        
        // Add event listener for filter button
        document.getElementById('filter-bookings').onclick = function() {
            const selectedMonth = document.getElementById('booking-month').value;
            fetchRoomBookings(roomId, selectedMonth);
        };
    }
    
    function fetchRoomBookings(roomId, month = null) {
        const queryParams = month ? `/month/?month=${month}` : '';
        const bookingsContainer = document.getElementById('bookings-container');
        
        // Show loading indicator
        bookingsContainer.innerHTML = '<div class="loading-spinner">กำลังโหลดข้อมูล...</div>';
        
        // Add no-bookings message element
        const noBookingsMsg = createNoBookingsMessage();
        bookingsContainer.appendChild(noBookingsMsg);
        
        fetch(`${API_ENDPOINTS.ROOMS}/${roomId}/bookings${queryParams}`)
            .then(response => response.json())
            .then(data => {
                bookingsContainer.innerHTML = '';
                
                // Re-add no-bookings message after clearing container
                const noBookingsMsg = createNoBookingsMessage();
                bookingsContainer.appendChild(noBookingsMsg);
                
                const bookings = Array.isArray(data) ? data : (data.bookings || []);
                
                if (bookings.length === 0) {
                    document.getElementById('no-bookings').style.display = 'block';
                    return;
                }
                
                document.getElementById('no-bookings').style.display = 'none';
                
                // Sort bookings by date and time
                bookings.sort((a, b) => {
                    return new Date(a.booking_date) - new Date(b.booking_date);
                });
                
                // Group bookings by date
                const bookingsByDate = groupBookingsByDate(bookings);
                
                // Create booking items for each date group
                createBookingItems(bookingsByDate, bookingsContainer);
            })
            .catch(error => {
                console.error('Error fetching room bookings:', error);
                bookingsContainer.innerHTML = `
                    <div class="error-message">ไม่สามารถโหลดข้อมูลการจองได้</div>
                    <div id="no-bookings" style="display:none;"></div>
                `;
            });
    }
    
    // Equipment Details Modal
    function handleViewEquipment(button) {
        const row = button.closest('tr');
        const id = row.querySelector('td:first-child').textContent;
        const name = row.querySelector('td:nth-child(2)').textContent;
        const type = row.querySelector('td:nth-child(3)').textContent;
        const statusElement = row.querySelector('td:nth-child(4) .status');
        const statusText = statusElement.textContent;
        const statusClass = statusElement.classList.contains('available') ? 'available' :
                          statusElement.classList.contains('booked') ? 'booked' : 'maintenance';
        
        // Update equipment info in modal
        document.getElementById('details-item-name').textContent = `${name} (${id})`;
        document.getElementById('details-item-types').innerHTML = `<span class="item-type">${type}</span>`;
        document.getElementById('details-item-status').textContent = statusText;
        document.getElementById('details-item-status').className = `status ${statusClass}`;
        
        // Fetch loan details
        fetch(`${API_ENDPOINTS.EQUIPMENTS}/${id}/loans`)
            .then(response => response.json())
            .then(data => {
                // If equipment has active loans
                if (data && data.loans && data.loans.length > 0) {
                    // If equipment is available, don't show booking info
                    if (data.loans[0].status === STATUS_MAPPING.AVAILABLE) {
                        hideEquipmentBookingInfo(id);
                    } else {
                        // Show loan details
                        const loan = data.loans[0];
                        showEquipmentBookingInfo(loan, id);
                    }
                } else {
                    hideEquipmentBookingInfo(id);
                }
            })
            .catch(error => {
                console.error('Error fetching loan details:', error);
                hideEquipmentBookingInfo(id);
            });
        
        // Show modal
        modals.itemDetails.style.display = 'block';
    }
    
    function showEquipmentBookingInfo(loan, equipmentId) {
        document.getElementById('booking-info-section').style.display = 'block';
        
        // Update booking details
        document.getElementById('details-borrower').textContent = loan.user_name || '';
        
        // Format dates and times
        const borrowDateTime = new Date(loan.borrow_DT);
        const returnDateTime = new Date(loan.return_DT);
        
        const borrowDate = borrowDateTime.toISOString().split('T')[0];
        const borrowTime = borrowDateTime.toTimeString().slice(0, 5);
        const returnDate = returnDateTime.toISOString().split('T')[0];
        const returnTime = returnDateTime.toTimeString().slice(0, 5);
        
        // Update date and time fields
        document.getElementById('details-borrow-date').textContent = borrowDate;
        document.getElementById('details-borrow-time').textContent = borrowTime + ' น.';
        document.getElementById('details-return-date').textContent = returnDate;
        document.getElementById('details-return-time').textContent = returnTime + ' น.';
        
        // Update additional info
        document.getElementById('details-loan-id').textContent = loan.loan_id || '';
        document.getElementById('details-equipment-id').textContent = loan.e_id || '';
        document.getElementById('details-user-id').textContent = loan.user_id || '';
    }
    
    function hideEquipmentBookingInfo(equipmentId) {
        document.getElementById('booking-info-section').style.display = 'none';
        document.getElementById('details-loan-id').textContent = '-';
        document.getElementById('details-equipment-id').textContent = equipmentId;
        document.getElementById('details-user-id').textContent = '-';
    }
    
    // Image Viewer
    function handleViewImages(button) {
        const imagesAttr = button.getAttribute('data-images');
        
        // Validate images data
        if (!imagesAttr) {
            alert('ไม่พบรูปภาพสำหรับรายการนี้');
            return;
        }
        
        const imageList = imagesAttr.split(',').filter(img => img.trim());
        if (imageList.length === 0) {
            alert('ไม่พบรูปภาพสำหรับรายการนี้');
            return;
        }
        
        // Create image URLs
        images = imageList.map(img => `${API_ENDPOINTS.IMAGES}?path=${img.trim().replace(/^\.\/Images\//, '')}`);
        
        // Create thumbnails
        createImageThumbnails(images);
        
        // Set first image as current
        currentImageIndex = 0;
        setCurrentImage(currentImageIndex);
        
        // Show modal
        modals.imageViewer.style.display = 'block';
    }
    
    function createImageThumbnails(images) {
        const imageThumbnails = document.getElementById('image-thumbnails');
        imageThumbnails.innerHTML = '';
        
        images.forEach((src, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `image-thumbnail ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Thumbnail ${index + 1}`;
            
            thumbnail.appendChild(img);
            imageThumbnails.appendChild(thumbnail);
            
            thumbnail.addEventListener('click', () => setCurrentImage(index));
        });
    }
    
    function setCurrentImage(index) {
        if (!images || images.length === 0) {
            console.error('No images available to display');
            return;
        }
        
        // Handle edge cases
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        
        currentImageIndex = index;
        
        const imageUrl = images[index] || '';
        if (!imageUrl) {
            console.error('Invalid image URL at index:', index);
            return;
        }
        
        mainImage.src = imageUrl;
        imageCounter.textContent = `${index + 1}/${images.length}`;
        
        // Update active thumbnail
        document.querySelectorAll('.image-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    // Edit & Delete Actions
    function handleEdit(button) {
        const row = button.closest('tr');
        const tableId = button.closest('table').id;
        const type = tableId.split('-')[0]; // rooms, items, or repairs
        
        const data = extractRowData(row, type);
        
        // Open modal with data
        openModal(type.slice(0, -1), data);
    }
    
    function extractRowData(row, type) {
        const cells = row.querySelectorAll('td');
        const data = {};
        
        if (type === 'rooms') {
            data.id = cells[0].textContent;
            data.name = cells[1].textContent;
            data.description = cells[2].textContent;
            data.capacity = cells[3].textContent.replace(' คน', '');
            
            if (cells[4].querySelector('.status').classList.contains('available')) {
                data.status = "available";
            } else if (cells[4].querySelector('.status').classList.contains('booked')) {
                data.status = "booked";
            } else {
                data.status = "maintenance";
            }
        } 
        else if (type === 'items') {
            data.id = cells[0].textContent;
            data.name = cells[1].textContent;
            data.type = cells[2].textContent;
            data.status = cells[3].querySelector('.status').classList.contains('available') ? 'available' :
                      cells[3].querySelector('.status').classList.contains('booked') ? 'booked' : 'maintenance';
            data.type_id = cells[5].textContent; // Hidden type_id column
        } 
        else if (type === 'repairs') {
            data.id = cells[0].textContent;
            data.item = cells[1].textContent;
            data.issue = cells[2].textContent;
            data.location = cells[3].textContent;
            data.staff = cells[4].textContent;
            data.date = cells[5].textContent;
            data.status = cells[6].querySelector('.status').classList.contains('pending') ? 'pending' :
                      cells[6].querySelector('.status').classList.contains('in-progress') ? 'in-progress' : 'completed';
        }
        
        return data;
    }
    
    function handleDelete(button) {
        const row = button.closest('tr');
        const id = row.querySelector('td:first-child').textContent;
        let type = button.closest('table').id.split('-')[0]; // rooms or items
        
        if (type === 'items') {
            type = 'equipments'; // Adjust for API endpoint
        }
        
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ${getEntityName(type)} ID: ${id}?`)) {
            fetch(`/api/${type}/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                // Refresh data
                if (type === 'rooms') {
                    loadRooms();
                } else if (type === 'equipments') {
                    loadEquipments();
                }
                alert('ลบข้อมูลสำเร็จ');
            })
            .catch(error => {
                console.error('Error deleting:', error);
                alert('เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้');
            });
        }
    }
    
    // Global Click Handler
    function handleDocumentClick(e) {
        // Room View Button
        if (e.target.closest('.btn-view-room')) {
            handleViewRoom(e.target.closest('.btn-view-room'));
        }
        
        // Edit Button
        else if (e.target.closest('.btn-edit')) {
            handleEdit(e.target.closest('.btn-edit'));
        }
        
        // Delete Button
        else if (e.target.closest('.btn-delete')) {
            handleDelete(e.target.closest('.btn-delete'));
        }
        
        // Equipment View Button
        else if (e.target.closest('.btn-view')) {
            handleViewEquipment(e.target.closest('.btn-view'));
        }
        
        // Image View Button
        else if (e.target.closest('.btn-images')) {
            handleViewImages(e.target.closest('.btn-images'));
        }
    }
    
    function handleWindowClick(e) {
        // Close modal when clicking outside
        Object.values(modals).forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Search handling
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const activeSection = document.querySelector('.section.active');
        
        if (!activeSection) return;
        
        // ตรวจสอบว่ากำลังอยู่ที่หน้าไหน
        if (activeSection.id === 'rooms') {
            filterTable('#rooms-table tbody tr', searchTerm, [0, 1, 2]); // ค้นหาตามรหัสห้อง, ชื่อห้อง และรายละเอียด
        } else if (activeSection.id === 'items') {
            filterTable('#items-table tbody tr', searchTerm, [0, 1, 2]); // ค้นหาตามรหัสอุปกรณ์, ชื่ออุปกรณ์ และประเภท
        } else if (activeSection.id === 'repairs') {
            filterTable('#repairs-table tbody tr', searchTerm, [0, 1, 2, 3, 4]); // ค้นหาตามรหัสรายการ, อุปกรณ์, ปัญหา, ตำแหน่ง, และเจ้าหน้าที่
        }
    }
    
    // ฟังก์ชันกรองตาราง
    function filterTable(selector, searchTerm, columnsToSearch) {
        const rows = document.querySelectorAll(selector);
        
        rows.forEach(row => {
            if (!searchTerm) {
                // ถ้าไม่มีคำค้นหา แสดงทุกแถว
                row.style.display = '';
                return;
            }
            
            let found = false;
            
            // ค้นหาในคอลัมน์ที่ระบุ
            columnsToSearch.forEach(columnIndex => {
                const cell = row.querySelector(`td:nth-child(${columnIndex + 1})`);
                if (cell && cell.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            });
            
            // ซ่อนหรือแสดงแถวตามผลการค้นหา
            row.style.display = found ? '' : 'none';
        });
        
        // อัปเดตสถิติให้ตรงกับผลการค้นหา
        updateStatsAfterSearch();
    }
    
    // อัปเดตสถิติหลังจากค้นหา
    function updateStatsAfterSearch() {
        const activeSection = document.querySelector('.section.active');
        
        if (!activeSection) return;
        
        if (activeSection.id === 'rooms') {
            const visibleRooms = Array.from(document.querySelectorAll('#rooms-table tbody tr'))
                .filter(row => row.style.display !== 'none');
            
            // แปลงข้อมูลให้เข้ากับฟอร์แมตของ updateRoomStats
            const roomsData = visibleRooms.map(row => {
                const statusClass = row.querySelector('td:nth-child(5) .status').className;
                let status = STATUS_MAPPING.AVAILABLE; // ค่าเริ่มต้น
                
                if (statusClass.includes('booked')) status = STATUS_MAPPING.BOOKED;
                else if (statusClass.includes('maintenance')) status = STATUS_MAPPING.MAINTENANCE;
                
                return { status };
            });
            
            updateRoomStats(roomsData);
        } 
        else if (activeSection.id === 'items') {
            const visibleItems = Array.from(document.querySelectorAll('#items-table tbody tr'))
                .filter(row => row.style.display !== 'none');
            
            const itemsData = visibleItems.map(row => {
                const statusClass = row.querySelector('td:nth-child(4) .status').className;
                let status = STATUS_MAPPING.AVAILABLE;
                
                if (statusClass.includes('booked')) status = STATUS_MAPPING.BOOKED;
                else if (statusClass.includes('maintenance')) status = STATUS_MAPPING.MAINTENANCE;
                
                return { status };
            });
            
            updateEquipmentStats(itemsData);
        } 
        else if (activeSection.id === 'repairs') {
            const visibleRepairs = Array.from(document.querySelectorAll('#repairs-table tbody tr'))
                .filter(row => row.style.display !== 'none');
            
            const repairsData = visibleRepairs.map(row => {
                const statusClass = row.querySelector('td:nth-child(7) .status').className;
                let status = STATUS_MAPPING.PENDING;
                
                if (statusClass.includes('in-progress')) status = STATUS_MAPPING.IN_PROGRESS;
                else if (statusClass.includes('completed')) status = STATUS_MAPPING.COMPLETED;
                
                return { status };
            });
            
            updateRepairStats(repairsData);
        }
    }
    
    // เพิ่มกรณีสำหรับการล้างการค้นหา
    document.querySelector('.fas.fa-search').addEventListener('click', function() {
        if (searchInput.value) {
            searchInput.value = '';
            handleSearch();
        }
    });
    
    // Utility Functions
    function fetchData(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            });
    }
    
    function getRoomStatusInfo(status) {
        if (status === STATUS_MAPPING.AVAILABLE) {
            return { class: 'available', text: 'ว่าง' };
        } else if (status === STATUS_MAPPING.BOOKED) {
            return { class: 'booked', text: 'จองแล้ว' };
        } else {
            return { class: 'maintenance', text: 'กำลังซ่อม' };
        }
    }
    
    function getEquipmentStatusInfo(status) {
        if (status === STATUS_MAPPING.AVAILABLE) {
            return { class: 'available', text: 'ว่าง' };
        } else if (status === STATUS_MAPPING.BOOKED) {
            return { class: 'booked', text: 'ยืมใช้งาน' };
        } else {
            return { class: 'maintenance', text: 'ซ่อมบำรุง' };
        }
    }
    
    function getRepairStatusInfo(status) {
        if (status === 'pending' || status === STATUS_MAPPING.PENDING) {
            return { class: 'pending', text: 'รอดำเนินการ' };
        } else if (status === 'in-progress' || status === STATUS_MAPPING.IN_PROGRESS) {
            return { class: 'in-progress', text: 'กำลังซ่อม' };
        } else {
            return { class: 'completed', text: 'ซ่อมเสร็จแล้ว' };
        }
    }
    
    function getEntityName(type) {
        return type === 'room' ? 'ห้อง' : 
               type === 'item' ? 'อุปกรณ์' : 'รายการซ่อม';
    }
    
    function createNoBookingsMessage() {
        const noBookingsMsg = document.createElement('div');
        noBookingsMsg.id = 'no-bookings';
        noBookingsMsg.className = 'no-bookings';
        noBookingsMsg.style.textAlign = 'center';
        noBookingsMsg.style.padding = '20px';
        noBookingsMsg.style.display = 'none';
        noBookingsMsg.textContent = 'ไม่พบข้อมูลการจองในช่วงเวลาที่เลือก';
        return noBookingsMsg;
    }
    
    function groupBookingsByDate(bookings) {
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
        
        return bookingsByDate;
    }
    
    function createBookingItems(bookingsByDate, container) {
        const today = new Date();
        
        for (const date in bookingsByDate) {
            const bookings = bookingsByDate[date];
            
            bookings.forEach(booking => {
                // Check booking status
                const now = new Date();
                const startTime = new Date(booking.booking_date + 'T' + booking.start_time);
                const endTime = new Date(booking.booking_date + 'T' + booking.end_time);
                
                let statusClass, statusText;
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
                
                // Check if booking is today
                const bookingDate = new Date(booking.booking_date);
                const isToday = bookingDate.toDateString() === today.toDateString();
                
                // Create booking item
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
                
                container.appendChild(bookingItem);
            });
        }
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    }
    
    function handleLogout(e) {
        e.preventDefault();
        
        fetch('/auth/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                alert('ออกจากระบบสำเร็จ');
                window.location.href = '/';
            } else {
                alert('เกิดข้อผิดพลาดในการออกจากระบบ');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        });
    }
    
    // Load Staff and Equipment Types
    function loadEquipmentTypes() {
        return fetchData(API_ENDPOINTS.EQUIPMENT_TYPES)
            .then(data => {
                populateEquipmentTypeCheckboxes(data);
                return data;
            })
            .catch(error => {
                console.error('Error loading equipment types:', error);
                // Fallback to default types
                const defaultTypes = [
                    { type_id: 1, type_name: 'คอมพิวเตอร์' },
                    { type_id: 2, type_name: 'โน้ตบุ๊ก' },
                    { type_id: 3, type_name: 'โปรเจคเตอร์' },
                    { type_id: 4, type_name: 'อุปกรณ์เสียง' }
                ];
                populateEquipmentTypeCheckboxes(defaultTypes);
                return defaultTypes;
            });
    }
    
    function populateEquipmentTypeCheckboxes(types) {
        const checkboxGroup = document.getElementById('item-types-container');
        if (!checkboxGroup) {
            console.error('Checkbox group container not found');
            return;
        }
        
        // Clear existing checkboxes
        checkboxGroup.innerHTML = '';
        
        // Add new checkboxes
        types.forEach(type => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `type-${type.type_id}`;
            input.name = 'item-type[]';
            input.value = type.type_id;
            
            const label = document.createElement('label');
            label.htmlFor = `type-${type.type_id}`;
            label.textContent = type.type_name;
            
            checkboxItem.appendChild(input);
            checkboxItem.appendChild(label);
            checkboxGroup.appendChild(checkboxItem);
        });
    }
    
    function setSelectedEquipmentTypes(data) {
        let typeIds = [];
        
        // Handle different data formats for type
        if (typeof data.type_id === 'string' && data.type_id.includes(',')) {
            typeIds = data.type_id.split(',').map(id => id.trim());
        } else if (Array.isArray(data.type_id)) {
            typeIds = data.type_id;
        } else {
            typeIds = [data.type_id];
        }
        
        // Check corresponding checkboxes
        typeIds.forEach(typeId => {
            const checkbox = document.getElementById(`type-${typeId}`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                console.warn(`Checkbox for type ID ${typeId} not found`);
            }
        });
    }
    
    function loadStaffMembers() {
        return fetchData(API_ENDPOINTS.STAFF)
            .then(data => {
                populateStaffDropdown(data);
                return data;
            })
            .catch(error => {
                console.error('Error loading staff members:', error);
                // Fallback to default staff
                const defaultStaff = {
                    users: [{ user_id: 'staff1', fullname: 'it66070082' }]
                };
                populateStaffDropdown(defaultStaff);
                return defaultStaff;
            });
    }
    
    function populateStaffDropdown(staffList) {
        const staffSelect = document.getElementById('repair-staff');
        if (!staffSelect) {
            console.error('Staff dropdown not found');
            return;
        }
        
        // Keep the first option
        const defaultOption = staffSelect.options[0];
        staffSelect.innerHTML = '';
        staffSelect.appendChild(defaultOption);
        
        // Add staff from API
        staffList.users.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.user_id;
            option.textContent = staff.fullname || staff.username;
            staffSelect.appendChild(option);
        });
    }
    
    function selectStaffMember(staffIdOrName) {
        if (!staffIdOrName || staffIdOrName === '-') return;
    
        const staffSelect = document.getElementById('repair-staff');
        if (!staffSelect) {
            console.error('Staff select element not found');
            return;
        }
    
        console.log('Selecting current staff:', staffIdOrName);
    
        // First try: exact match by ID or full name
        let optionFound = false;
        Array.from(staffSelect.options).forEach(option => {
            if (option.value === staffIdOrName || option.textContent === staffIdOrName) {
                option.selected = true;
                optionFound = true;
            }
        });
    
        // Second try: partial match (staff name might be truncated or formatted differently)
        if (!optionFound) {
            Array.from(staffSelect.options).forEach(option => {
                if (option.textContent.includes(staffIdOrName) || 
                    (staffIdOrName && staffIdOrName.includes(option.textContent))) {
                    option.selected = true;
                    optionFound = true;
                }
            });
        }
    
        // If still not found, check for name without any roles or departments in parentheses
        if (!optionFound && staffIdOrName && staffIdOrName.includes('(')) {
            const nameWithoutParentheses = staffIdOrName.split('(')[0].trim();
            Array.from(staffSelect.options).forEach(option => {
                if (option.textContent.includes(nameWithoutParentheses)) {
                    option.selected = true;
                    optionFound = true;
                }
            });
        }
    
        if (!optionFound && staffIdOrName !== '') {
            // Add the current staff as a new option if not found
            const newOption = document.createElement('option');
            newOption.value = staffIdOrName; // Use name as ID if actual ID unknown
            newOption.textContent = staffIdOrName + ' (ปัจจุบัน)';
            newOption.selected = true;
            
            // Insert after the default "not assigned" option
            if (staffSelect.options.length > 0) {
                staffSelect.insertBefore(newOption, staffSelect.options[1]);
            } else {
                staffSelect.appendChild(newOption);
            }
        }
    }
    
    // Initialize user name from localStorage
    function initializeUserName() {
        const profileNameElem = document.getElementById('profile-name');
        const userName = localStorage.getItem("userName");
        if (userName && profileNameElem) {
            profileNameElem.textContent = userName;
        }
    }
    
    // Initialize the dashboard
    function initialize() {
        loadRooms(); // Load initial data
        initializeUserName(); // Set user name
    }
    
    // Socket.IO client
    const socket = window.io ? io() : null;
    if (socket) {
        socket.on('rooms:status-updated', () => {
            const active = document.querySelector('.section.active');
            if (!active || active.id === 'rooms') loadRooms();
        });
        socket.on('equipments:status-updated', () => {
            const active = document.querySelector('.section.active');
            if (!active || active.id === 'items') loadEquipments();
        });
        // +++ listen for create/update +++
        socket.on('rooms:changed', () => {
            const active = document.querySelector('.section.active');
            if (!active || active.id === 'rooms') loadRooms();
        });
        socket.on('equipments:changed', () => {
            const active = document.querySelector('.section.active');
            if (!active || active.id === 'items') loadEquipments();
        });
        socket.on('maintenances:changed', () => {
            const active = document.querySelector('.section.active');
            if (!active || active.id === 'repairs') loadMaintenance();
        });
        // --- listen for create/update ---
    }

    // Start the application
    initialize();
});