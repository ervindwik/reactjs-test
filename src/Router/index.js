import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/LoginPage";
import JobList from "../components/JobListPage";
import JobDetailPage from "../components/JobDetailPage";


function Router(props) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/job-list" element={<JobList />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        {/* <Route path="/regis" element={<Regis />} /> */}

      </Routes>
    );
  }
  
  export default Router;