const { sequelize } = require('./db');
const { Restaurant, Menu } = require('./models/index');
const { seedRestaurant, seedMenu } = require('./seedData');

describe('Restaurant and Menu Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    });

    test('can create a Restaurant', async () => {
        const restaurant = await Restaurant.create({
            name: 'The Great Restaurant',
            location: '123 Food St',
            cuisine: 'Italian'
        });

        expect(restaurant).toHaveProperty('id');
        expect(restaurant.name).toBe('The Great Restaurant');
        expect(restaurant.location).toBe('123 Food St');
        expect(restaurant.cuisine).toBe('Italian');
    });

    test('can create a Menu', async () => {
        const restaurant = await Restaurant.create({
            name: 'The Tasty Diner',
            location: '456 Eatery Lane',
            cuisine: 'American'
        });

        const menu = await Menu.create({
            name: 'Lunch Menu',
            price: 15.99,
            restaurantId: restaurant.id
        });

        expect(menu).toHaveProperty('id');
        expect(menu.name).toBe('Lunch Menu');
        expect(menu.price).toBe(15.99);
        expect(menu.restaurantId).toBe(restaurant.id);
    });

    test('can find Restaurants', async () => {
        await Restaurant.bulkCreate(seedRestaurant);

        const restaurants = await Restaurant.findAll();
        expect(restaurants.length).toBeGreaterThan(0);
        expect(restaurants[0]).toHaveProperty('name');
    });

    test('can find Menus', async () => {
        const restaurant = await Restaurant.create({
            name: 'The Diner',
            location: '789 Street Rd',
            cuisine: 'Mexican'
        });

        await Menu.bulkCreate(seedMenu);

        const menus = await Menu.findAll({
            where: { restaurantId: restaurant.id }
        });

        expect(menus.length).toBeGreaterThan(0);
        expect(menus[0]).toHaveProperty('name');
    });

    test('can delete Restaurants', async () => {
        const restaurant = await Restaurant.create({
            name: 'Delete Me Restaurant',
            location: 'Somewhere',
            cuisine: 'Any'
        });

        const deletedRestaurant = await restaurant.destroy();
        expect(deletedRestaurant).toBe(1);

        const foundRestaurant = await Restaurant.findByPk(restaurant.id);
        expect(foundRestaurant).toBeNull();
    });

    test('can delete Menus', async () => {
        const restaurant = await Restaurant.create({
            name: 'Menu Deletion Restaurant',
            location: 'Another Place',
            cuisine: 'Italian'
        });

        const menu = await Menu.create({
            name: 'Special Menu',
            price: 29.99,
            restaurantId: restaurant.id
        });

        const deletedMenu = await menu.destroy();
        expect(deletedMenu).toBe(1);

        const foundMenu = await Menu.findByPk(menu.id);
        expect(foundMenu).toBeNull();
    });
});
