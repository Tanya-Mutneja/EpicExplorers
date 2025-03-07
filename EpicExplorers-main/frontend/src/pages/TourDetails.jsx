import React,{useEffect, useRef, useState, useContext} from 'react'
import '../styles/tour-details.css'
import {Container, Row, Col, Form, ListGroup} from 'reactstrap'
import {useParams} from 'react-router-dom'
import calculateAvgRating from '../utils/avgRating'
import avatar from "../assets/images/avatar.jpg"
import Booking from '../components/Booking/Booking'
import Newsletter from '../shared/Newsletter'
import useFetch from '../hooks/useFetch'
import { BASE_URL } from '../utils/config'
import { AuthContext } from '../context/AuthContext'

const TourDetails = () => {
  const {id} = useParams()
  const reviewMsgRef = useRef('')
  const [tourRating, setTourRating] = useState(null)
  const {user} = useContext(AuthContext)


  const {data:tour, loading, error} = useFetch(`${BASE_URL}/tours/${id}`)


  const {
    photo, 
    title, 
    desc, 
    price, 
    reviews,
    address, 
    city, 
    distance, 
    maxGroupSize
  } = tour;

  const {totalRating,avgRating} = calculateAvgRating(reviews)

  const options = {day:"numeric", month:"long", year:"numeric"};

  const submitHandler = async(e) => {
    e.preventDefault()
    const reviewText = reviewMsgRef.current.value

    try {
      if(!user || user===undefined || user===null)
        alert('Please sign in')

        const reviewObj = {
        username: user?.username,
        reviewText,
        rating: tourRating
      }
      const res = await fetch(`${BASE_URL}/review/${id}`,{
        method: 'post',
        headers:{
          'content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reviewObj)
      });

      const result = await res.json();
      if(!res.ok) return alert(result.message)
      alert(result.message);
    } catch(err) {
        alert(err.message)
    }
  };

  useEffect(() => {
    window.scrollTo(0,0)
  },[tour])

  return (
    <>
      <section>
        <Container>
          {
            loading && <h4 className='text-center pt-5'>Loading........</h4>
          }
          {
            error && <h4 className='text-center pt-5'>{error}</h4>
          }
          {
            !loading && !error && <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={photo} alt="" />

                <div className="tour__info">
                  <h2>{title}</h2>

                  <div className='d-flex align-items-center gap-5'>
                  <span className='tour__rating d-flex align-items-center gap-1'>
                    <i className='ri-star-fill' style={{color: "var(--secondary-color)"}}></i>
                    {avgRating === 0 ?null : avgRating}
                    {totalRating === 0 ? (
                    "Not rated"
                    ) : (
                    <span>({reviews?.length})</span>
                  )}            
                  </span>

                  <span>
                    <i className='ri-map-pin-user-fill'></i> {address}
                  </span>
                  </div>

                  <div className="tour__extra-details">
                    <span>
                      <i className='ri-map-pin-2-line'></i> {city} 
                    </span>
                    <span>
                      <i className='ri-money-dollar-circle-line'></i> Rs.{price} /per person 
                    </span>
                    <span>
                      <i className='ri-map-pin-time-line'></i> {distance}k/m
                    </span>
                    <span>
                      <i className='ri-group-line'></i> {maxGroupSize} people
                    </span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>

              </div>
            </Col>

            <Col lg='4'>
              <Booking tour={tour} avgRating={avgRating}/>
            </Col>
          </Row>
          }
        </Container>
      </section>
      <Newsletter/>
    </>
  )
}

export default TourDetails