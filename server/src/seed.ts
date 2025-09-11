import { MONGODB_URI } from "./configs";
import { connectDb } from "./configs/mongoose";
import Category from "./models/category.model";
import { log } from "./utils/logger";
async function seedCategories() {
    // Clear old data
    await Category.deleteMany({});
    console.log("🗑️ Cleared old categories");

    const categories = [
        {
            name: "Electronics",
            description: "Devices, gadgets, and accessories",
            image: "https://example.com/electronics.jpg",
        },
        {
            name: "Fashion",
            description: "Clothes, shoes, and accessories",
            image: "https://example.com/fashion.jpg",
        },
        {
            name: "Home & Kitchen",
            description: "Furniture, appliances, and more",
            image: "https://example.com/home-kitchen.jpg",
        },
        {
            name: "Books",
            description: "Fiction, non-fiction, and textbooks",
            image: "https://example.com/books.jpg",
        },
        {
            name: "Sports",
            description: "Sports equipment and outdoor gear",
            image: "https://example.com/sports.jpg",
        },
    ];

    // Insert categories
    const inserted = await Category.insertMany(categories);
    log.info(`✅ Inserted ${inserted.length} categories`);
}

const main = async () => {
    try {
        await connectDb(MONGODB_URI);
        await seedCategories();
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding categories:", err);
        process.exit(1);
    }
};

main();