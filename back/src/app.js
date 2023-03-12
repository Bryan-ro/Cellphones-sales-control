const express = require("express");
const db = require("./config/configDb.js");
const { CellPhone, Model } = require("./models/ModelAndCellphone.js");
const cors = require("cors");

db.authenticate()
.then(() => {
    console.log("Connected to database successfully");
}).catch(err => {
    console.log("Error connecting to database: " + err.message);
})

const app = express();
app.use(express.json());
app.use(cors());

// Rotas de criação de IMEI;

app.get("/device-info", async (req, res) => {
    const devices = await CellPhone.findAll({
        include: {
            model: Model,
            as: "models"
        }
    })

    res.status(200).json(devices);
})

/**
 * get
 * post
 * put
 * delete
 */

app.get("/device-info/:id", async (req, res) => {
    const id = req.params.id

    const device = await CellPhone.findByPk(id, {
        include: {
            model: Model,
            as: "models"
        }
    })

    !device ? res.status(404).json({ message: "This IMEI does not exist" }) : res.status(200).json(device);
})

app.post("/device-info", (req, res) => {
    const { imei, observations, modelId } = req.body;
    
    CellPhone.create({
        imei,
        observations,
        sold: false,
        modelId    
    }).then(() => {
        res.status(201).json({ message: "Created successfully" });
    }).catch(err => {
        res.status(422).json({ message: `Failed to create: ${err}` });
    })
})

app.put("/device-info/sold/:id", async (req, res) => {
    const id = req.params.id;
    const { price } = req.body;

    const ifSold = await CellPhone.findByPk(id);

    if(ifSold.sold) {
        return res.status(422).json({ message: "This cell phone has already been sold" });
    }

    await CellPhone.update({ sold: true, price }, { where: { imei: id }});

    return res.status(201).json({ message: "updated successfully" });
})

app.delete("/device-info/:id", async (req, res) => {
    const id = req.params.id;

    await CellPhone.destroy({ where: { imei: id } });

    return res.status(202).json({ message: "deleted sucessfully" });
})

/*  
    =========================== 
    ROTAS DE CRIAÇÃO DE MODELOS
    ===========================
*/

app.get("/model-info", async (req, res) => {
    const models = await Model.findAll();

    res.status(200).json(models);
})

app.get("/model-info/:id", async (req, res) => {
   const model = await Model.findByPk(req.params.id);

   !model ? res.status(404).json({ message: "This model does not exist" }) :  res.status(200).json(model);
})
   
app.post("/model-info", (req, res) => {
    const { model, storage, ram } = req.body;
                                                                                                                                                                
    Model.create({
        model,
        storage,
        ram
    }).then(() => {
        res.status(201).json({ message: "Created successfully" });
    })
})

app.put("/model-info/:id", async (req, res) => {
    const { model, storage, ram } = req.body;
    const id = req.params.id;

    if(!model && !storage && !ram) {
        return res.status(404).json({ message: "please insert a valid parameter"});
    }
    
    await Model.update({ model, storage, ram }, { where: { id } });

    return res.status(200).json({ message: "Updated successfully" });
})

app.delete("/model-info/:id", async (req, res) => {
    const model = await Model.destroy({ where: { id: req.params.id } });
    !model ? res.status(404).json({ message: "Fail" }) : res.status(200).json({ message: "Deleted"});
})

module.exports = app;
