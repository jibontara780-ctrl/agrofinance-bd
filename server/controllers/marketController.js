const { MarketPrice } = require('../models');

exports.getMarketPrices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let prices = await MarketPrice.find();

    if (category && category.toLowerCase() !== 'all') {
      const catLower = category.toLowerCase();
      prices = prices.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        if (pCat === catLower) return true;
        // Mapping synonyms
        if (catLower === 'crops' && (pCat === 'grain' || pCat === 'crop' || pCat === 'cereal')) return true;
        if (catLower === 'grain' && (pCat === 'crops' || pCat === 'crop')) return true;
        if (catLower === 'fisheries' && (pCat === 'fishery' || pCat === 'fish')) return true;
        if (catLower === 'horticulture' && (pCat === 'fruit' || pCat === 'vegetable')) return true;
        return false;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      prices = prices.filter(p => 
        (p.cropName && p.cropName.toLowerCase().includes(q)) || 
        (p.market && p.market.toLowerCase().includes(q)) ||
        (p.crop && p.crop.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMarketPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPrice, market, cropName, category, unit, trend, change } = req.body;

    const item = await MarketPrice.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Market item not found' });

    const newPrice = currentPrice !== undefined ? Number(currentPrice) : (item.currentPrice || item.price || 0);
    const oldPrice = item.currentPrice || item.price || newPrice;
    const calculatedChange = oldPrice > 0 ? Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2)) : 0;
    const calculatedTrend = newPrice >= oldPrice ? 'up' : 'down';

    const updated = await MarketPrice.updateById(id, {
      currentPrice: newPrice,
      price: newPrice,
      previousPrice: oldPrice !== newPrice ? oldPrice : (item.previousPrice || oldPrice),
      change: change !== undefined ? Number(change) : (calculatedChange !== 0 ? calculatedChange : (item.change || 0)),
      trend: trend || (newPrice !== oldPrice ? calculatedTrend : (item.trend || 'up')),
      ...(cropName && { cropName, crop: cropName }),
      ...(market && { market }),
      ...(category && { category }),
      ...(unit && { unit }),
      lastUpdated: 'Just now'
    });

    return res.json({ success: true, message: 'Market price updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMarketPrice = async (req, res) => {
  try {
    const { cropName, crop, category, unit, currentPrice, price, market } = req.body;
    const name = cropName || crop;
    const val = currentPrice !== undefined ? Number(currentPrice) : (price !== undefined ? Number(price) : 0);

    if (!name || val <= 0) {
      return res.status(400).json({ success: false, message: 'Valid commodity name and positive price are required' });
    }

    const newItem = await MarketPrice.create({
      cropName: name,
      crop: name,
      category: category ? category.toLowerCase() : 'grain',
      unit: unit || 'kg',
      currentPrice: val,
      price: val,
      previousPrice: val,
      change: 0,
      trend: 'up',
      market: market || 'Central Agro Trading Hub, Dhaka',
      lastUpdated: 'Just now'
    });

    return res.status(201).json({ success: true, message: 'New market commodity registered successfully', data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMarketPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MarketPrice.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Market item not found' });

    await MarketPrice.deleteById(id);
    return res.json({ success: true, message: 'Commodity listing removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

