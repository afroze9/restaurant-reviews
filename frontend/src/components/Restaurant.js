import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RestaurantDataService from "../services/restaurant";

const Restaurant = (props) => {
  const initState = {
    id: null,
    name: '',
    address: {},
    cuisine: '',
    reviews: []
  }

  const [restaurant, setRestaurant] = useState(initState);
  const { id } = useParams();

  useEffect(() => {
    getRestaurant(id);
  }, [id]);

  const getRestaurant = id => {
    RestaurantDataService.get(id)
      .then(res => {
        console.log(res.data);
        setRestaurant(res.data);
      })
      .catch(e => console.error(e));
  }

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(res => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1);
          return ({
            ...prevState
          });
        })
      })
      .catch(e => console.error(e));
  }

  return (
    <div>
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br />
            <strong>Address: </strong>{restaurant.address.building}{restaurant.address.street} {restaurant.address.zipcode}
          </p>
          <Link
            to={'/restaurants/' + id + '/review'}
            className="btn btn-primary">
            Add review
          </Link>
          <h4>Reviews</h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => (
                <div className="col-lg-4 pb-1" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <p className="card-text">
                        {review.text}<br />
                        <strong>User: </strong>{review.name}<br />
                        <strong>Date: </strong>{review.date}
                      </p>
                      {
                        props.user && props.user.id === review.user_id &&
                        <div className="row">
                          <a onClick={() => deleteReview(review._id, index)} className="btn btn-danger col-md-6 mb-1">Delete</a>
                          <Link
                            to="review/"
                            state={{ currentReview: review }}
                            className="btn btn-primary col-md-6 mb-1">
                            Edit
                          </Link>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              )
              )) : (
              <div>No reviews</div>
            )}
          </div>
        </div>) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )
      }
    </div >
  )
}

export default Restaurant;