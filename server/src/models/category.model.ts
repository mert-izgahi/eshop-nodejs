import mongoose,{Document} from "mongoose";

interface CategoryType extends Document {
    name: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new mongoose.Schema<CategoryType>({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;