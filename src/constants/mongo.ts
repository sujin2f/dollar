import mongoose, { Schema } from 'mongoose'
import { Category, Item, PreSelect, User } from 'src/types'

const categorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
})

export const CategoryModel = mongoose.model<Category>(
    'category',
    categorySchema,
)

const itemSchema = new Schema({
    date: String,
    title: String,
    originTitle: String,
    debit: Number,
    credit: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: false,
        },
    ],
})

export const ItemModel = mongoose.model<Item>('item', itemSchema)

const preSelectSchema = new Schema({
    title: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: false,
        },
    ],
})
preSelectSchema.index({ title: 'text' })

export const PreSelectModel = mongoose.model<PreSelect>(
    'preSelect',
    preSelectSchema,
)

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photo: String,
    darkMode: Boolean,
})

export const UserModel = mongoose.model<User>('user', userSchema)
