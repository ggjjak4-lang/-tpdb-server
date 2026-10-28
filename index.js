const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const axios = require("axios");
const app = express();

const TPDB_API_KEY = "HrFSRaD7NGwn2kNohKcjfH8gQSqFa5cQISDGyRSLe4765f51";

const manifest = {
    id: "org.tpdb.addon",
    version: "1.0.0",
    name: "ThePornoDB Addon",
    description: "Stremio Addon for ThePornoDB using personal API key",
    types: ["movie", "series"],
    catalogs: [],
    resources: ["meta"]
};

const builder = new addonBuilder(manifest);

builder.defineMetaHandler(async function(args) {
    try {
        const imdbId = args.id;
        const response = await axios.get(`https://api.theporndb.net/scenes?parse=${imdbId}`, {
            headers: { Authorization: `Bearer ${TPDB_API_KEY}` }
        });
        
        if (response.data && response.data.data && response.data.data.length > 0) {
            const scene = response.data.data[0];
            return {
                meta: {
                    id: imdbId,
                    type: args.type,
                    name: scene.title,
                    poster: scene.poster || scene.background,
                    background: scene.background,
                    description: scene.description || "No description available."
                }
            };
        }
        return { meta: null };
    } catch (error) {
        console.error("Error fetching from TPDB:", error.message);
        return { meta: null };
    }
});

const { getRouter } = require("stremio-addon-sdk");
app.use(getRouter(builder.getInterface()));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Addon active on port ${PORT}`);
});

