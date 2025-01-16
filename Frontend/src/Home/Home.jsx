import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import Feed from "../Feed/Feed";
import "./home.css";
const Home = ({sidebar , setSidebar, category,setCategory,search,setSearch}) => {
  
  return (
    <>
      <div className="whole-cont">
        <Navbar setSidebar={setSidebar}  setSearch={setSearch} setCategory={setCategory}/>
        <div className="home">
          <Sidebar
            sidebar={sidebar}
            setCategory={setCategory}
            category={category}
            setSearch={setSearch}
          />
          <Feed sidebar={sidebar} category={category} search={search}/>
        </div>
      </div>
    </>
  );
};

export default Home;
