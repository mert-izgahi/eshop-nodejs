import mongoose, { Document } from "mongoose";

interface CustomerType extends Document {
    accountId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new mongoose.Schema<CustomerType>({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, unique: true },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});


customerSchema.virtual("account", {
    ref: "Account",
    localField: "accountId",
    foreignField: "_id",
    justOne: true
});

customerSchema.pre("find", function (next) {
    this.populate("account");
    next();
})

const CustomerProfile = mongoose.model("CustomerProfile", customerSchema);
export default CustomerProfile;