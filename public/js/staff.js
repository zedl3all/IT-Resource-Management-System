document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

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
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

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

        // If we have data (for edit), populate form fields
        if (data) {
            // Populate form fields based on data object
            // This would be customized based on your data structure
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

    function saveData(type, form) {
        // Get form data
        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // In a real application, you would send this data to your server
        // For this example, we'll just log it and close the modal
        console.log(`Saving ${type} data:`, data);

        // TODO: Add API call to save data
        // Example:
        // fetch(`/api/${type}s`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then(response => response.json())
        // .then(result => {
        //     console.log('Success:', result);
        //     modals[type].style.display = 'none';
        //     // Refresh data or update UI
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });

        // Close modal
        modals[type].style.display = 'none';

        // Show success message
        alert(`บันทึกข้อมูล${type === 'room' ? 'ห้อง' : type === 'item' ? 'อุปกรณ์' : 'รายการซ่อม'}สำเร็จ`);
    }

    // Setup edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const type = this.closest('table').id.split('-')[0]; // rooms, items, or repairs

            // Get data from the row
            const data = {};
            const cells = row.querySelectorAll('td');

            // This is a simplified example - in a real app, you would
            // map table columns to form fields more precisely
            console.log(this.closest('table'));
            if (type === 'rooms') {
                data.id = cells[0].textContent;
                data.name = cells[1].textContent;
                data.type = cells[2].textContent;
                data.capacity = cells[3].textContent.replace(' คน', '');
                data.status = cells[4].querySelector('.status').classList.contains('available') ? 'available' :
                    cells[4].querySelector('.status').classList.contains('booked') ? 'booked' : 'maintenance';
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
                data.date = cells[3].textContent;
                data.status = cells[6].querySelector('.status').classList.contains('pending') ? 'pending' :
                    cells[6].querySelector('.status').classList.contains('in-progress') ? 'in-progress' : 'completed';
            }

            // Open modal with data
            openModal(type.slice(0, -1), data); // Remove 's' from the end of the type
        });
    });

    // Setup delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            const type = this.closest('table').id.split('-')[0]; // rooms or items

            if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ${type === 'rooms' ? 'ห้อง' : 'อุปกรณ์'} ${id}?`)) {
                // TODO: Add API call to delete data
                console.log(`Deleting ${type} with ID: ${id}`);

                // Remove row from table (in a real app, do this after successful API call)
                row.remove();
            }
        });
    });

    // Setup view buttons (for repair details)
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent;

            alert(`แสดงรายละเอียดการซ่อมรหัส ${id}`);
            // In a real app, you might open a detailed view modal or navigate to a details page
        });
    });

    // Show/hide booking details based on status selection
    const itemStatus = document.getElementById('item-status');
    const bookingDetails = document.getElementById('booking-details');

    if (itemStatus && bookingDetails) {
        itemStatus.addEventListener('change', function () {
            if (this.value === 'booked') {
                bookingDetails.style.display = 'block';
            } else {
                bookingDetails.style.display = 'none';
            }
        });
    }

    // Image upload preview
    const repairImages = document.getElementById('repair-images');
    const imagePreviewContainer = document.getElementById('image-preview-container');

    if (repairImages && imagePreviewContainer) {
        repairImages.addEventListener('change', function (e) {
            imagePreviewContainer.innerHTML = '';

            for (const file of this.files) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        const previewDiv = document.createElement('div');
                        previewDiv.className = 'image-preview';

                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = file.name;

                        const removeBtn = document.createElement('div');
                        removeBtn.className = 'remove-image';
                        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                        removeBtn.addEventListener('click', function () {
                            previewDiv.remove();
                        });

                        previewDiv.appendChild(img);
                        previewDiv.appendChild(removeBtn);
                        imagePreviewContainer.appendChild(previewDiv);
                    };

                    reader.readAsDataURL(file);
                }
            }
        });
    }

    // Image viewer functionality
    const imageButtons = document.querySelectorAll('.btn-images');
    const imageViewerModal = document.getElementById('image-viewer-modal');
    const mainImage = document.getElementById('main-image');
    const imageThumbnails = document.getElementById('image-thumbnails');
    const imageCounter = document.getElementById('image-counter');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');

    let currentImageIndex = 0;
    let images = [];

    if (imageButtons && imageViewerModal) {
        imageButtons.forEach(button => {
            button.addEventListener('click', function () {
                const imageList = this.getAttribute('data-images').split(',');
                images = imageList.map(img => `/images/${img.trim()}`);

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
                imageViewerModal.style.display = 'block';
            });
        });

        // Navigation functions
        function setCurrentImage(index) {
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

        prevButton.addEventListener('click', () => {
            setCurrentImage(currentImageIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            setCurrentImage(currentImageIndex + 1);
        });

        // Close image viewer
        document.querySelector('#image-viewer-modal .close').addEventListener('click', () => {
            imageViewerModal.style.display = 'none';
        });
    }

    // Room booking details viewer
    const roomViewButtons = document.querySelectorAll('.btn-view-room');
    const roomBookingModal = document.getElementById('room-booking-modal');

    if (roomViewButtons && roomBookingModal) {
        roomViewButtons.forEach(button => {
            button.addEventListener('click', function () {
                const row = this.closest('tr');
                const roomId = row.querySelector('td:first-child').textContent;
                const roomName = row.querySelector('td:nth-child(2)').textContent;
                const roomType = row.querySelector('td:nth-child(3)').textContent;

                // Update modal content
                document.getElementById('booking-room-name').textContent = `${roomName} (${roomId})`;
                document.getElementById('booking-room-type').textContent = `ประเภท: ${roomType}`;

                // In a real app, you would fetch booking data for this room
                // and populate the bookings list

                // Show modal
                roomBookingModal.style.display = 'block';
            });
        });

        // Close room booking modal
        document.querySelector('#room-booking-modal .close').addEventListener('click', () => {
            roomBookingModal.style.display = 'none';
        });
    }

    // Item details viewer
    const itemViewButtons = document.querySelectorAll('.btn-view');
    const itemDetailsModal = document.getElementById('item-details-modal');

    if (itemViewButtons && itemDetailsModal) {
        itemViewButtons.forEach(button => {
            button.addEventListener('click', function () {
                // In a real app, you would fetch item details
                // Show modal
                itemDetailsModal.style.display = 'block';
            });
        });

        // Close item details modal
        document.querySelector('#item-details-modal .close').addEventListener('click', () => {
            itemDetailsModal.style.display = 'none';
        });
    }

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
});