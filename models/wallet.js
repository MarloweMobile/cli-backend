const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    walletAddress: {
        type: String,
        required: true
    },
    walletSeed: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

walletSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

walletSchema.set('toJSON', {
    virtuals: true
});

exports.Wallet = mongoose.model('Wallet', walletSchema);
exports.walletSchema = walletSchema;