
//main function taking cityId and the element on the html as parameters
function weather( cityId, el ) {

  const container = document.getElementById(el);
  const forecast = document.getElementById('forecast');
  const list = document.getElementById('locations');
  let t;

//event binding function for typing in search items
  function setupEventBindings() {
    let search = document.getElementById('search');
    search.addEventListener('keyup', function(e){
      e.preventDefault();
      clearTimeout(t);
      t = setTimeout( getLocations( this.value ), 200 );
    })
  }

  function clearLocations() {
    list.innerHTML = '';
  }

//function to build the weather query based upon cityId
  function buildWeatherQuery( cityId ) {
    const base_url = 'http://query.yahooapis.com/v1/public/yql';
    const query = encodeURIComponent(`select * from weather.forecast where woeid=${cityId} AND u="f"`);
    const query_url = `${base_url}?q=${query}&format=json`;
    return query_url;
  }

//function to build locations query
  function buildLocationQuery( searchTerm ){
    let now = new Date();
    let base_url = 'http://query.yahooapis.com/v1/public/yql';
    let query = encodeURIComponent(`select * from geo.places where text="${searchTerm}"`);
    let apiQuery = base_url + '?q='+ query +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json';
    return apiQuery;
  }

//function to get the locations based upon the typed in search
  function getLocations( searchTerm ){
    let query = buildLocationQuery( searchTerm );
    // send request to Yahoo
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', query, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == '200') {
        // console.log('data', xhr.responseText);
        showLocations(xhr.responseText);
      }
    };
    xhr.send();
  }

//function to show list of locations based upon typed in search items
  function showLocations(data){
    let locations = JSON.parse(data);
    list.innerHTML = '';
    if (locations.query.results !== null) {
      let places = locations.query.results.place;
      if( Array.isArray(places)) {
        places.forEach( item => {
          let country = (item.country.content) ? item.country.content : '';
          let name = item.name;
          let admin = (item.admin1) ? item.admin1.content +', ' : '';
          let woeid = item.woeid;
          let link = document.createElement('a');
          link.href = woeid;
          link.innerHTML = `${name}, ${admin}${country}</br>`;
          link.addEventListener('click', function(e){
            e.preventDefault();
            getWeatherData( woeid );
          })
          list.appendChild(link);
        })
      }
    }
    console.log(locations);
  }

//function to get the weather data based upon city id
  function getWeatherData( cityId ) {
    let query = buildWeatherQuery( cityId );
    // send request to Yahoo
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', query, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == '200') {
        render(xhr.responseText);
      }
    };
    xhr.send();
  }

