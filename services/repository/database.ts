import mongoose from "mongoose";

class Database {
    private models: any = {};

    constructor() {
        mongoose.connect("mongodb://127.0.0.1:27017/hangmanDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch((e) => {
            console.log("DATABASE CONNECTION ERROR: "+e);
        });
    }

    addModel(modelName, structure) {
        let schema = new mongoose.Schema(structure);
        this.models[modelName] = mongoose.model(modelName, schema);
    }

    async insert(modelName, data) {
        let entry = new this.models[modelName](data);
        try {
            await entry.save();
        } catch(e) {
            console.log("DATABASE INSERT ERROR: "+e);
        }
    }

    async find(modelName, id) {
        try {
            return await this.models[modelName].findOne({_id: id});
        } catch(e) {
            console.log("DATABASE FIND ERROR: "+e);
        }
    }

    async findMany(modelName, sort, amount) {
        try {
            return (await this.models[modelName].find({}).sort(sort).limit(amount)).map(model => model._doc);
        } catch(e) {
            console.log("DATABASE FIND ERROR: "+e);
        }
    }

    async update(modelName, id, score) {
        try {
            await this.models[modelName].updateOne({_id: id}, {$set: {score}});
        } catch(e) {
            console.log("DATABASE UPDATE ERROR: "+e);
        }
    }
}

export const database = new Database();