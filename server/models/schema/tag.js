const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        // add relevant properties.
        name: {type: String, required: true, maxLength: 100}
    },
    { collection: "Tag" }
);
