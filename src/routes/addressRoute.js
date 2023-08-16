const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const { getAllAddresses, addNewAddress, deleteAddress, updateAddress, getAddress } = require('../services/AddressService');
const { updateAddressValidator, createAddressValidator } = require('../validator/addressValidator');


router.route('/address')
   .get(
      AuthService.protect,
      AuthService.allowTo('admin'),
      getAllAddresses
   )
   .post(
      AuthService.protect,
      AuthService.allowTo('user'),
      createAddressValidator,
      addNewAddress
   )


router.use(
   AuthService.protect,
   AuthService.allowTo('user', 'admin')
)


router.route('/address/:id')
   .get(getAddress)
   .put(
      updateAddressValidator,
      updateAddress
   )
   .delete(deleteAddress)



module.exports = router;