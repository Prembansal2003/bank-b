require("dotenv").config();
const mongo = require("mongoose");
const url = process.env.DB_URL;

mongo.connect(url, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    readPreference: "secondaryPreferred"
});

mongo.connection.on("connected", () => console.log("MongoDB connected"));
mongo.connection.on("error", (err) => console.error("MongoDB error:", err));

const findOneRecord = async (query, schema) => {
    const record = await schema.findOne(query);
    return record;
};
const findAllRecord = async (schema) => {
    const record = await schema.find();
    return record;
};
const createNewRecord = async (data, schema) => {
    const record = await new schema(data).save();
    return record;
};
const updateRecord = async (id, data, schema) => {
    const record = await schema.findByIdAndUpdate(id, data, { new: true });
    return record;
};
const deleteRecord = async (id, schema) => {
    const record = await schema.findByIdAndDelete(id);
    return record;
};

module.exports = {
    findOneRecord,
    findAllRecord,
    createNewRecord,
    updateRecord,
    deleteRecord
};