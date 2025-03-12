import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";


const Profile = () => {
  const [profile, setProfile] = useState({
    email: "",
    username: "",
    orders: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": ` Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            email: data.email,
            username: data.username,
            orders: data.orders,
          });
        } else {
          console.error("Failed to fetch profile:", response.status);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Profile</h1>
        <hr />
        <div className="row my-4">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">User Information</h5>
                <p className="card-text">
                  <strong>
                    <i className="fa fa-envelope"></i> Email:
                  </strong>{" "}
                  {profile.email}
                </p>
                <p className="card-text">
                  <strong>
                    <i className="fa fa-user"></i> Username:
                  </strong>{" "}
                  {profile.username}
                </p>

                <h5 className="card-title mt-4">My Orders</h5>
                <ul className="list-group">
                  {profile.orders.length === 0 && (
                    <li className="list-group-item">No orders yet</li>
                  )}
                  {profile.orders.map((order) => (
                    <li key={order.id} className="list-group-item" style={{ marginBottom: "3rem" }}>
                      <div>
                        <strong>Order #{order.id}</strong>
                        {order.status === "pending" && (
                          <i
                            className="fa fa-clock-o text-warning"
                            style={{ marginLeft: "0.5rem" }}
                          ></i>
                        )}
                      </div>
                      <p className="mb-0">
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p className="mb-0">
                        <strong>Order Date:</strong>{" "}
                        {new Date(order.order_date).toLocaleString()}
                      </p>
                      <p className="mb-0">
                        <strong>Amount:</strong> ${order.amount}
                      </p>
                      <div className="mt-2">
                        <strong>Items:</strong>
                        <ul className="mt-1">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.product.name} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>

                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Profile;