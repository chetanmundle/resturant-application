import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import FixedButton from "./Fixedbutton";
import { FaShoppingCart } from "react-icons/fa";

import veg from "../images/veg.jpg";
import nonveg from "../images/non-veg.jpg";
import { RiSearchLine } from "react-icons/ri";
import Roundslider from "./Roundslider";

import Cardmenu from "./Cardmenu";


const Homemenu = () => {

  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState();
  const [noFoodFound, setNoFoodFound] = useState(false);

  const [popularFood, setPopularFood] = useState([]);

  const [copyOfFoodData, setCopyOfFoodData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/menu/getallmenus/${JSON.parse(
            localStorage.getItem("restid")
          )}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setFoodData(data); // Assuming the response is an array of menu items
        setPopularFood(data.filter((food) => food.ispopular));
        setCopyOfFoodData(data.filter((food) => food.ispopular));
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    setNoFoodFound(false);

    // Filter food based on search text
    const filteredFood = foodData.filter((food) =>
      food.name.toLowerCase().includes(text.toLowerCase())
    );
    setCopyOfFoodData(filteredFood);

    if (text.trim() === "") {
      setCopyOfFoodData(popularFood);
    } else if (filteredFood.length === 0) {
      setNoFoodFound(true);
    }
  };

  const handlebtnClick = async () => {
    setLoading(true); // Set loading to true before navigation
  };

  return (
    <div className={`firstpage_container `}>
      <div className="homepage_maindiv ">
        <div className="homepage_parent_yellowstatic">
          <div className="bg-yellow-500 py-4 homemenu_staic_div"></div>
        </div>
        <div className="homemenu_menu_div">
          <div className="homemenu_menu ">Menu List</div>
          <div className="homemenu_basket">
            <Link to={"/cart"}>
              <button>
                {/* <SlBasket className="text-black" /> */}

                <FaShoppingCart className="homemenu_karticon" />
              </button>
            </Link>
          </div>
        </div>

        <div className="">
          <div className="homepage_serchdiv">
            <input
              type="text"
              placeholder="Search..."
              className="homepage_input"
              onChange={handleInputChange}
              // onMouseDown={handleInputClick}
              // onMouseUp={handleInputRelease}
              // onMouseOut={handleInputRelease}
            />
            <div className="homepage_serachicon">
              <RiSearchLine className="text-gray-500" />
            </div>
          </div>
        </div>
        {!searchText ? (
          <>
            <div className="homepage_veg_nonveg">
              <Link to={`/vegnonvegfood/${encodeURIComponent("veg")}`}>
                <div
                  className="homepage_veg_div"
                  onClick={() => {
                    // router.push("/vegnonveg/veg");
                  }}
                >
                  {/* <div className="bg-slate-600 mr-2 veg border rounded h-5"></div> */}
                  {/* Image  of veg */}
                  <div>
                    <img src={veg} alt="veg" className="homepage_veg_img" />
                  </div>
                  <div className="homepage_veg_ordernowdiv">
                    <div className="homepage_vegname ">Veg </div>
                    <div className="">Order now</div>
                  </div>
                </div>
              </Link>

              <Link to={`/vegnonvegfood/${encodeURIComponent("nonveg")}`}>
                <div
                  className="homepage_non_veg_div"
                  onClick={() => {
                    // router.push("/vegnonveg/nonveg");
                  }}
                >
                  {/* <div className="bg-slate-600 mr-2 mb-2 n-veg border rounded"></div> */}
                  {/* non veg image  */}
                  <div>
                    {/* <Image src={nonveg} alt="nonVeg" className="homepage_nonveg_img" /> */}
                    <img
                      src={nonveg}
                      alt="nonveg"
                      className="homepage_nonveg_img"
                    />
                  </div>
                  <div className="homepage_veg_ordernowdiv">
                    <div className="homepage_nonvegdiv">Non-Veg </div>
                    <div className="homepage_ordernow">Order now</div>
                  </div>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* horizantal slider of menu page */}
        {!searchText && <Roundslider type={"all"}/>}
      </div>
      <FixedButton currentpage={"home"} />
      {setCopyOfFoodData.length > 0 && (
        <Cardmenu
          copyOfFoodData={copyOfFoodData}
          setCopyOfFoodData={setCopyOfFoodData}
        />
      )}
    </div>
  );
};

export default Homemenu;