const express = require('express');

const { getUser, listUsers, updateUser } = require('../../use-cases/user');
const { listOrders } = require('../../use-cases/order');

const { countOccurence } = require('../../utils');
const { errors } = require('../../utils/errors');
const logger = require('../../services/logger');

const router = express.Router();

router.get('/', async (req, res) => {
    let users = [];

    try {
        users = await listUsers();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    let orders = [];

    try {
        orders = await listOrders();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    for(let i = 0; i < users.length; i++) {
        users[i].ordersCount = countOccurence(orders.map(order => order.userId), users[i].id);
    }

    res.render('admin/users/index', {
        path: '../../',
        user: req.session.user,
        cart: req.session.cart,
        users: users
    });
});

router.post('/edytuj', async (req, res) => {
    const { id, admin } = req.query;

    if(!id || !admin) {
        return res.redirect(`/zarzadzanie-sklepem/konta-klientow?action=set-admin&error=${errors.invalidData[0]}`);
    }

    try {
        const user = await getUser({ id });
        user.admin = admin === 'true';

        await updateUser({ user });
    } catch(error) {
        return res.redirect(`/zarzadzanie-sklepem/konta-klientow?action=set-admin&error=${error.appCode}`);
    }

    res.redirect(`/zarzadzanie-sklepem/konta-klientow?action=set-admin&success=true`);
});

module.exports = router;