<h1 align="center">
    <img src="https://www.printrunner.com/blog/wp-content/uploads/2016/09/10_UsingURLShorteners-777x437.jpg" width="auto" height="180" />
  <br/>
  URL Shortener API
</h1>

<h2>📌 Description</h2>
<p>
  The URL Shortener API is a web service that allows users to shorten long URLs into concise, shareable links. 
  It supports user authentication, URL analytics, and custom short links. The backend is built using NestJS, 
  and MongoDB is used for database storage. The API ensures security and scalability with JWT authentication and Passport.js.
</p>

<h2>🛠️ Technologies Used</h2>
<ul>
  <li> 
     <img src="https://github.com/devicons/devicon/blob/master/icons/nestjs/nestjs-original.svg" title="nestjs" alt="nestjs " width="15" height="15"/>
    <strong>NestJS:</strong> Backend framework for building scalable applications.
  </li>
  <li>
     <img src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original.svg" title="mongodb" alt="mongodb " width="15" height="15"/>
    <strong>MongoDB:</strong> NoSQL database for storing URLs and user details.
  </li>
  <li>
   <img src="https://github.com/devicons/devicon/blob/master/icons/docker/docker-original.svg" title="docker" alt="docker" width="15" height="15"/>
    <strong>Docker:</strong> Containerization for deployment.</li>
  <li>
    <strong>Passport.js:</strong> Authentication middleware for handling Google OAuth.
    </li>
  <li><strong>JWT (JSON Web Tokens):</strong> Used for user session management.</li>
</ul>

<h2>🚀 Installation</h2>

<h3>🔹 Clone the Repository</h3>
<pre><code>
$ git clone https://github.com/your-repo/url-shortener.git
$ cd url-shortener
</code></pre>

<h3>🔹 Install Dependencies</h3>
<pre><code>
$ npm install
</code></pre>

<h2>📂 Authentication Module</h2>
<p>
  The Authentication module handles user authentication via Google Sign-In. It generates JWT tokens for session management 
  and securely stores user details in MongoDB.
</p>


<h2>📄 API Endpoints</h2>

<h3>1️⃣ Google OAuth Authentication</h3>
<p><strong>🔹 Endpoint:</strong> <code>GET /auth/google</code></p>
<p><strong>🔹 Description:</strong> Redirects users to Google authentication.</p>
<p><strong>🔹 Response:</strong></p>
<pre><code>
{
  "message": "Redirecting to Google authentication"
}
</code></pre>

<h3>2️⃣ Google OAuth Callback</h3>
<p><strong>🔹 Endpoint:</strong> <code>GET /auth/google/callback</code></p>
<p><strong>🔹 Description:</strong> Handles Google OAuth login and returns a JWT token.</p>
<p><strong>🔹 Response:</strong></p>
<pre><code>
{
  "accessToken": "your-jwt-token",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "profileImage": "https://example.com/profile.jpg"
  }
}
</code></pre>

<br/>

<h2>📂 Short URL Module</h2>

<p>
  The Short URL API allows users to create and manage shortened URLs for easy sharing. It supports custom aliases, categorization, and rate limiting to prevent abuse. Each shortened URL 
  redirects to the original long URL and includes analytics tracking for engagement insights.
</p>


<h2>📄 Create Short URL API</h2>

<h3>🔹 Endpoint</h3>
<p><code>POST /api/shorten</code></p>

<h3>🔹 Description</h3>
<p>
  This endpoint allows users to shorten long URLs. It can optionally accept a custom alias and a topic category.
</p>

<h3>🔹 Request Body</h3>
<pre><code>
{
  "longUrl": "https://example.com/very-long-url",
  "customAlias": "myshortlink",  // (optional)
  "topic": "marketing"           // (optional)
}
</code></pre>

<h3>🔹 Response</h3>
<pre><code>
{
  "shortUrl": "https://short.ly/myshortlink",
  "createdAt": "2025-02-09T12:34:56Z"
}
</code></pre>

<h2>📄 Redirect Short URL API</h2>

<h3>🔹 Endpoint</h3>
<p><code>GET /api/shorten</code></p>

<h3>🔹 Description</h3>
<p>
   This API allows users to resolve short URLs back to their original long URLs while tracking analytics.
</p>

<h3>🔹 Request Body</h3>
<pre><code>
{
  "longUrl": "https://example.com/very-long-url",
  "customAlias": "myshortlink",  // (optional)
  "topic": "marketing"           // (optional)
}
</code></pre>

<h3>🔹 Response</h3>
<pre><code>
{
  "shortUrl": "https://short.ly/myshortlink",
  "createdAt": "2025-02-09T12:34:56Z"
}
</code></pre>

<h3>🔹 Features</h3>
<ul>
  <li>✅ **Redirects users from a short URL to the original long URL**</li>
  <li>✅ **Logs <b>analytics data</b> (timestamp, user agent, IP address, geolocation).**</li>
</ul>


<h2>📂 Analytics URL Module</h2>

<p>
   The Analytics module provides insights into the performance of shortened URLs. It tracks user interactions, including total clicks, unique users, operating system and device type 
   distribution, and engagement trends over time. This module helps users understand the reach and effectiveness of their shortened links through comprehensive analytics.
</p>

<h2>📄 Get URL Analytics API</h2>

<h3>🔹 Endpoint</h3>
<p><code>GET /api/analytics/alias/{alias}</code></p>

<h3>🔹 Description</h3>
<p>
   This endpoint retrieves detailed analytics for a specific short URL, providing insights into its performance, including total clicks and unique audience interactions.
