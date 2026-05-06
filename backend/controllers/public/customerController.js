const Customer = require('../../models/CustomerModel');
const { redisClient } = require('../../config/redis');

const clearCustomerCache = async () => {
    if (redisClient.isOpen) {
        const keys = await redisClient.keys('customers_*');
        if (keys.length > 0) await redisClient.del(keys);
    }
};

// @desc    Get all customers
// @route   GET /api/customers
const getCustomers = async (req, res) => {
    try {
        const cacheKey = 'customers_all';
        
        if (redisClient.isOpen) {
            const cached = await redisClient.get(cacheKey);
            if (cached) return res.status(200).json(JSON.parse(cached));
        }

        const customers = await Customer.find().sort({ name: 1 });
        const response = { success: true, data: customers };

        if (redisClient.isOpen) {
            await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a customer
// @route   POST /api/customers
const createCustomer = async (req, res) => {
    try {
        const { name, addresses, areas } = req.body;
        const customer = await Customer.create({ name, addresses, areas });
        await clearCustomerCache();
        res.status(201).json({ success: true, data: customer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        await clearCustomerCache();
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        await clearCustomerCache();
        res.status(200).json({ success: true, message: 'Customer removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
