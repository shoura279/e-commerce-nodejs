import mongoose, { Schema, model } from "mongoose";

// schema
const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        logo: {
            secure_url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
        addBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    }, {
    timestamps: true
})

// model
export const brandModel = mongoose.models.Brand || model('Brand', brandSchema)