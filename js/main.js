let restaurants, neighborhoods, cuisines;
var newMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 *
 * TODO need to look and see why no info in drop down?
 */
document.addEventListener("DOMContentLoaded", event => {
  initMap(); // added
  fetchNeighborhoods(neighborhoods);
  fetchCuisines(cuisines);
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById("neighborhoods-select");
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement("option");
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById("cuisines-select");

  cuisines.forEach(cuisine => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

// Initialize Google Map
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
      }
    }
  );
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById("restaurants-list");
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement("li");

  const restaurant_card = document.createElement("div");
  restaurant_card.className = "restaurant_card";
  li.append(restaurant_card);

  const img_box = document.createElement("div");
  img_box.className = "img_box";
  restaurant_card.append(img_box);

  const image = document.createElement("img");
  image.className = "restaurant-img";
  image.alt = restaurant.alt_attribute;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  img_box.append(image);

  const side_box = document.createElement("div");
  side_box.className = "side_box";
  restaurant_card.append(side_box);

  const info_box = document.createElement("div");
  info_box.className = "info_box";
  side_box.append(info_box);

  const name_box = document.createElement("div");
  name_box.className = "name_box";
  info_box.append(name_box);

  const name = document.createElement("h3");
  name.className = "restaurant-name";
  name.innerHTML = restaurant.name;
  name_box.append(name);

  const neighborhood_box = document.createElement("div");
  neighborhood_box.className = "neighborhood_box";
  info_box.append(neighborhood_box);

  const neighborhood = document.createElement("p");
  neighborhood.className = "neighborhood";
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood_box.append(neighborhood);

  const address_box = document.createElement("div");
  address_box.className = "address_box";
  info_box.append(address_box);

  const address = document.createElement("p");
  address.className = "address";
  address.innerHTML = restaurant.address;
  address_box.append(address);

  const butt_box = document.createElement("div");
  butt_box.className = "butt_box";
  side_box.append(butt_box);

  const more = document.createElement("a");
  more.className = "more";
  more.innerHTML = "View Details";
  more.href = DBHelper.urlForRestaurant(restaurant);
  butt_box.append(more);

  return li;
};

addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, "click", () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

if (navigator.serviceWorker) {
  window.addEventListener("load", () => {
    console.log("supported");
    navigator.serviceWorker
      .register("../sw.js")
      .then(reg => console.log("Service Worker: registered"))
      .catch(function(e) {
        console.error(e);
      });
  });
}

btn_left.addEventListener("click", function(e) {
  drawer.classList.toggle("open");
  e.stopPropagation();
});

btn_right.addEventListener("click", function(e) {
  drawer.classList.toggle("open");
  e.stopPropagation();
});
