import React, { useEffect, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

import { toast } from "react-toastify";

const Foodtypes = () => {
  const [selectsort, setSelectSort] = useState("");
  const [allbtn, setAllbtn] = useState(true);
  const [vegbtn, setVegbtn] = useState(false);
  const [nonvegbtn, setNonvegbtn] = useState(false);
  const [foodname, setFoodname] = useState([]); //

  // this is the food type
  const { basefoodname, type } = useParams();

  const [filteredFood, setFilteredFood] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [cartload, setCartload] = useState(0);

  // cart item
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const status = 1;
        const response = await fetch(
          `http://localhost:8080/ordermenus/findmenusoftable/${JSON.parse(
            localStorage.getItem("restid")
          )}/${JSON.parse(localStorage.getItem("tableid"))}/${status}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add any additional headers if needed
            },
          }
        );

        if (response.ok) {
          const data = await response.json(); // Await the response.json() to properly get the data

          setCartItem(data);
        } else if (response.status === 404) {
          setCartItem([]);
        } else {
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText
          );
          // Handle error cases here, if needed
        }
      } catch (error) {
        console.error("Error in fetchdata function:", error);
        // Handle any unexpected errors here
      }
    };
    fetchdata();
  }, [cartload]);

  // all item get
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/menu/getmenu/byperticularfood/${JSON.parse(
            localStorage.getItem("restid")
          )}/${basefoodname}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFoodname(data);
        } else {
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        console.log("N/w error ");
      }
    };

    const fetchvegnonvegData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/menu/getmenu/byperticularfood/type/${JSON.parse(
            localStorage.getItem("restid")
          )}/${type}/${basefoodname}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFoodname(data);
        } else {
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        console.log("N/w error ");
      }
    };

    if (type === "all") {
      fetchData();
    } else if (type === "veg" || type === "nonveg") {
      fetchvegnonvegData();
    }
  }, []);

  useEffect(() => {
    if (vegbtn) {
      const filteredList = foodname.filter(
        (food) => food.foodtype === basefoodname && food.isveg === true
      );
      setFilteredFood(filteredList);
      setSelectSort("");
    } else if (nonvegbtn) {
      const filteredList = foodname.filter(
        (food) => food.foodtype === basefoodname && food.isveg === false
      );
      setFilteredFood(filteredList);
      setSelectSort("");
    } else {
      setFilteredFood(
        foodname.filter((food) => food.foodtype === basefoodname)
      );
    }
  }, [foodname]);

  const handallikedislike = (id) => {
    setFoodname((prevFoodname) =>
      prevFoodname.map((item) =>
        item.id === id ? { ...item, islike: !item.islike } : item
      )
    );
  };

  const discountfinder = (price, discount) => {
    const d = 100 - discount;
    return (price * d) / 100;
  };

  const handalSortChange = (event) => {
    const sortvalue = event.target.value;
    setSelectSort(sortvalue);

    if (sortvalue === "LowToHigh") {
      const sortedLowToHigh = filteredFood.slice().sort((a, b) => {
        const discountedPriceA =
          a.discount > 0 ? discountfinder(a.price, a.discount) : a.price;
        const discountedPriceB =
          b.discount > 0 ? discountfinder(b.price, b.discount) : b.price;
        return discountedPriceA - discountedPriceB;
      });
      setFilteredFood(sortedLowToHigh);
    } else if (sortvalue === "HightToLow") {
      const sortedHighToLow = filteredFood.slice().sort((a, b) => {
        const discountedPriceA =
          a.discount > 0 ? discountfinder(a.price, a.discount) : a.price;
        const discountedPriceB =
          b.discount > 0 ? discountfinder(b.price, b.discount) : b.price;
        return discountedPriceB - discountedPriceA;
      });
      setFilteredFood(sortedHighToLow);
    }
  };

  const handalAllbtn = () => {
    const filteredList = foodname.filter(
      (food) => food.foodtype === basefoodname
    );
    setFilteredFood(filteredList);
    setAllbtn(true);
    setVegbtn(false);
    setNonvegbtn(false);
    setSelectSort("");
  };

  const handalVegbtn = () => {
    setAllbtn(false);
    setVegbtn(true);
    setNonvegbtn(false);
    const filteredList = foodname.filter(
      (food) => food.foodtype === basefoodname && food.isveg === true
    );
    setFilteredFood(filteredList);
    setSelectSort("");
  };
  const handalNonVegbtn = () => {
    setAllbtn(false);
    setVegbtn(false);
    setNonvegbtn(true);
    const filteredList = foodname.filter(
      (food) => food.foodtype === basefoodname && food.isveg === false
    );
    setFilteredFood(filteredList);
    setSelectSort("");
  };

  const addToCart = async (itemid) => {
    try {
      // adding in cart with restid, tableid and menuid
      const response = await fetch(
        `http://localhost:8080/ordermenus/addtocart/${JSON.parse(
          localStorage.getItem("restid")
        )}/${JSON.parse(localStorage.getItem("tableid"))}/${itemid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          // You can include a request body if your server expects data
          // body: JSON.stringify({ key: 'value' }),
        }
      );

      if (response.ok) {
        setCartload(cartload + 1);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error in fetching data :", error);
    }
  };

  return (
    <div className="">
      <div className="nameoffood_headerdiv">{basefoodname.toUpperCase()}</div>
      <div className="nameoffood_sortbutton">
        {type === "all" ? (
          allbtn ? (
            <button className="nameoffood_all_btn_true" onClick={handalAllbtn}>
              All
            </button>
          ) : (
            <button className="nameoffood_all_btn_false" onClick={handalAllbtn}>
              All
            </button>
          )
        ) : null}

        {/* veg btn */}
        {type === "all" ? (
          vegbtn ? (
            <button className="nameoffood_all_btn_true" onClick={handalVegbtn}>
              Veg
            </button>
          ) : (
            <button className="nameoffood_all_btn_false" onClick={handalVegbtn}>
              Veg
            </button>
          )
        ) : null}

        {/* non veg btn sort */}
        {type === "all" ? (
          nonvegbtn ? (
            <button
              className="nameoffood_all_btn_true"
              onClick={handalNonVegbtn}
            >
              Non-Veg
            </button>
          ) : (
            <button
              className="nameoffood_all_btn_false"
              onClick={handalNonVegbtn}
            >
              Non-Veg
            </button>
          )
        ) : null}

        <select
          value={selectsort}
          className="text-black nameoffood_sortselect_btn"
          onChange={handalSortChange}
        >
          <option value="">Sort By Price</option>
          <option value="LowToHigh">LowToHigh</option>
          <option value="HightToLow">HightToLow</option>
        </select>
      </div>
      {filteredFood.map((item) => (
        <div key={item.id}>
          {/* main card */}
          <div className="cardmenu_indexdiv">
            <div className="cardmenu_topdiv ">
              <div className="cardmenu_imgtopdiv1">
                <Link to={`/fooddetails/${encodeURIComponent(item.id)}`}>
                  <div className="cardmenu_imgtopdiv">
                    <div className=" ">
                      <img
                        src={`data:image/png;base64,${item.foodimg}`}
                        className="cardmenu_image"
                        alt="food image"
                      />
                      {/* <img
                        src={item.image}
                        className="cardmenu_image"
                        alt="food image"
                      /> */}
                    </div>
                    <div className="cardmenu_itemnamediv">{item.name}</div>
                  </div>
                </Link>
              </div>

              <div className="cardmenu_hearddiv_top ">
                <div className="cardmenu_hearddiv">
                  <IoIosHeart
                    style={{ color: item.islike ? "red" : "gray" }}
                    onClick={() => handallikedislike(item.id)}
                  />
                </div>
                <div className="text-right">
                  <div className="cardmenu-text-black-color">
                    {cartItem.some((cartItem) => cartItem.id === item.id) ? (
                      // If item is in the cart, show a link to the cart
                      <Link to="/cart">
                        <button className="cardmenu_addcart_btn">
                          Go to Cart
                        </button>
                      </Link>
                    ) : (
                      // If item is not in the cart, show the "Add Cart" button
                      <button
                        className="cardmenu_addcart_btn"
                        onClick={() => {
                          // restdata.addToCart(item.id);
                          // toast.success(item.name + " Added to cart", {
                          //   className: "custom-toast",
                          // });
                          if (addToCart(item.id)) {
                            toast.success(item.name + " Added to cart", {
                              className: "custom-toast",
                            });
                          }
                        }}
                      >
                        Add Cart
                      </button>
                    )}
                    {/* <button className="cardmenu_addcart_btn">Add Cart</button> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-slate-400 d" >
              <div className="d1">d</div>
             
              <div className="">d</div>
            </div> */}
            {/* extra info like discount */}

            <Link to={`/fooddetails/${encodeURIComponent(item.id)}`}>
              <div className="cardmenu_discountdiv ">
                {item.discount > 0 ? (
                  <>
                    <span className="cardmenu_discount">
                      {item.discount}% OFF
                    </span>
                    &nbsp;&nbsp;
                    <span className="cardmenu_crossprice">{item.price}</span>
                    &nbsp;&nbsp;
                    <span className="cardmenu_rupeesprice font-bold">
                      <FaRupeeSign className="mr-1 f " />
                      {discountfinder(item.price, item.discount)}
                    </span>
                  </>
                ) : (
                  <span className=" cardmenu_rupeesprice font-bold">
                    <FaRupeeSign className="mr-1 " />
                    {item.price}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Foodtypes;