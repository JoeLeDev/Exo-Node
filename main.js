import express from 'express';
import countries from './countries.json' with { type: 'json' };

const app = express();

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
        return res.status(404).json({ error: 'Pays non trouvé' });
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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
