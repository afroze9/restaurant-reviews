import { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchZip, setSearchZip] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');
  const [cuisines, setCuisines] = useState(['All Cuisines']);

  useEffect(() => {
    getRestaurants();
    getCuisines();
  }, []);

  const getRestaurants = () => {
    RestaurantDataService.getAll()
      .then(res => {
        console.log(res.data);
        setRestaurants(res.data.restaurants);
      });
  }

  const getCuisines = () => {
    RestaurantDataService.getCuisines()
      .then(res => {
        console.log(res.data);
        setCuisines(['All Cuisines'].concat(res.data));
      });
  }

  const refreshList = () => {
    getRestaurants();
  }

  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then(res => {
        console.log(res.data);
        setRestaurants(res.data.restaurants);
      })
      .catch(e => console.error(e));
  }

  const findByName = () => {
    find(searchName, 'name');
  }

  const findByZip = () => {
    find(searchZip, 'zipcode');
  }

  const findByCuisine = () => {
    find(searchCuisine, 'cuisine');
  }

  return (
    <div className="container">
      <div className="row pb-1">
        <div className="input-group col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={findByName}
              type="button">Search</button>
          </div>
        </div>

        <div className="input-group col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={e => setSearchZip(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={findByZip}
              type="button">Search</button>
          </div>
        </div>

        <div className="input-group col-md-4">
          <select onChange={e => setSearchCuisine(e.target.value)} className="form-select">
            {cuisines.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine.substr(0, 20)}</option>)}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={findByCuisine}
              type="button">Search</button>
          </div>
        </div>
      </div>

      <div className="row">
        {
          restaurants.map(restaurant => {
            const address = `${restaurant.address.building}, ${restaurant.address.street}, ${restaurant.address.zipcode}`;

            return (
              <div key={restaurant._id} className="col-lg-4 pb-1">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <p className="card-text">
                      <strong>Cuisine: </strong>{restaurant.cuisine}<br />
                      <strong>Address: </strong>{address}
                    </p>
                    <div className="row">
                      <Link to={"/restaurants/" + restaurant._id} className="btn btn-primary">View Reviews</Link>
                      <a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary">View on Map</a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default RestaurantList;