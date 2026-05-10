import { useState } from "react";
import "./Filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
    bathroom: searchParams.get("bathroom") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
    furnished: searchParams.get("furnished") || "",
    sortBy: searchParams.get("sortBy") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    const cleaned = Object.fromEntries(
      Object.entries(query).filter(([, value]) => String(value).trim() !== "")
    );
    setSearchParams(cleaned);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item city-filter">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            value={query.city}
          />
        </div>
        
        <div className="item">
          <label htmlFor="sortBy">Sort By</label>
          <select
            name="sortBy"
            id="sortBy"
            onChange={handleChange}
            value={query.sortBy}
          >
            <option value="">any</option>
            <option value="priceAsc">Price - Low to high</option>
            <option value="priceDesc">Price - High to low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            value={query.property}
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        <div className="item">
          <label htmlFor="bathroom">Bathroom</label>
          <input
            type="number"
            id="bathroom"
            name="bathroom"
            placeholder="any"
            onChange={handleChange}
            value={query.bathroom}
          />
        </div>
        <div className="item">
          <label htmlFor="minArea">Min Area</label>
          <input
            type="number"
            id="minArea"
            name="minArea"
            placeholder="any"
            onChange={handleChange}
            value={query.minArea}
          />
        </div>
        <div className="item">
          <label htmlFor="maxArea">Max Area</label>
          <input
            type="number"
            id="maxArea"
            name="maxArea"
            placeholder="any"
            onChange={handleChange}
            value={query.maxArea}
          />
        </div>
        <div className="item">
          <label htmlFor="furnished">Furnished</label>
          <select
            name="furnished"
            id="furnished"
            onChange={handleChange}
            value={query.furnished}
          >
            <option value="">any</option>
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
