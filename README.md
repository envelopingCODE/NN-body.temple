
.header {
    position: fixed; /* Fixed position */
    width: 100%; /* Full width */
    top: 0; /* Stick to the top */
    background: rgba(25, 24, 24, 0.5); /* Semi-transparent white background */
    backdrop-filter: blur(10px); /* Blur effect */
    -webkit-backdrop-filter: blur(10px); /* For Safari */
    border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* Optional: adds a subtle border */
    z-index: 1000; /* Ensure the header is above other content */
    display: flex;
    justify-content: center;
  }

  .header-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    color: rgba(33, 246, 236, 0.642);
    text-shadow: #333333 3px 3px 3px;

}


/* Card hover effect */
.card:hover, .card:active {
    transform: translateY(-6px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    -webkit-filter: blur(0px);filter: blur(0px);

}


#demo {
    text-align: center;
    text-shadow: #333333 3px 4px 2px;
    margin: 10%;
    color: aliceblue;
    font-weight: 800;
}



#arrow {
    scale: 0.11;
    position: absolute;
    margin-top: -13%;
    color: aliceblue;
    margin-right: -40%;
