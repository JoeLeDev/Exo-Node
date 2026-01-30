import express from 'express';
import countries from './countries.json' assert { type: 'json' };
import logger from './logger.js';

const app = express();
app.use(express.json());

app.get('/countries', (req, res) => {
    logger.info('GET /countries - Liste de tous les pays demandée');
    if (!countries) {
        logger.warn('Aucun pays trouvé dans la base de données');
        return res.status(404).json({ error: 'Aucun pays trouvé' });
    }
    else {
        logger.info(`Retour de ${countries.length} pays`);
        res.json(countries);
    }

});

app.get('/countries/:id', (req, res) => {
    logger.info(`GET /countries/${req.params.id} - Recherche d'un pays par ID`);
    const country = countries.find(country => country.cca2 === req.params.id || country.cca3 === req.params.id);
    
    if (!country) {
        logger.warn(`Pays non trouvé avec l'ID: ${req.params.id}`);
        return res.status(404).json({ error: 'Identifiant non trouvé' });
    }
    
    logger.info(`Pays trouvé: ${country.name.common}`);
    
    res.json({
        name: country.name.common,
        cca2: country.cca2,
        cca3: country.cca3,
        currencies: country.currencies,
        languages: country.languages,
        flag: country.flag,
        capital: country.capital,
        population: country.population,
        continent: country.continents
    });
});


app.get('/countries/short/:id', (req, res) => {
    const country = countries.find(country => country.cca2 === req.params.id || country.cca3 === req.params.id);
    
    if (!country) {
        return res.status(404).json({ error: 'Pays non trouvé' });
    }
    
    res.json({
        name: country.name.common,
        cca2: country.cca2,
        cca3: country.cca3,
        flag: country.flag
    });
});

app.put('/countries/:id', (req, res) => {
    logger.info(`PUT /countries/${req.params.id} - Mise à jour de la population`);
    const country = countries.find(country => country.cca2 === req.params.id || country.cca3 === req.params.id);
    
    
    if (!country) {
        logger.warn(`Pays non trouvé avec l'ID: ${req.params.id}`);
        return res.status(404).json({ error: 'Pays non trouvé' });
    }
    
    const population = req.body.population;
    
   
    if (population === undefined || population === null) {
        logger.warn(`Population manquante pour ${country.name.common}`);
        return res.status(400).json({ error: 'La population est requise' });
    }
    
    if (typeof population !== 'number' || population < 0) {
        logger.warn(`Population invalide pour ${country.name.common}: ${population}`);
        return res.status(400).json({ error: 'La population doit être un nombre positif' });
    }
    
    const oldPopulation = country.population;
    country.population = population;
    logger.info(`Population de ${country.name.common} mise à jour: ${oldPopulation} → ${population}`);
    res.json(country);
});

app.get('/countries/:id/:key', (req, res) => {
    logger.info(`GET /countries/${req.params.id}/${req.params.key} - Accès à une propriété spécifique`);
    const country = countries.find(country => country.cca2 === req.params.id || country.cca3 === req.params.id);
    
    if (!country) {
        logger.warn(`Pays non trouvé avec l'ID: ${req.params.id}`);
        return res.status(404).json({ error: 'Pays non trouvé' });
    }
    
    const key = req.params.key;
    

    const getNestedValue = (obj, path) => {
        const keys = path.split('.'); // Transforme l'URL en un tableau de clés
        let value = obj; // Commence avec l'objet complet
        
        // Boucle sur chaque clé du tableau
        for (const k of keys) {
            if (value === null || value === undefined) {
                return undefined;
            }
            value = value[k]; // Accède à la valeur de la clé complète a chaque itération
        }
        return value;
    };
    
    const value = getNestedValue(country, key);
    
    if (value === undefined) {
        logger.warn(`Clé "${key}" non trouvée pour ${country.name.common}`);
        return res.status(404).json({ error: `La clé "${key}" n'existe pas pour ce pays` });
    }
    
    logger.info(`Valeur récupérée pour ${country.name.common}.${key}: ${JSON.stringify(value)}`);
    res.json(value);
});

export default app;