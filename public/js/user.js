/**
 * IT Resource Management System - User Dashboard
 * Main JavaScript file for user interface interactions
 */
document.addEventListener("DOMContentLoaded", function () {
    // ===== Constants & Configuration =====
    const STATUS_CONFIG = {
        CLASSES: {
            AVAILABLE: "available",
            BOOKED: "booked",
            MAINTENANCE: "maintenance",
            ACTIVE: "active",
            UPCOMING: "upcoming",
            COMPLETED: "completed",
            PENDING: "pending",
            IN_PROGRESS: "in-progress",
        },
        TEXT: {
            ROOM: {
                1: "ว่าง",
                0: "ถูกใช้งานอยู่",
                "-1": "ซ่อมบำรุง",
            },
            EQUIPMENT: {
                1: "ว่าง",
                0: "ถูกจอง",
                "-1": "ซ่อมบำรุง",
            },
            MAINTENANCE: {
                "-1": "กำลังซ่อม",
                0: "รอดำเนินการ",
                1: "ซ่อมเสร็จแล้ว",
            },
            BOOKING: {
                ACTIVE: "กำลังใช้งาน",
                UPCOMING: "กำลังจะมาถึง",
                COMPLETED: "เสร็จสิ้นแล้ว",
            }
        }
    };

    // Reference common DOM elements
    const elements = {
        menuItems: document.querySelectorAll(".menu-item"),
        sections: document.querySelectorAll(".section"),
        modals: {
            roomBooking: document.getElementById("room-booking-modal"),
            equipmentBooking: document.getElementById("equipment-booking-modal"),
            maintenance: document.getElementById("maintenance-modal"),
            imageViewer: document.getElementById('image-viewer-modal')
        },
        imageViewer: {
            mainImage: document.getElementById('main-image'),
            counter: document.getElementById('image-counter'),
            thumbnails: document.getElementById('image-thumbnails'),
            prevButton: document.getElementById('prev-image'),
            nextButton: document.getElementById('next-image')
        }
    };

    // Image viewer state
    const imageViewerState = {
        currentIndex: 0,
        images: []
    };
    
    // ===== Initialization =====
    initialize();

    function initialize() {
        setupEventListeners();
        initializeUserInfo();
        loadMyBookings();
        initializeSocketIO();
    }

    function setupEventListeners() {
        // Menu navigation
        elements.menuItems.forEach(item => {
            item.addEventListener("click", handleMenuItemClick);
        });

        // Modal controls
        setupModalEvents();
        
        // Form submissions
        setupFormSubmissions();
        
        // Button delegations
        document.addEventListener("click", handleButtonClicks);
        
        // Image viewer controls
        setupImageViewerEvents();
    }

    function setupModalEvents() {
        // Close buttons in modals
        document.querySelectorAll(".close, .btn-cancel").forEach(button => {
            button.addEventListener("click", closeAllModals);
        });

        // Booking filter dropdown
        document.getElementById("booking-filter")?.addEventListener("change", filterBookings);

        // Add maintenance button
        document.getElementById("add-maintenance-btn")?.addEventListener("click", () => {
            elements.modals.maintenance.style.display = "block";
        });

        // Close modals when clicking outside
        window.addEventListener('click', handleOutsideModalClick);
    }

    function setupFormSubmissions() {
        document.getElementById("room-booking-form")?.addEventListener("submit", handleRoomBooking);
        document.getElementById("equipment-booking-form")?.addEventListener("submit", handleEquipmentBooking);
        document.getElementById("maintenance-form")?.addEventListener("submit", handleMaintenanceRequest);
        document.getElementById("logout-btn")?.addEventListener("click", handleLogout);
    }

    function setupImageViewerEvents() {
        elements.imageViewer.prevButton?.addEventListener('click', () => setCurrentImage(imageViewerState.currentIndex - 1));
        elements.imageViewer.nextButton?.addEventListener('click', () => setCurrentImage(imageViewerState.currentIndex + 1));
        
        const imageViewerCloseBtn = document.querySelector('#image-viewer-modal .close');
        imageViewerCloseBtn?.addEventListener('click', () => {
            elements.modals.imageViewer.style.display = "none";
        });
    }

    function initializeUserInfo() {
        const profileNameElem = document.getElementById("user-name");
        const userName = localStorage.getItem("userName");
        if (profileNameElem && userName) {
            profileNameElem.textContent = userName;
        }
    }

    function initializeSocketIO() {
        const socket = window.io ? io() : null;
        if (!socket) return;

        // Status update events
        socket.on("rooms:status-updated", handleRoomsUpdate);
        socket.on("equipments:status-updated", handleEquipmentsUpdate);

        // Data change events
        socket.on("rooms:changed", handleRoomsUpdate);
        socket.on("equipments:changed", handleEquipmentsUpdate);
        socket.on("maintenances:changed", handleMaintenanceUpdate);
    }

    // ===== Event Handlers =====
    function handleOutsideModalClick(e) {
        Object.values(elements.modals).forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    function handleMenuItemClick(e) {
        if (this.classList.contains("logout")) return;
        e.preventDefault();

        const targetSection = this.getAttribute("data-section");

        // Update active menu item
        elements.menuItems.forEach(item => item.classList.remove("active"));
        this.classList.add("active");

        // Update active section
        elements.sections.forEach(section => {
            if (section.id === targetSection) {
                section.classList.add("active");
                loadSectionData(targetSection);
            } else {
                section.classList.remove("active");
            }
        });
    }

    function handleButtonClicks(e) {
        const target = e.target.closest("button");
        if (!target) return;

        // Check different button types by their class or containing table
        if (target.classList.contains("btn-book")) {
            if (target.closest("#available-rooms-table")) {
                handleRoomBookingButton(target);
            } else if (target.closest("#available-equipment-table")) {
                handleEquipmentBookingButton(target);
            }
        } else if (target.classList.contains("btn-cancel-booking")) {
            handleCancelBookingButton(target);
        } else if (target.classList.contains("btn-images")) {
            handleViewImages(target);
        }
    }

    function handleRoomBookingButton(button) {
        const roomId = button.getAttribute("data-room-id");
        const roomName = button.getAttribute("data-room-name");
        const roomDescription = button.getAttribute("data-room-description");
        const roomCapacity = button.getAttribute("data-room-capacity");

        document.getElementById("selected-room-name").textContent = `${roomName} (${roomId})`;
        document.getElementById("selected-room-details").textContent = 
            `${roomDescription} - ความจุ: ${roomCapacity} คน`;

        // Set hidden room ID
        document.getElementById("room-booking-form")
            .setAttribute("data-room-id", roomId);
            
        elements.modals.roomBooking.style.display = "block";
    }

    function handleEquipmentBookingButton(button) {
        const equipmentId = button.getAttribute("data-equipment-id");
        const equipmentName = button.getAttribute("data-equipment-name");
        const equipmentType = button.getAttribute("data-equipment-type");

        document.getElementById("selected-equipment-name").textContent = `${equipmentName} (${equipmentId})`;
        document.getElementById("selected-equipment-details").textContent = `ประเภท: ${equipmentType}`;

        // Set hidden equipment ID
        document.getElementById("equipment-booking-form")
            .setAttribute("data-equipment-id", equipmentId);
            
        elements.modals.equipmentBooking.style.display = "block";
    }

    function handleCancelBookingButton(button) {
        const bookingId = button.getAttribute("data-booking-id");
        const type = button.getAttribute("data-type");

        if (confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?")) {
            cancelBooking(bookingId, type);
        }
    }

    function handleRoomBooking(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const roomId = this.getAttribute("data-room-id");

        const bookingData = {
            room_id: roomId,
            booking_date: formData.get("booking-date"),
            start_time: formData.get("booking-start-time"),
            end_time: formData.get("booking-end-time"),
            purpose: formData.get("booking-purpose"),
        };

        submitBooking("/api/user/book-room", bookingData, "จองห้อง", elements.modals.roomBooking, loadMyBookings);
    }

    function handleEquipmentBooking(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const equipmentId = this.getAttribute("data-equipment-id");

        const bookingData = {
            equipment_id: equipmentId,
            booking_date: formData.get("equipment-booking-date"),
            booking_time: formData.get("equipment-booking-time"),
            return_date: formData.get("equipment-return-date"),
            return_time: formData.get("equipment-return-time"),
            purpose: formData.get("equipment-purpose"),
        };

        submitBooking("/api/user/book-equipment", bookingData, "จองอุปกรณ์", 
                      elements.modals.equipmentBooking, loadMyBookings);
    }

    function submitBooking(url, data, actionName, modal, callback) {
        apiPost(url, data)
            .then(result => {
                if (result.success) {
                    showNotification(`${actionName}สำเร็จ!`);
                    if (modal) modal.style.display = "none";
                    if (callback) callback();
                } else {
                    showNotification(`เกิดข้อผิดพลาด: ${result.message}`, "error");
                }
            })
            .catch(error => handleApiError(error, `ไม่สามารถ${actionName}ได้`));
    }

    function handleMaintenanceRequest(e) {
        e.preventDefault();
        const formData = new FormData(this);

        const maintenanceData = {
            equipment: formData.get("maintenance-equipment"),
            problem_description: formData.get("maintenance-problem"),
            location: formData.get("maintenance-location"),
            urgency: formData.get("maintenance-urgency"),
        };

        apiPost("/api/user/maintenance-request", maintenanceData)
            .then(result => {
                if (result.success) {
                    showNotification("แจ้งซ่อมสำเร็จ!");
                    elements.modals.maintenance.style.display = "none";
                    loadMyMaintenanceRequests();
                } else {
                    showNotification("เกิดข้อผิดพลาด: " + result.message, "error");
                }
            })
            .catch(error => handleApiError(error, "ไม่สามารถแจ้งซ่อมได้"));
    }

    function handleLogout(e) {
        e.preventDefault();

        apiPost("/auth/logout", {}, "POST")
            .then(response => {
                if (response.ok) {
                    showNotification("ออกจากระบบสำเร็จ");
                    window.location.href = "/";
                } else {
                    showNotification("เกิดข้อผิดพลาดในการออกจากระบบ", "error");
                }
            })
            .catch(() => showNotification("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error"));
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
        const active = document.querySelector(".menu-item.active");
        if (!active) return;

        const section = active.getAttribute("data-section");
        if (section === "maintenance") {
            loadMyMaintenanceRequests();
        } else if (section === "bookings") {
            loadRoomBookings();
            loadEquipmentBookings();
        }
    }

    // ===== Data Loading Functions =====
    function loadSectionData(section) {
        const loaders = {
            "bookings": loadMyBookings,
            "rooms": loadAvailableRooms,
            "equipment": loadAvailableEquipment,
            "maintenance": loadMyMaintenanceRequests
        };

        if (loaders[section]) {
            loaders[section]();
        }
    }

    function loadMyBookings() {
        Promise.all([loadRoomBookings(), loadEquipmentBookings()])
            .then(([roomData, equipmentData]) => {
                const allBookings = [...roomData, ...equipmentData];
                updateBookingStats(allBookings);
            })
            .catch(error => {
                handleApiError(error, "เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง");
                displayBookingError();
            });
    }

    function loadRoomBookings() {
        return new Promise((resolve, reject) => {
            const userId = localStorage.getItem("userId");
            apiGet(`/api/rooms/user/${userId}/bookings`)
                .then(data => {
                    const roomBookings = data || [];
                    displayRoomBookings(roomBookings);
                    resolve(roomBookings);
                })
                .catch(error => {
                    console.error("Error loading room bookings:", error);
                    displayRoomBookingsError();
                    reject(error);
                });
        });
    }

    function loadEquipmentBookings() {
        return new Promise((resolve, reject) => {
            const userId = localStorage.getItem("userId");
            apiGet(`/api/equipments/user/${userId}/loans`)
                .then(data => {
                    const equipmentBookings = data.loans || [];
                    displayEquipmentBookings(equipmentBookings);
                    resolve(equipmentBookings);
                })
                .catch(error => {
                    console.error("Error loading equipment bookings:", error);
                    displayEquipmentBookingsError();
                    reject(error);
                });
        });
    }

    function loadAvailableRooms() {
        apiGet("/api/rooms")
            .then(data => {
                const tbody = document.querySelector("#available-rooms-table tbody");
                tbody.innerHTML = "";

                data.rooms.forEach(room => {
                    const statusInfo = getRoomStatusInfo(room.status);
                    const row = createRoomRow(room, statusInfo);
                    tbody.appendChild(row);
                });
            })
            .catch(error => handleApiError(error, "Error loading rooms"));
    }

    function createRoomRow(room, statusInfo) {
        const row = document.createElement("tr");
        const isAvailable = parseInt(room.status) === 1;

        row.innerHTML = `
            <td>${room.room_id}</td>
            <td>${room.room_name}</td>
            <td>${room.description}</td>
            <td>${room.capacity} คน</td>
            <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
            <td class="actions">
                ${isAvailable || parseInt(room.status) === 0 ? 
                  createBookButton("room", room) :
                  createDisabledButton()}
            </td>
        `;
        
        return row;
    }

    function createBookButton(type, item) {
        const attrs = type === "room" ? 
            `data-room-id="${item.room_id}" 
             data-room-name="${item.room_name}" 
             data-room-description="${item.description}" 
             data-room-capacity="${item.capacity}"` :
            `data-equipment-id="${item.e_id}" 
             data-equipment-name="${item.name}" 
             data-equipment-type="${item.type_name}"`;
            
        return `<button class="btn-book" ${attrs}>
                  <i class="fas fa-calendar-plus"></i> จอง
                </button>`;
    }

    function createDisabledButton() {
        return `<button class="btn-disabled" disabled>
                  <i class="fas fa-calendar-times"></i> ไม่สามารถจองได้
                </button>`;
    }

    function loadAvailableEquipment() {
        apiGet("/api/equipments")
            .then(data => {
                const tbody = document.querySelector("#available-equipment-table tbody");
                tbody.innerHTML = "";

                data.equipments.forEach(item => {
                    const statusInfo = getEquipmentStatusInfo(item.status);
                    const row = createEquipmentRow(item, statusInfo);
                    tbody.appendChild(row);
                });
            })
            .catch(error => handleApiError(error, "Error loading equipment"));
    }

    function createEquipmentRow(item, statusInfo) {
        const row = document.createElement("tr");
        const isAvailable = parseInt(item.status) === 1;

        row.innerHTML = `
            <td>${item.e_id}</td>
            <td>${item.name}</td>
            <td>${item.type_name}</td>
            <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
            <td class="actions">
                ${isAvailable ? 
                  createBookButton("equipment", item) :
                  createDisabledButton()}
            </td>
        `;
        
        return row;
    }

    function loadMyMaintenanceRequests() {
        apiGet(`/api/maintenances/user/${localStorage.getItem("userId")}`)
            .then(data => {
                const tbody = document.querySelector("#my-maintenance-table tbody");
                tbody.innerHTML = "";

                if (data.maintenances && data.maintenances.length > 0) {
                    data.maintenances.forEach(request => {
                        const row = createMaintenanceRow(request);
                        tbody.appendChild(row);
                    });
                } else {
                    displayNoMaintenanceRequests(tbody);
                }
            })
            .catch(error => handleApiError(error, "Error loading maintenance requests"));
    }

    function createMaintenanceRow(request) {
        const statusInfo = getMaintenanceStatusInfo(request.status);
        const row = document.createElement("tr");
        const staffName = request.staff_fullname || '-';
        const images = request.image ? request.image : '';
        const date = request.DT_report || request.date || '';
        const formattedDate = date ? new Date(date).toLocaleDateString('th-TH') : '';

        row.innerHTML = `
            <td>${request.request_id}</td>
            <td>${request.equipment}</td>
            <td>${request.problem_description}</td>
            <td>${request.location || '-'}</td>
            <td>${staffName}</td>
            <td>${formattedDate}</td>
            <td><span class="status ${statusInfo.class}">${statusInfo.text}</span></td>
            <td class="actions">
                ${images ? `<button class="btn-images" data-images="${images}">
                             <i class="fas fa-images"></i></button>` : ''}
            </td>
        `;
        
        return row;
    }

    // ===== Display Helper Functions =====
    function displayRoomBookings(roomBookings) {
        displayBookings("my-room-bookings-container", roomBookings, 
                        "door-open", "ยังไม่มีการจองห้อง", "เลือกจองห้องเพื่อดูรายการที่นี่");
    }

    function displayEquipmentBookings(equipmentBookings) {
        displayBookings("my-equipment-bookings-container", equipmentBookings, 
                        "laptop", "ยังไม่มีการจองอุปกรณ์", "เลือกจองอุปกรณ์เพื่อดูรายการที่นี่");
    }

    function displayBookings(containerId, bookings, icon, title, message) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = "";

        if (bookings.length > 0) {
            bookings.forEach(booking => {
                const bookingElement = createBookingElement(booking);
                container.appendChild(bookingElement);
            });
        } else {
            container.innerHTML = createEmptyStateHTML(icon, title, message);
        }
    }

    function displayRoomBookingsError() {
        showContainerError("my-room-bookings-container", 
                           "ไม่สามารถโหลดข้อมูลการจองห้องได้", 
                           "โปรดลองอีกครั้งในภายหลัง");
    }

    function displayEquipmentBookingsError() {
        showContainerError("my-equipment-bookings-container", 
                           "ไม่สามารถโหลดข้อมูลการจองอุปกรณ์ได้", 
                           "โปรดลองอีกครั้งในภายหลัง");
    }

    function showContainerError(containerId, title, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = createEmptyStateHTML("exclamation-circle", title, message);
        }
    }

    function displayBookingError() {
        ["my-room-bookings-container", "my-equipment-bookings-container"].forEach(
            id => showContainerError(id, "ไม่สามารถโหลดข้อมูลได้", "โปรดลองอีกครั้งในภายหลัง")
        );
    }

    function displayNoMaintenanceRequests(tbody) {
        const row = document.createElement("tr");
        row.className = "no-data-row";
        row.innerHTML = `
            <td colspan="8" class="no-data-cell">
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
        const bookingElement = document.createElement("div");
        bookingElement.className = "booking-item";

        const status = getBookingStatus(booking);
        const isRoom = booking.room_id ? true : false;
        const itemName = isRoom ? booking.room_name : booking.equipment_name;
        const bookingDate = formatDate(booking.booking_date || booking.start_time || booking.borrow_DT);
        const startDate = formatDate(booking.start_time || booking.borrow_DT);
        const endDate = formatDate(booking.end_time || booking.return_DT);
        const startTime = formatTime(booking.start_time || booking.borrow_DT);
        const endTime = formatTime(booking.end_time || booking.return_DT);
        const purpose = booking.purpose || "ไม่ระบุ";
        const showCancelButton = status.class === STATUS_CONFIG.CLASSES.UPCOMING;

        bookingElement.innerHTML = `
            <div class="booking-header">
                <div class="booking-type">
                    <i class="fas fa-${isRoom ? "door-open" : "laptop"}"></i>
                    ${isRoom ? "จองห้อง" : "จองอุปกรณ์"}: ${itemName}
                </div>
                <span class="booking-status ${status.class}">${status.text}</span>
            </div>
            <div class="booking-body">
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>วันที่: <b>${bookingDate}</b></span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>วันที่: <b>${startDate}</b> เวลา: <b>${startTime}</b> ถึง
                              วันที่: <b>${endDate}</b> เวลา: <b>${endTime}</b>
                        </span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clipboard"></i>
                        <span>วัตถุประสงค์: ${purpose}</span>
                    </div>
                </div>
                ${showCancelButton ? createCancelButton(booking.booking_id, isRoom) : ""}
            </div>
        `;

        return bookingElement;
    }

    function createCancelButton(bookingId, isRoom) {
        return `
            <div class="booking-actions">
                <button class="btn-cancel-booking" 
                data-booking-id="${bookingId}" 
                data-type="${isRoom ? "room" : "equipment"}">
                    ยกเลิกการจอง
                </button>
            </div>
        `;
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
        const filterValue = document.getElementById("booking-filter").value;
        const roomBookings = document.querySelectorAll("#my-room-bookings-container .booking-item");
        const equipmentBookings = document.querySelectorAll("#my-equipment-bookings-container .booking-item");
        const allBookings = [...roomBookings, ...equipmentBookings];

        allBookings.forEach(booking => {
            const statusElement = booking.querySelector(".booking-status");
            const status = getStatusClassFromElement(statusElement);
            booking.style.display = (filterValue === "all" || status === filterValue) ? "" : "none";
        });

        // Check and show empty state if needed
        checkEmptyState("my-room-bookings-container", "ไม่พบการจองห้องที่ตรงกับเงื่อนไข", "door-open");
        checkEmptyState("my-equipment-bookings-container", "ไม่พบการจองอุปกรณ์ที่ตรงกับเงื่อนไข", "laptop");
    }

    function checkEmptyState(containerId, message, iconName) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const visibleItems = Array.from(container.querySelectorAll(".booking-item"))
            .filter(item => item.style.display !== "none");
        const hasBookings = container.querySelectorAll(".booking-item").length > 0;

        // If there are bookings but none visible after filtering
        if (visibleItems.length === 0 && hasBookings) {
            // Hide all booking items
            container.querySelectorAll(".booking-item").forEach(item => {
                item.style.display = "none";
            });

            // Show filter-specific empty state
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state filter-empty-state";
            emptyState.innerHTML = createEmptyStateContent(iconName, message, 
                                                         "ลองเปลี่ยนตัวกรองเพื่อดูรายการอื่น");
            container.appendChild(emptyState);
        } 
        // If we have visible items, remove any filter empty state
        else if (visibleItems.length > 0) {
            const filterEmptyState = container.querySelector(".filter-empty-state");
            if (filterEmptyState) {
                filterEmptyState.remove();
            }
        }
    }

    function createEmptyStateContent(icon, title, message) {
        return `
            <i class="fas fa-${icon}"></i>
            <h3>${title}</h3>
            <p>${message}</p>
        `;
    }

    function closeAllModals() {
        Object.values(elements.modals).forEach(modal => {
            if (modal) modal.style.display = "none";
        });
    }

    function updateBookingStats(bookings) {
        const stats = {
            total: bookings.length,
            active: countBookingsByStatus(bookings, STATUS_CONFIG.CLASSES.ACTIVE),
            upcoming: countBookingsByStatus(bookings, STATUS_CONFIG.CLASSES.UPCOMING)
        };

        const statCards = document.querySelectorAll("#bookings .stat-card .stat-value");
        if (statCards.length >= 3) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.active;
            statCards[2].textContent = stats.upcoming;
        }
    }

    function countBookingsByStatus(bookings, statusClass) {
        return bookings.filter(b => getBookingStatus(b).class === statusClass).length;
    }

    // ===== Image Viewer Functions =====
    function handleViewImages(button) {
        const imagesAttr = button.getAttribute('data-images');

        if (!imagesAttr || !imagesAttr.trim()) {
            alert('ไม่พบรูปภาพสำหรับรายการนี้');
            return;
        }

        const imageList = imagesAttr.split(',').filter(img => img.trim());
        if (imageList.length === 0) {
            alert('ไม่พบรูปภาพสำหรับรายการนี้');
            return;
        }

        // Create image URLs
        imageViewerState.images = imageList.map(img => 
            `/api/images?path=${img.trim().replace(/^\.\/Images\//, '')}`);

        // Create thumbnails
        createImageThumbnails(imageViewerState.images);

        // Set first image as current
        imageViewerState.currentIndex = 0;
        setCurrentImage(imageViewerState.currentIndex);

        // Show modal
        elements.modals.imageViewer.style.display = 'block';
    }

    function createImageThumbnails(images) {
        if (!elements.imageViewer.thumbnails) return;
        
        elements.imageViewer.thumbnails.innerHTML = '';

        images.forEach((src, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `image-thumbnail ${index === 0 ? 'active' : ''}`;

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Thumbnail ${index + 1}`;

            thumbnail.appendChild(img);
            elements.imageViewer.thumbnails.appendChild(thumbnail);
            thumbnail.addEventListener('click', () => setCurrentImage(index));
        });
    }

    function setCurrentImage(index) {
        const images = imageViewerState.images;
        if (!images || images.length === 0 || !elements.imageViewer.mainImage) {
            console.error('No images available to display');
            return;
        }

        // Handle edge cases
        index = (index < 0) ? images.length - 1 : (index >= images.length) ? 0 : index;
        imageViewerState.currentIndex = index;

        // Update image display
        elements.imageViewer.mainImage.src = images[index] || '';
        
        if (elements.imageViewer.counter) {
            elements.imageViewer.counter.textContent = `${index + 1}/${images.length}`;
        }

        // Update active thumbnail
        document.querySelectorAll('.image-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // ===== Status Helper Functions =====
    function getStatusClassFromElement(element) {
        if (!element) return STATUS_CONFIG.CLASSES.COMPLETED;
        
        const { ACTIVE, UPCOMING } = STATUS_CONFIG.CLASSES;
        if (element.classList.contains(ACTIVE)) return ACTIVE;
        if (element.classList.contains(UPCOMING)) return UPCOMING;
        return STATUS_CONFIG.CLASSES.COMPLETED;
    }

    function getBookingStatus(booking) {
        const now = new Date();
        const startDateStr = booking.booking_date || booking.start_time || booking.borrow_DT;
        const endDateStr = booking.end_time || booking.return_DT;
        
        // Handle missing dates
        if (!startDateStr || !endDateStr) {
            return { 
                class: STATUS_CONFIG.CLASSES.UPCOMING, 
                text: STATUS_CONFIG.TEXT.BOOKING.UPCOMING 
            };
        }

        let startTime, endTime;
        
        // Handle different date formats
        if (startDateStr.includes('T')) {
            startTime = new Date(startDateStr);
            endTime = new Date(endDateStr);
        } else {
            // Format: YYYY-MM-DD HH:MM:SS
            startTime = new Date(`${booking.booking_date}T${booking.start_time}`);
            endTime = new Date(`${booking.booking_date}T${booking.end_time}`);
        }

        // Determine status
        if (now >= startTime && now <= endTime) {
            return { 
                class: STATUS_CONFIG.CLASSES.ACTIVE, 
                text: STATUS_CONFIG.TEXT.BOOKING.ACTIVE 
            };
        } else if (now < startTime) {
            return { 
                class: STATUS_CONFIG.CLASSES.UPCOMING, 
                text: STATUS_CONFIG.TEXT.BOOKING.UPCOMING 
            };
        } else {
            return { 
                class: STATUS_CONFIG.CLASSES.COMPLETED, 
                text: STATUS_CONFIG.TEXT.BOOKING.COMPLETED 
            };
        }
    }

    function getRoomStatusInfo(status) {
        const statusCode = parseInt(status);
        const { AVAILABLE, BOOKED, MAINTENANCE } = STATUS_CONFIG.CLASSES;
        
        return {
            class: statusCode === 1 ? AVAILABLE : statusCode === 0 ? BOOKED : MAINTENANCE,
            text: STATUS_CONFIG.TEXT.ROOM[statusCode] || "ไม่ทราบสถานะ"
        };
    }

    function getEquipmentStatusInfo(status) {
        const statusCode = parseInt(status);
        const { AVAILABLE, BOOKED, MAINTENANCE } = STATUS_CONFIG.CLASSES;
        
        return {
            class: statusCode === 1 ? AVAILABLE : statusCode === 0 ? BOOKED : MAINTENANCE,
            text: STATUS_CONFIG.TEXT.EQUIPMENT[statusCode] || "ไม่ทราบสถานะ"
        };
    }

    function getMaintenanceStatusInfo(status) {
        // -1 = กำลังซ่อม, 0 = รอดำเนินการ, 1 = ซ่อมเสร็จแล้ว
        const statusCode = parseInt(status);
        const { PENDING, IN_PROGRESS, COMPLETED } = STATUS_CONFIG.CLASSES;
        
        return {
            class: statusCode === -1 ? IN_PROGRESS : 
                   statusCode === 0 ? PENDING : 
                   statusCode === 1 ? COMPLETED : PENDING,
            text: STATUS_CONFIG.TEXT.MAINTENANCE[statusCode] || "ไม่ทราบสถานะ"
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

    function apiPost(url, data, method = "POST") {
        return fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
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
        console.error(`${defaultMessage}:`, error);
        showNotification(defaultMessage, "error");
    }

    // ===== Utility Functions =====
    function formatDate(dateString) {
        if (!dateString) return "ไม่ระบุ";
        return new Date(dateString).toLocaleDateString("th-TH");
    }

    function formatTime(timeString) {
        if (!timeString) return "ไม่ระบุ";

        try {
            // For ISO date format or timestamp
            if (timeString.includes("T") || timeString.includes("Z")) {
                const date = new Date(timeString);
                return date.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                });
            }

            // For HH:MM:SS format
            return timeString.substring(0, 5); // Just take HH:MM
        } catch (e) {
            console.error("Error formatting time:", e);
            return "รูปแบบเวลาไม่ถูกต้อง";
        }
    }

    function showNotification(message, type = "success") {
        alert(message);
        // This could be enhanced with a nicer notification system
    }

    function cancelBooking(bookingId, type) {
        apiPost(`/api/user/cancel-booking/${bookingId}?type=${type}`, {}, "DELETE")
            .then(result => {
                if (result.success) {
                    showNotification("ยกเลิกการจองสำเร็จ!");
                    loadMyBookings();
                } else {
                    showNotification(`เกิดข้อผิดพลาด: ${result.message}`, "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showNotification("ไม่สามารถยกเลิกการจองได้", "error");
            });
    }
});
