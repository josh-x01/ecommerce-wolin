import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Store } from '../Store';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getError } from '../utils';
import stream from 'stream';
import LoadingBox from '../components/LoadingBox';
// const fs = require('fs');
import { api, homepage } from '../config';



const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function CustomLook() {

  const [selectedUserImage, setSelectedUserImage] = useState(null);
  const [newImage, setNewImage] = useState(null)
  const [userImage, setUserImage] = useState(null)
  const [uploading, setUploading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const params = useParams();
  const { slugId } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`https://wolin-ecommerce.onrender.com/api/products/slug/${slugId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slugId]);

  const getImageData = async (imageUrl) => {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');
    return imageData;
  }

  const handleFileChange = (event) => {
    setSelectedUserImage(event.target.files[0]);
  };

  const uploadUserImage = async (formData) => {
    const headers = {
      Authorization: `Bearer${userInfo.token}`,
    };
    try {
      const response = await fetch(
        `https://wolin-ecommerce.onrender.com/api/users/upload/image?width=480&height=720`,
        {
          method: 'POST',
          headers,
          body: formData,
        }
      );
      const userImageResult = await response.json();
      return userImageResult;
    } catch (error) {
      return error;
    }
  }


  const getImage = async (imageUrl) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        return blob;
      })
      .catch(error => {
        console.error(error);
      });
  }

  // const api = process.env.REACT_APP_API_URL;
  const { hostname, port } = window.location;
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    setUserImage(null);
    setNewImage(null);

    if (selectedUserImage) {
      
      const formData = new FormData();
      formData.append('image', selectedUserImage);
      formData.append('userId', userInfo._id);
      const userImageResult = await uploadUserImage(formData);
      const { path } = userImageResult;
      setUserImage(`https://wolin-ecommerce.onrender.com/${path}`);
      const { hostname, port } = window.location;

      try {
        const response = await fetch('https://wolin-ecommerce.onrender.com/api/users/custom/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userImageUrl: `https://wolin-ecommerce.onrender.com/${path}`,
            productImageUrl: `${homepage}/${product.image}`,
          }),
        });
        const data = await response.json();
        setNewImage(data.image.response.ouput_path_img);
        if (data) {
          setUploading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return <>
    <div>
      <h1>Here you can see how our product fits in you</h1>
      <Row>
        <Col md={3}>
          <h4>Product</h4>
          <img
            className="img-large"
            src={product.image}
            alt='your look'
          ></img>
        </Col>
        <Col md={3}>
          <h4>You</h4>
          {
            userImage === null ?
              <div>
                <h4>Your uploaded image will be displayed here</h4>
                {uploading === true &&
                  <LoadingBox />}
              </div>
              :
              <img
                className="img-large"
                src={userImage}
                alt='your look'
              ></img>
          }
        </Col>
        <Col md={3}>
          <h4>New Look</h4>
          {
            newImage === null ? <div>
              <h4>AI generated image will be displayed here</h4>
              {uploading === true &&
                <LoadingBox />}
            </div> :
              <img
                className="img-large"
                src={newImage === null ? product.image : newImage}
                alt='your look'
              ></img>
          }
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Pirce : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                <form onSubmit={handleFormSubmit} className='w-100'>
                  <h3>Upload your image</h3>
                  <input type='file' name='image' onChange={handleFileChange} className='form-control w-100' />
                  <button type='submit' className='btn btn-primary w-100 mt-2'>
                    Upload Image
                  </button>
                </form>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  </>
}