</p>


<h3>🔹 Response</h3>
<pre><code>
{
  "totalClicks": 3,
  "uniqueUsers": 2,
  "clicksByDate": [
    {
      "_id": "2025-02-07",
      "count": 1
    },
    {
      "_id": "2025-02-08",
      "count": 2
    }
  ],
  "osType": [
    {
      "osName": "Linux",
      "uniqueClicks": 1,
      "uniqueUsers": 1
    },
    {
      "osName": "Windows 10.0",
      "uniqueClicks": 2,
      "uniqueUsers": 1
    }
  ],
  "deviceType": [
    {
      "deviceName": "mobile",
      "uniqueClicks": 1,
      "uniqueUsers": 1
    },
    {
      "deviceName": "desktop",
      "uniqueClicks": 2,
      "uniqueUsers": 1
    }
  ]
}
</code></pre>

<h3>🔹 Features</h3>
<ul>
  <li>✅ **Retrieves total clicks and unique users for the short URL.**</li>
  <li>✅ **Provides insights into operating systems and device types used**</li>
</ul>

<h2>📄 Get Topic-Based Analytics API</h2>

<h3>🔹 Endpoint</h3>
<p><code>GET /api/analytics/topic/{topic}</code></p>

<h3>🔹 Description</h3>
<p>
   Retrieves analytics for all shortened URLs categorized under a specified topic. This allows users to track engagement metrics such as total clicks, unique visitors, and activity trends 
   over time.
</p>


<h3>🔹 Response</h3>
<pre><code>
{
    "totalClicks": 2,
    "uniqueUsers": 2,
    "clicksByDate": [
        {
            "_id": "2025-02-08",
            "count": 1
        },
        {
            "_id": "2025-02-09",
            "count": 1
        }
    ],
    "urls": [
        {
            "shortUrl": "http://localhost:5000/api/shorten/custom-alias",
            "totalClicks": 2,
            "uniqueUsers": 2
        }
    ]
}

</code></pre>

<h3>🔹 Features</h3>
<ul>
  <li>✅ **Retrieves total clicks and unique users for all short URLs under a specific topic.**</li>
  <li>✅ **Provides a date-wise breakdown of clicks to analyze trends over time.**</li>
</ul>


<h2>📄 Get Overall Analytics API</h2>

<h3>🔹 Endpoint</h3>
<p><code>GET /api/analytics/overall</code></p>

<h3>🔹 Description</h3>
<p>
   This API retrieves overall analytics for all short URLs created by the authenticated user, offering a comprehensive view of link performance, user engagement, and device distribution.
</p>


<h3>🔹 Response</h3>
<pre><code>
{
    "totalUrls": 4,
    "totalClicks": 13,
    "uniqueUsers": 8,
    "clicksByDate": [
        {
            "_id": "2025-02-06",
            "count": 5
        },
        {
            "_id": "2025-02-07",
            "count": 3
        },
        {
            "_id": "2025-02-08",
            "count": 4
        },
        {
            "_id": "2025-02-09",
            "count": 1
        }
    ],
    "osType": [
        {
            "osName": "Windows 10.0",
            "uniqueClicks": 6,
            "uniqueUsers": 2
        },
        {
            "osName": "Linux",
            "uniqueClicks": 5,
            "uniqueUsers": 5
        },
        {
            "osName": "OS X",
            "uniqueClicks": 1,
            "uniqueUsers": 1
        },
        {
            "osName": "unknown",
            "uniqueClicks": 1,
            "uniqueUsers": 1
        }
    ],
    "deviceType": [
        {
            "deviceName": "desktop",
            "uniqueClicks": 7,
            "uniqueUsers": 3
        },
        {
            "deviceName": "mobile",
            "uniqueClicks": 6,
            "uniqueUsers": 6
        }
    ]
}


</code></pre>

<h3>🔹 Features</h3>
<ul>
  <li>✅ **Retrieves the total number of short URLs created by the user.**</li>
  <li>✅ **Provides total clicks and unique user interactions across all URLs.**</li>
</ul>

<h2>📜 Rate Limiting</h2>
<p>
  To prevent abuse, rate limiting is implemented. A user can create a limited number of short URLs within a given time frame.
</p>

<h3>🔹 Default Limits</h3>
<ul>
  <li>✅ **Max Requests:** 5 per minute per user.</li>
  <li>✅ **Error Response:** If a user exceeds the limit, they receive a 429 status.</li>
</ul>

<h3>🔹 Example Error Response</h3>
<pre><code>
{
  "statusCode": 429,
  "message": "Too many requests. Try again later."
}
</code></pre>

<h2>🛠️ Environment Variables</h2>
<p>Create a <code>.env</code> file and configure:</p>
<pre><code>
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
JWT_SECRET=your-jwt-secret
MONGO_URI=your-mongodb-url
</code></pre>

<h2>💻 Running the Application</h2>
<pre><code>
# Start the server in development mode
$ npm run start:dev
</code></pre>

<h2>🐳 Running with Docker</h2>
<p>If you want to run the application inside a Docker container:</p>
<pre><code>
# Build the Docker image
$ docker build -t url-shortener-api .

# Run the container
$ docker run -p 5000:5000 --env-file .env url-shortener-api

<h2>🧪 Testing the Deployed API</h2>
<p>
  The API is currently deployed on Amazon EC2 and can be accessed at:
  <code>http://your-ip:5000/api/</code>
</p>
</code></pre>

