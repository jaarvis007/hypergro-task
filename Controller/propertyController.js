const Property = require("../models/Property");

const searchProperties = async (req, res) => {
  try {
    const {
      title,
      type,
      priceMin,
      priceMax,
      state,
      city,
      areaMin,
      areaMax,
      bedrooms,
      bathrooms,
      amenities,
      furnished,
      availableFrom,
      listedBy,
      tags,
      colorTheme,
      ratingMin,
      isVerified,
      listingType,
      keyword,
    } = req.query;

    let query = {};

    if (title) query.title = new RegExp(title, "i");
    if (type) query.type = type;
    if (state) query.state = state;
    if (city) query.city = city;
    if (furnished) query.furnished = furnished;
    if (listedBy) query.listedBy = listedBy;
    if (colorTheme) query.colorTheme = colorTheme;
    if (listingType) query.listingType = listingType;
    if (isVerified !== undefined) query.isVerified = isVerified === "true";
    if (availableFrom) query.availableFrom = { $gte: new Date(availableFrom) };

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    if (areaMin || areaMax) {
      query.areaSqFt = {};
      if (areaMin) query.areaSqFt.$gte = Number(areaMin);
      if (areaMax) query.areaSqFt.$lte = Number(areaMax);
    }

    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (ratingMin) query.rating = { $gte: Number(ratingMin) };

    // Handle amenities: match if any keyword exists in the string
    if (amenities) {
      const amenityList = amenities
        .split("|")
        .map((item) => new RegExp(item, "i"));
      query.$and = amenityList.map((regex) => ({
        amenities: { $regex: regex },
      }));
    }

    // Tags are an array, so $in works
    if (tags) {
      const tagList = tags.split("|");
      query.tags = { $regex: new RegExp(tagList.join("|"), "i") };
    }

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { title: regex },
        { type: regex },
        { state: regex },
        { city: regex },
        { amenities: { $regex: regex } },
        { furnished: regex },
        { listedBy: regex },
        { colorTheme: regex },
        { tags: { $in: [regex] } }, // partial match in tags array
      ];
    }

    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { searchProperties };
