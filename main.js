import express from 'express';
import countries from './countries.json' assert { type: 'json' };

const app = express();
app.use(express.json());

app.get('/countries', (req, res) => {
    if (!countries) {
        return res.status(404).json({ error: 'Aucun pays trouvé' });
    }
    else {
        res.json(countries);
    }

});

app.get('/countries/:id', (req, res) => {
    const country = countries.find(country => country.cca2 === req.params.id || country.cca3 === req.params.id);
    
    if (!country) {
        return res.status(404).json({ error: 'Identifiant non trouvé' });
    }
    
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
    const country = countries.find(country => country.cca2 === req.params.id || country.cca3 === req.params.id);
    
    
    if (!country) {
        return res.status(404).json({ error: 'Pays non trouvé' });
    }
    
    const population = req.body.population;
    
   
    if (population === undefined || population === null) {
        return res.status(400).json({ error: 'La population est requise' });
    }
    
    if (typeof population !== 'number' || population < 0) {
        return res.status(400).json({ error: 'La population doit être un nombre positif' });
    }
    
    country.population = population;
    res.json(country);
});

app.get('/countries/search/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    const countries = countries.filter(country => country.name.common.toLowerCase().includes(keyword.toLowerCase()));
    res.json(countries);
});

export default app;