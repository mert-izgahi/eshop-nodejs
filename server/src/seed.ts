import { faker } from '@faker-js/faker';

import { MONGODB_URI } from "./configs";
import { connectDb } from "./configs/mongoose";
import Account from './models/account.model';
import Category from "./models/category.model";

import AdminProfile from './models/admin.model';
import CustomerProfile from './models/customer.model';
import SellerProfile from './models/seller.model';
import StaffProfile from './models/staff.model';

const ACCOUNTS_COUNT = 100;
const CATEGORIES_COUNT = 20;
// Sample categories for more realistic data
const categoryNames = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports & Outdoors',
    'Toys & Games', 'Health & Beauty', 'Automotive', 'Food & Beverages',
    'Music & Movies', 'Jewelry', 'Pet Supplies', 'Office Supplies',
    'Baby & Kids', 'Travel', 'Art & Crafts', 'Furniture', 'Kitchen',
    'Photography', 'Gaming'
];

const roles = ['customer', 'seller', 'staff'];
const providers = ['credentials', 'google', 'facebook'];
async function generateAccount() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const role = faker.helpers.arrayElement(roles);
    const provider = faker.helpers.arrayElement(providers);

    return {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        profilePicture: faker.image.avatar(),
        password: provider === 'credentials' ? "password123" : undefined,
        isActive: faker.datatype.boolean({ probability: 0.9 }),
        deletedAt: faker.datatype.boolean({ probability: 0.1 }) ? faker.date.past() : undefined,
        verified: faker.datatype.boolean({ probability: 0.8 }),
        provider,
        role,
        phoneNumber: faker.phone.number(),
    };
}

function generateCategory(index: number) {
    const name = categoryNames[index] || faker.commerce.department();

    return {
        name,
        description: faker.lorem.sentence({ min: 10, max: 20 }),
        image: faker.image.url({
            width: 300,
            height: 300,
        }),
    };
}

async function clearDatabase() {
    console.log('🧹 Clearing existing data...');
    await Account.deleteMany({});
    await AdminProfile.deleteMany({});
    await CustomerProfile.deleteMany({});
    await SellerProfile.deleteMany({});
    await StaffProfile.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Database cleared');
}

async function seedAccounts() {
    console.log(`🌱 Seeding ${ACCOUNTS_COUNT} accounts...`);

    const accounts = [];
    for (let i = 0; i < ACCOUNTS_COUNT; i++) {
        accounts.push(await generateAccount());
    }

    let successCount = 0;
    let skippedCount = 0;

    for (const accountData of accounts) {
        try {
            // Use .create() instead of insertMany() → triggers post('save') hook!
            const account = await Account.create(accountData);
            await Account.createProfileForNewUser(account);
            successCount++;
        } catch (err: any) {
            if (err.code === 11000) { // Duplicate key error (email)
                console.warn(`⚠️ Skipped account with email ${accountData.email} (duplicate)`);
                skippedCount++;
            } else {
                console.error(`❌ Error creating account:`, err.message);
            }
        }
    }

    console.log(`✅ Successfully seeded ${successCount} accounts (${skippedCount} skipped due to duplicates or errors)`);
}

async function seedCategories() {
    console.log(`🌱 Seeding ${CATEGORIES_COUNT} categories...`);

    const categories = [];
    for (let i = 0; i < CATEGORIES_COUNT; i++) {
        categories.push(generateCategory(i));
    }

    try {
        await Category.insertMany(categories);
        console.log(`✅ Successfully seeded ${CATEGORIES_COUNT} categories`);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
    }
}

async function createAdmin() {
    try {
        const adminAccount = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@localhost.com',
            password: 'password123',
            role: 'admin',
            isActive: true,
            verified: true,
            provider: 'credentials',
            phoneNumber: '1234567890',
        };
        const account = await Account.create(adminAccount);
        await Account.createProfileForNewUser(account);
        console.log('✅ Admin account created');
    } catch (error) {
        console.error('❌ Error creating admin account:', error);
    }
}
async function main() {
    try {
        console.log('🚀 Starting database seeding...');

        await connectDb(MONGODB_URI);
        await clearDatabase();
        await createAdmin();
        await seedCategories();
        await seedAccounts();

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        process.exit(0);
    }
}

main();