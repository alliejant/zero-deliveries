import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import deliveriesData from "./Misc/data.json";
import { ReactComponent as Car } from "./Misc/car.svg";
import Modal from "./Modal";
import "./Map.css";
const API_KEY = process.env.REACT_APP_API_KEY;

function Map() {
  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [modalDriverID, setModalDriverID] = useState(-1);

  // Fetch new locations of drivers every 10 seconds (current data is static, but if it were to change)
  useEffect(() => {
    const { data } = deliveriesData;
    setData(data);
    const timer = setInterval(() => {
      const { data } = deliveriesData;
      setData(data);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Create markers when data or modalDriverID changes
  useEffect(() => {
    const markers = createMarkers(data);
    setMarkers(markers);
    // eslint-disable-next-line
  }, [data, modalDriverID]);

  function createMarkers(data) {
    let offsetErrorCar = 0;
    return data.map(driver => {
      let { driverID, currentLocation, driverName } = driver;
      let carColor = "black";

      // if there is no location data for driver set car to left with red car color
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        currentLocation = { lat: 37.6 + offsetErrorCar, lng: -122.7 };
        carColor = "red";
        offsetErrorCar += 0.05;
      }

      return (
        <div key={driverID} lat={currentLocation.lat} lng={currentLocation.lng}>
          <Modal
            isDisplayed={driverID === modalDriverID ? "block" : "none"}
            header={`Driver: ${driverName}`}
            body={createModalBody(driver)}
            onClose={() => setModalDriverID(-1)}
          />
          <Car
            className="Car"
            style={{ height: "25px", width: "25px", color: carColor }}
            onClick={() => setModalDriverID(driverID)}
          />
        </div>
      );
    });
  }

  function createModalBody(driver) {
    const { deliveries } = driver;
    if (!deliveries || !Array.isArray(deliveries)) return <p> No deliveries</p>;

    // This is considering deliveries are marked off as 'done' in chronological order, otherwise would need to make use further logic to recreate route
    let nextDeliveryIndex = deliveries.findIndex(
      delivery => delivery.done === false
    );

    // There may be no deliveries assigned or all deliveries have been completed
    if (nextDeliveryIndex === -1)
      nextDeliveryIndex = deliveries.length > 0 ? deliveries.length : 0;
    return (
      <div>
        <p>Deliveries done: {nextDeliveryIndex}</p>
        <p>Deliveries left: {deliveries.length - nextDeliveryIndex}</p>
        <p>
          Next stop:{" "}
          {deliveries[nextDeliveryIndex] &&
          deliveries[nextDeliveryIndex].address
            ? deliveries[nextDeliveryIndex].address
            : "None"}
        </p>
      </div>
    );
  }

  return (
    <div className="Map">
      <h3>All drivers:</h3>
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: API_KEY,
            language: "en"
          }}
          defaultCenter={{ lat: 37.6, lng: -122.2 }}
          defaultZoom={9.5}
        >
          {markers}
        </GoogleMapReact>
      </div>
    </div>
  );
}

export default Map;
