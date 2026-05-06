const express = require('express');
const router = express.Router();
const { 
    getCustomers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
} = require('../../controllers/public/customerController');
const { verifyToken } = require('../../middleware/auth');

router.get('/', getCustomers);
router.post('/', verifyToken, createCustomer);
router.put('/:id', verifyToken, updateCustomer);
router.delete('/:id', verifyToken, deleteCustomer);

module.exports = router;