//this function renders the weather data on the grids on html
  function render(weatherData){
    const weather = JSON.parse(weatherData);
    const iconsData = icons;
    const forecastData = weather.query.results.channel.item.forecast;
    const description = weather.query.results.channel.item.description;
    const condition = weather.query.results.channel.item.condition;
    const location = weather.query.results.channel.location;
    const astronomy = weather.query.results.channel.astronomy;

    const result = iconsData['codes'].filter(function(item){
      return item.number == condition.code;
    });

    container.innerHTML = `<h2 align="center">${location.city}, ${location.region}</h2>`

    // current weather
    let today = document.createElement('div');
    today.classList.add('block', 'today');

    let desc = `${result[0].description}` ;
    //different animations based upon the weather forecast
    var forecastToday = `<i class="wi ${result[0].class}"></i>
        <div class="weather type-small">

          <h3>Today</h3>
          <p>Currently ${condition.temp} &deg;C., and ${result[0].description}</p>
          <p>
            Sunrise: ${astronomy.sunrise} <br>
            Sunset: ${astronomy.sunset}
          </p>
        </div>
    `  ;

    console.log(desc);
    if(desc.includes('cloudy'))
     {
        today.innerHTML = `${forecastToday}
            <div class="wrapper">
            <div class="sun"></div>
            <div class="cloud">
                    <div class="cloud1">
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
                    <div class="cloud1 c_shadow">
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
            </div>
            <div class="cloud_s">
                    <div class="cloud1">
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
                    <div class="cloud1 c_shadow">
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
            </div>
            <div class="cloud_vs">
                    <div class="cloud1">
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
                    <div class="cloud1 c_shadow">
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
                    </div>
            </div>`
          ;
     }
      else if(desc.includes('sun') )
     {
       today.innerHTML = `<${forecastToday}
           <div class="wrapper">
           <div class="sun"></div>
           </div>` ;
     }
     else if(desc.includes('sleet'))
     {
       today.innerHTML = `${forecastToday}
           <div class="wrapper">
           <div class="cloud">
             <div class="cloud1">
             <span class="invisible">
               <ul>
                 <li ></li>
                 <li ></li>
                 <li ></li>
                 <li ></li>
               </ul>
               </span>
             </div>
             <div class="cloud1 c_shadow">
               <span class="invisible">
               <ul >
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
           </div>

           <div class="cloud_s">
             <div class="cloud1">
               <span class="invisible">
               <ul >
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
             <div class="cloud1 c_shadow">
               <span class="invisible">
               <ul class="invisible">
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
           </div>

           <div class="cloud_vs">
             <div class="cloud1">
               <span class="invisible">
               <ul>
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
             <div class="cloud1 c_shadow">
               <span class="invisible">
               <ul>
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
           </div>
           <div class="sleet">
             <span class="invisible">
              <ul>
                <li></li>
                <li></li>
                <li></li>
             </ul>
             </span>
           </div>
          </div>` ;
     }
     else if(desc.includes('thunder'))
     {
       today.innerHTML = `${forecastToday}
           <div class="wrapper">
           <div class="cloud">
             <div class="cloud1">
             <span class="invisible">
               <ul>
                 <li ></li>
                 <li ></li>
                 <li ></li>
                 <li ></li>
               </ul>
               </span>
             </div>
             <div class="cloud1 c_shadow">
               <span class="invisible">
               <ul >
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
           </div>

           <div class="cloud_s">
             <div class="cloud1">
               <span class="invisible">
               <ul >
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
             <div class="cloud1 c_shadow">
               <span class="invisible">
               <ul class="invisible">
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
           </div>

           <div class="cloud_vs">
             <div class="cloud1">
               <span class="invisible">
               <ul>
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
             <div class="cloud1 c_shadow">
               <span class="invisible">
               <ul>
                 <li></li>
                 <li></li>
                 <li></li>
                 <li></li>
               </ul>
               </span>
             </div>
           </div>
           <div class="sleet">
             <span class="invisible">
              <ul>
                <li></li>
                <li></li>
                <li></li>
             </ul>
             </span>
           </div>
          </div>` ;
     }
     else if(desc.includes('snow'))
     {
       today.innerHTML = `${forecastToday}
           <div class="wrapper">
           <div class="cloud">
                   <div class="cloud1">
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>
                   </div>
                   <div class="cloud1 c_shadow">
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>
                   </div>
           </div>
           <div class="cloud_s">
                   <div class="cloud1">
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>
                   </div>
                   <div class="cloud1 c_shadow">
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>
                   </div>
           </div>
           <div class="cloud_vs">
                   <div class="cloud1">
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>
                   </div>
                   <div class="cloud1 c_shadow">
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>
                   </div>
                   </div>
           </div>
           <div>
           <div class="sleet">
            <ul>
              <li></li>
              <li></li>
              <li></li>
           </ul>
          </div>
          `
         ;
     }
     else if(desc.includes('wind'))
     {
       today.innerHTML = `${forecastToday}
       <div class="wrapper">
       <div class="haze"></div>
        <div class="haze_stripe"></div>
        <div class="haze_stripe"></div>
        <div class="haze_stripe"></div>
        </div> `;
     }


    container.append(today);

    // clear forecast data
    forecast.innerHTML = '';

    // forecast
    forecastData.forEach( (day) => {
      let iconclass = iconsData['codes'].filter(function(item){
        return item.number == day.code;
      });
      let newDay = document.createElement('div');
      newDay.classList.add('block');
      newDay.innerHTML = `<div class="weather type-small">
        <i class="wi ${iconclass[0].class}"></i>
        <h4>${day.day}, ${day.date}</h4>
        <p>${day.text}</p>
        <ul>
          <li>High: ${day.high} &deg;F.</li>
          <li>Low: ${day.low} &deg;F.</li>
        </ul>
        </div>
      </div>`;
      forecast.append(newDay);
    });
  }

  // initialize
  setupEventBindings();
  // start with default city it
  getWeatherData( cityId );
}
