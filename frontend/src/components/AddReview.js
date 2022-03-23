import { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RestaurantDataService from "../services/restaurant";

const AddReview = (props) => {
  const location = useLocation();
  const { id } = useParams();

  let initReviewState = '';
  let editing = false;

  console.log(location.state)
  if (location.state && location.state.currentReview) {
    editing = true;
    initReviewState = location.state.currentReview.text;
  }


  const [review, setReview] = useState(initReviewState);
  const [submitted, setSubmitted] = useState(false);

  const saveReview = () => {
    let data = {
      text: review,
      name: props.user.name,
      userId: props.user.id,
      restaurantId: id
    };

    if (editing) {
      data.reviewId = location.state.currentReview._id;
      RestaurantDataService.updateReview(data)
        .then(res => {
          setSubmitted(true);
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      RestaurantDataService.createReview(data)
        .then(res => {
          setSubmitted(true);
          console.log(res.data);
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>Review submitted!</h4>
              <Link to={`/restaurants/${id}`} className="btn btn-success" >Back to restaurant</Link>
            </div>
          ) : (
            <div>


              <div className="form-group">
                <label htmlFor="description">{editing ? 'Edit' : 'Create'}</label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  name="text"
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>) : (<div>Please log in</div>)
      }

    </div >
  )
}

export default AddReview;