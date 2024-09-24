import React, { Component } from "react";
import axios from "axios";
import "../css/home.css";
import { Link } from "react-router-dom";
import heroimage from "../images/test.png";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      postsPerPage: 12,
    };
  }

  componentDidMount() {
    this.retrievePosts();
  }

  retrievePosts(page = 1) {
    const { postsPerPage } = this.state;
    axios
      .get(`http://localhost:9000/posts?page=${page}&limit=${postsPerPage}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            posts: res.data.existingPosts,
            currentPage: page,
            totalPages: Math.ceil(res.data.totalPosts / postsPerPage),
          });
        } else {
          console.error("Error fetching posts:", res.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  renderPagination() {
    const { currentPage, totalPages } = this.state;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === currentPage ? "active" : ""}`}
          onClick={() => this.retrievePosts(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => this.retrievePosts(currentPage - 1)}>
            Previous
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => this.retrievePosts(currentPage + 1)}>
            Next
          </button>
        )}
      </div>
    );
  }

  // Helper function to truncate the summary
  truncateSummary(summary, maxLength = 50) {
    if (summary.length > maxLength) {
      return `${summary.substring(0, maxLength)}...`;
    }
    return summary;
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="home">
        <div className="hero">
          <div className="herotext">
            <h1>Welcome</h1>
            <h2>SmartStart Quiz</h2>
            <h4>"Test Your Wits, Challenge Your Mind!"</h4>
          </div>
          <div className="heroimage">
            <img src={heroimage} alt="Example" />
          </div>
        </div>
        <br />
        <center>
          <button className="box1">
            <Link to="/create">
              <font color="white">
                <h1>Create Your Quiz Here</h1>
              </font>
            </Link>
          </button>
        </center>
        <br />
        <div className="card-container">
          {posts
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort posts by date in descending order
            .map((post) => (
              <a href={`/post/${post._id}`} className="card" key={post._id}>
                <div className="card-image">
                  <img
                    src={post.image ? require(`../uploads/${post.image}`) : ""}
                    alt={post.image}
                  />
                </div>
                <div className="card-header">
                  <h3>{post.title}</h3>
                  <p>{this.truncateSummary(post.summery, 100)}</p> {/* Use the truncate function here */}
                </div>
              </a>
            ))}
        </div>
        {this.renderPagination()}
        <br />
      </div>
    );
  }
}
