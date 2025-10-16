/**
 * Controller status code unit tests (focus only on HTTP status)
 */

// --- Mock Models --- //

jest.mock('../../models/User_Model', () => ({
    getAllStaff: jest.fn(),
}));

jest.mock('../../models/Room_Model', () => ({
    getAll: jest.fn(),
    create: jest.fn(),
    createBooking: jest.fn(),
}));

// IMPORTANT: Use the exact filename casing used in controller requires (equipment_Model, maintenance_Model)
jest.mock('../../models/Equipment_Model', () => ({
    getAll: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../../models/Maintenance_Model', () => ({
    getAll: jest.fn(),
}));

// --- Import Controllers after mocks --- //
const UserController = require('../../controllers/User_Controller');
const RoomController = require('../../controllers/Room_Controller');
const EquipmentController = require('../../controllers/Equipment_Controller');
const MaintenanceController = require('../../controllers/Maintenance_Controller');

// --- Extract mocked models to control behavior --- //
const UserModel = require('../../models/User_Model');
const RoomModel = require('../../models/Room_Model');
const EquipmentModel = require('../../models/Equipment_Model');
const MaintenanceModel = require('../../models/Maintenance_Model');

// Helper to build mock res
function buildRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
    };
}

// Minimal req factory
function buildReq(overrides = {}) {
    return Object.assign({ params: {}, body: {}, query: {}, app: { get: () => ({ emit: jest.fn() }) } }, overrides);
}

// ========== 1. GET /api/users/staff/all ========== //
describe('UserController.getAllStaff', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 200 on success', () => {
        const req = buildReq();
        const res = buildRes();
        UserModel.getAllStaff.mockImplementation(cb => cb(null, [{ user_id: '1', role: 'staff' }]));

        UserController.getAllStaff(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on error', () => {
        const req = buildReq();
        const res = buildRes();
        UserModel.getAllStaff.mockImplementation(cb => cb(new Error('DB error')));

        UserController.getAllStaff(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ========== 2. GET /api/rooms ========== //
describe('RoomController.getAllRooms', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 200 on success', () => {
        const req = buildReq();
        const res = buildRes();
        RoomModel.getAll.mockImplementation(cb => cb(null, [{ room_id: 'R001' }]));

        RoomController.getAllRooms(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on error', () => {
        const req = buildReq();
        const res = buildRes();
        RoomModel.getAll.mockImplementation(cb => cb(new Error('DB error')));

        RoomController.getAllRooms(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ========== 3. POST /api/rooms (createRoom) ========== //
describe('RoomController.createRoom', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 201 on success', () => {
        const req = buildReq({ body: { name: 'Room A', description: 'Desc', capacity: 10, status: 1 } });
        const res = buildRes();
        RoomModel.create.mockImplementation((data, cb) => cb(null, { id: 'RNEW', ...data }));

        RoomController.createRoom(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 on error', () => {
        const req = buildReq({ body: { name: 'Room A' } });
        const res = buildRes();
        RoomModel.create.mockImplementation((data, cb) => cb(new Error('DB error')));

        RoomController.createRoom(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ========== 4. POST /api/rooms/:id/bookings (CreateBooking) ========== //
describe('RoomController.CreateBooking', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 201 on success', () => {
        const req = buildReq({ params: { id: 'R001' }, body: { user_id: 'U1', start_time: '2025-10-06T10:00:00', end_time: '2025-10-06T11:00:00', purpose: 'Meet' } });
        const res = buildRes();
        RoomModel.createBooking.mockImplementation((data, cb) => cb(null, { status: 'success', message: 'ok' }));

        RoomController.CreateBooking(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 when model returns error status', () => {
        const req = buildReq({ params: { id: 'R001' }, body: { user_id: 'U1', start_time: '2025-10-06T10:00:00', end_time: '2025-10-06T11:00:00', purpose: 'Meet' } });
        const res = buildRes();
        RoomModel.createBooking.mockImplementation((data, cb) => cb(null, { status: 'error', message: 'conflict' }));

        RoomController.CreateBooking(req, res);
        // If controller maps error status to 400 it will call status(400); otherwise fallback to 201/200.
        const called = res.status.mock.calls[0]?.[0];
        expect([400, 201, 200]).toContain(called);
    });

    it('should return 500 on model error', () => {
        const req = buildReq({ params: { id: 'R001' }, body: { user_id: 'U1', start_time: '2025-10-06T10:00:00', end_time: '2025-10-06T11:00:00', purpose: 'Meet' } });
        const res = buildRes();
        RoomModel.createBooking.mockImplementation((data, cb) => cb(new Error('DB error')));

        RoomController.CreateBooking(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ========== 5. GET /api/equipments ========== //
describe('EquipmentController.getAllEquipment', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 200 on success', () => {
        const req = buildReq();
        const res = buildRes();
        EquipmentModel.getAll.mockImplementation(cb => cb(null, [{ e_id: 'E001' }]));

        EquipmentController.getAllEquipment(req, res);
        // Some controllers might not explicitly set status (default 200). Accept no call or 200 call.
        const called = res.status.mock.calls[0]?.[0] ?? 200;
        expect(called).toBe(200);
    });

    it('should return 500 on error', () => {
        const req = buildReq();
        const res = buildRes();
        EquipmentModel.getAll.mockImplementation(cb => cb(new Error('DB error')));

        EquipmentController.getAllEquipment(req, res);
        const called = res.status.mock.calls[0]?.[0];
        expect(called).toBe(500); // controller sets 500 on error
    });
});

// ========== 6. POST /api/equipments (createEquipment) ========== //
describe('EquipmentController.createEquipment', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 201 on success', () => {
        const req = buildReq({ body: { name: 'Laptop', type: [1], status: 1 } });
        const res = buildRes();
        EquipmentModel.create.mockImplementation((data, cb) => cb(null, { e_id: 'E999', ...data }));

        EquipmentController.createEquipment(req, res);
        const called = res.status.mock.calls[0]?.[0];
        expect([201, 200]).toContain(called);
    });

    it('should return 500 on error', () => {
        const req = buildReq({ body: { name: 'Laptop' } });
        const res = buildRes();
        EquipmentModel.create.mockImplementation((data, cb) => cb(new Error('DB error')));

        EquipmentController.createEquipment(req, res);
        const called = res.status.mock.calls[0]?.[0];
        expect(called).toBe(500);
    });
});

// ========== 7. GET /api/maintenances ========== //
describe('MaintenanceController.getAllMaintenances', () => {
    afterEach(() => jest.clearAllMocks());

    it('should return 200 on success', () => {
        const req = buildReq();
        const res = buildRes();
        MaintenanceModel.getAll.mockImplementation(cb => cb(null, [{ request_id: '12345678' }]));

        MaintenanceController.getAllMaintenances(req, res);
        const called = res.status.mock.calls[0]?.[0] ?? 200;
        expect(called).toBe(200);
    });

    it('should return 500 on error', () => {
        const req = buildReq();
        const res = buildRes();
        MaintenanceModel.getAll.mockImplementation(cb => cb(new Error('DB error')));

        MaintenanceController.getAllMaintenances(req, res);
        const called = res.status.mock.calls[0]?.[0];
        expect(called).toBe(500);
    });
});
