import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate , useParams , Link } from "react-router-dom";

const JobDetailPage = () => {
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState({});
    const [isRefresh, setIsRefresh] = useState(false);
    const navigate = useNavigate();
  const [jobDetail, setJobDetail] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/v1/jobs/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              },
          });
        setJobDetail(response.data.jobDetail);
        console.log(response);
      } catch (error) {
        console.error('Error fetching job detail:', error);
      }
    };

    fetchJobDetail();
  }, [id]);

  useEffect(() => {
    const validateLogin = async () => {
        try {
            // Check status user login
            // 1. Get token from localStorage
            const token = localStorage.getItem("token");

            // 2. Check token validity from API
            const currentUserRequest = await axios.get(
                "http://localhost:4000/v1/auth/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const currentUserResponse = currentUserRequest.data;

            if (currentUserResponse.status) {
                setUser(currentUserResponse.data.user);
            }
        } catch (err) {
            setIsLoggedIn(false);
        }
    };

    validateLogin();
    setIsRefresh(false);
}, [isRefresh]);

  return isLoggedIn ? (
    <div>
        <Link to="/job-list">Back to Job List</Link>
      {jobDetail ? (
        <div>
          <h2>{jobDetail.title}</h2>
          <p>{jobDetail.type} / {jobDetail.location}</p>
          <hr/>
          <div dangerouslySetInnerHTML={{ __html: jobDetail.description }} />
          <hr />
          <p>How to Apply : </p>
          <div  dangerouslySetInnerHTML={{ __html: jobDetail.how_to_apply }} />
          <hr/>
          <h6>{jobDetail.company}</h6>
          <img src={jobDetail.company_logo} alt="Company Logo" />
          <p>{jobDetail.company_url}</p>
        </div>
      ) : (
        <p>Loading job detail...</p>
      )}
    </div>
  ) : (
    navigate("/")
  );
};

export default JobDetailPage;