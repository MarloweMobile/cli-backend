const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    name: {
        type: String,
    },
    contractFiles: {
        contractFile: {
            type: String,
            required: true,
        },
        contractState: {
            type: String,
            required: true,
        },
        marloweFile: {
            type: String,
        },
        tx: {
            type: String,
        }
    },
    roleCurrency: {
        type: String,
    },    
    roles: [{
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true
        },
        token: {
            type: String,
        },
        deadline: {
            type: Number,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        }
    }],
    transactions: [{
        marlowe: [{
            type: String,
        }],
        tx: [{
            type: String,
        }]
    }],
    stateTx: {
        type: String,
    }
    },
    
)

contractSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

contractSchema.set('toJSON', {
    virtuals: true
});

exports.Contract = mongoose.model('Contract', contractSchema);
exports.contractSchema = contractSchema;