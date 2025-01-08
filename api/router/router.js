    const express = require('express');
    const { getUsers,addRole, registerUser, loginUser, saveSensorData,saveSensorData2, getSensors, getRoles, adddesignation, getdesignation, deleteRole, DeleteDesignation, test, updateConfigs, getconfigs, updateStationConfig, getStationconfigs, editUser, addLog, getSensorsrr, getSensorsTime } = require('../controllers/controller');

    const router = express.Router();

// Define routes
router.get('/users', getUsers);
router.post('/users/register', registerUser);
router.post('/users/edit', editUser);
router.post('/users/login', loginUser);
router.post('/users/sensor1', saveSensorData);
router.post('/users/sensors2', saveSensorData2);
router.get('/users/sensorData', getSensors);
router.post('/users/addrole', addRole);
router.get('/users/getRoles', getRoles);
router.post('/users/adddesignation', adddesignation);
router.get('/users/getdesignation', getdesignation);
router.delete('/users/deleteRole/:id', deleteRole);
router.delete('/users/deleteDesignation/:id', DeleteDesignation);
router.get('/split', test);
router.put('/config', updateConfigs);
router.get('/getconfigs', getconfigs);
router.put('/updatestationconfig', updateStationConfig);
router.get('/getstationconfig', getStationconfigs);
router.post('/addlog', addLog);
router.get('/users/getSensorsTime', getSensorsTime);

module.exports = router;