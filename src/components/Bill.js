import React, { useContext, useEffect, useState } from "react";

import FixedButton from "./Fixedbutton";
import { Link, useNavigate } from "react-router-dom";
import restContext from "../context/restaurant/restContext";
import Swal from "sweetalert2";

const Bill = () => {
  const restdata = useContext(restContext);
  const [cartItems, setCartItems] = useState([]);
  const [updateEffect, setUpdateEffect] = useState(false);
  const [totalBill, setTotalBill] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const status = 1;
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8080/ordermenus/findmenusoftable/${JSON.parse(
          localStorage.getItem("restid")
        )}/${JSON.parse(localStorage.getItem("tableid"))}/${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else if (response.status === 404) {
        setCartItems([]);
        console.log("Data not found");
      } else {
        console.log("Unable to fetch the data from the database");
      }
    };

    const fetchTotalBill = async () => {
      const response = await fetch(
        `http://localhost:8080/ordermenus/getfinalprice/${JSON.parse(
          localStorage.getItem("restid")
        )}/${JSON.parse(localStorage.getItem("tableid"))}/${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTotalBill(data);
      }
    };
    fetchData();
    fetchTotalBill();
  }, [updateEffect]);

  const onorderclick = () => {
    const changeData = async () => {
      const response = await fetch(
        `http://localhost:8080/ordermenus/status/changestatustotwor/${JSON.parse(
          localStorage.getItem("restid")
        )}/${JSON.parse(localStorage.getItem("tableid"))}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Order Placed..!",
          showConfirmButton: false,
          timer: 2000
        });
        navigate("/order");
      } else {
        alert("something went wrong..! Unable to order");
      }
    };

    changeData();
  };

  return (
    <div className="text-white">
      <div className="bill_seconddiv">
        <div>
          {/* <button
            className="mx-3"
            // onClick={() => {
            //   router.push("");
            // }}
          >
            <FaArrowLeft />
          </button> */}
        </div>

        <div className="bill_yourbilldiv">Your Bill</div>
      </div>

      {/* first card */}
      <div className="bill_firstdiv">
        {/* second card */}
        <div className="bill_secondcartdiv ">
          <div className="bill_secondcartfirstdiv">
            <div className="bill_paymentinvoice">Payment Invoice</div>

            <div>
              <hr className="bill_hr" />
            </div>
            <div className="bill_namerateimgdiv">
              {/* <div className="bill_imgdiv"></div> */}
              <div className="bill_foodname">Name</div>
              <div className="bill_foodqt">Qty</div>
              {/* <div className="bill_foodrate">{item.discountedPrice * item.quantity}</div>  */}
              <div className="bill_foodrate">Rs</div>
            </div>
            {cartItems.map((item, index) => (
              <div key={item.id} className="bill_namerateimgdiv">
                {/* <div className="bill_imgdiv">
                  <img
                    src={`data:image/png;base64,${item.foodimg}`}
                    alt={item.name}
                    className="bill_img"
                  />
                 
                </div> */}
                <div className="bill_foodname">{item.name}</div>
                <div className="bill_foodqt">{item.quantity}</div>
                {/* <div className="bill_foodrate">{item.discountedPrice * item.quantity}</div>  */}
                <div className="bill_foodrate">{item.totalprice}</div>
              </div>
            ))}
            <hr className="bill_secondhr" />
            <div className="bill_totalbilldiv">
              <div className="bill_totaldiv">Total</div>
              <div className="bill_totaldiv">{totalBill}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="bill_paybuttondiv">
            {/* <button className="bill_orderjowbtn">Order Now</button> */}
            <Link to={"/homemenu"}>
              <button className="bill_orderjowbtn">Add More</button>
            </Link>
            {/* <Link to={"/order"}>
              <button className="bill_orderjowbtn">Order</button>
            </Link> */}
            <button className="bill_orderjowbtn" onClick={onorderclick}>
              Order
            </button>
          </div>
        </div>
      </div>
      <FixedButton currentpage={"bill"} />
    </div>
  );
};

export default Bill;