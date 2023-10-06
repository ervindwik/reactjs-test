import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate ,Link} from "react-router-dom";

const JobListPage = ({token}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [isRefresh, setIsRefresh] = useState(false);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [searchDesc, setSearchDesc] = useState('');
  const [searchLoc, setSearchLoc] = useState('');
  const [searchFullTime, setSearchFullTime] = useState(false);
  const [page, setPage] = useState(1);

  const fetchJobs = async () => {
    try {

      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/v1/jobs/getAll?page=${page}&description=${searchDesc}&location=${searchLoc}&type=${searchFullTime}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          },
      });
      

      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, searchDesc, searchLoc, searchFullTime]);

  const handleSearchDesc = (e) => {
    setSearchDesc(e.target.value);
  };
  const handleSearchLoc = (e) => {
    setSearchLoc(e.target.value);
  };
  const handleSearchFullTime = (e) => {
    setSearchFullTime(prevShowFullTime => !prevShowFullTime);
  };

  const handlePagination = (newPage) => {
    setPage(newPage);
  };

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
      <h2>Job List Page</h2>
      <input type="text" placeholder="Search Jobs Description" value={searchDesc} onChange={handleSearchDesc} /> <input type="text" placeholder="Search Location" value={searchLoc} onChange={handleSearchLoc} /> 
      <label>
        <input type="checkbox" checked={searchFullTime} onChange={handleSearchFullTime} />
        Show Full Time Only
      </label>
      {jobs != null && jobs.length > 0 ? (
        <ul>
        {jobs ? 
        jobs
        .filter((job)=> job && job.title)
        .map((job) => 
          <li key={job.id}><Link to={`/job/${job.id}`}>{job.title}<br /> </Link> {job.company}  -  {job.type} <br/> {job.location} <hr /></li> 
        ): <p>No Jobs available</p>}
      </ul>

      ): (<p> No Jobs available </p>
      )}
      <button onClick={() => handlePagination(page - 1)} disabled={page === 1}>
        Previous Page
      </button>
      <span>Page {page}</span>
      <button onClick={() => handlePagination(page + 1)}>Next Page</button>
    </div>
  ) : (
      navigate("/")
  );
};

export default JobListPage;