const mongoose = require('mongoose');

const aiCacheSchema = mongoose.Schema({
    promptHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    response: {
        type: Object, // Storing JSON response
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('AiCache', aiCacheSchema);
