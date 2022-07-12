let weeklyForecast = document.querySelector('.weekly-forecast')
let inputBoxEl = document.getElementById('input-box')
let searchIconEl = document.querySelector('.search-icon')
let cityEl = document.querySelector('.city')
let dateEl = document.querySelector('.date')
let tempEl = document.querySelector('.temp')
let weatherEl = document.querySelector('.weather')
let maxTempEl = document.querySelector('.max-num')
let minTempEl = document.querySelector('.min-num')
let windspeedEl = document.querySelector('.wind-speed')
let pressureEl = document.querySelector('.pressure-rate')
let humidityEl = document.querySelector('.humidity-level')
let sunRiseEl = document.querySelector('.sunrise-time')
let sunsetEl = document.querySelector('.sunset-time')
let body = document.getElementById('body');

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'd1e9f32a82msh36fcb87c958852dp16acbdjsnfb3b108d5675',
		'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com'
	}
};

const weeks = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const api = (userCity) =>{
    let url = fetch(`https://community-open-weather-map.p.rapidapi.com/forecast/daily?q=${userCity}&cnt=10&units=imperial%20`, options)
	url.then(response => response.json())
	.then(response => {
        
        //Getting weekly forecast and calling the function that process this concept:--
        const weeklyForecast = response.list
        weeklyForecast.forEach((day)=>{
            const days = new Date(day.dt * 1000)
            const weekday = days.getDay()
            
            const icon = day.weather[0].icon
            const description = day.weather[0].description


            weekName(weeks[weekday],icon,description)
        })

        //Getting city name and country name and calling the function assign to this:--
        cityName(response.city.name,response.city.country)

        //Getting current temp and calling the function and assign it to function:-
        currenttemp(response.list[0].temp.day)

        //Getting current weather and calling the function asign to it:-
        currentWeather(response.list[0].weather[0].main)

        //Getting max and min temp and assigning it to the fn:-
        maxminTemp(response.list[0].temp.max,response.list[0].temp.min)

        //Getting WPH(Wind, Pressure, Humidity) and aasing it to fn:-
        wphRates(response.list[0].speed,response.list[0].pressure,response.list[0].humidity)

        //Getting sunrise and set time and handling it through function:-
        riseSet(response.list[0].sunrise,response.list[0].sunset)

    })
	.catch(err =>{
        console.log(err)
        alert('☹️City not Found!')
    })
}

const weekName = (weeknames,icon,description) =>{
    const neWEl = document.createElement('div')
    const headingEl = document.createElement('h4')
    const iconEl = document.createElement('img')
    const smallheadingEl = document.createElement('h5')


    //Adding class to the created Div:-
    neWEl.classList.add('week')

    //Assining all the elements to the DOM:-
    headingEl.innerText = weeknames.toUpperCase()
    iconEl.setAttribute('src',`https://openweathermap.org/img/wn/${icon}@2x.png`)
    smallheadingEl.innerText = description

    //Appending elements:-
    weeklyForecast.append(neWEl)
    neWEl.append(headingEl)
    headingEl.append(iconEl)
    neWEl.append(smallheadingEl)

}

//event listener on the search icon click:--(THROUGH MOUSE)
searchIconEl.addEventListener('click',function(){
    weeklyForecast.innerHTML = ''
   let userCity = inputBoxEl.value
   api(userCity)
})

//event listener on the search on keyboard event:--
inputBoxEl.addEventListener('keyup',function(event){
    if(event.key == 'Enter'){
        weeklyForecast.innerHTML = ''
        userCity = inputBoxEl.value
        api(userCity)
    }
 })

 //DOM Manipulations:--
const cityName = (city,country) =>{
    cityEl.innerText = `${city}, ${country}`
}

const todayDate = () =>{
    const date = new Date()
    let day = date.getDay()
    let dayName = weeks[day]
    let dateNum = date.getDate()
    let month = date.getMonth()
    let monthName = months[month]
    let year = date.getFullYear()
    
    dateEl.innerText = `${dayName}, ${dateNum} ${monthName} ${year}`
}
todayDate()

const currenttemp = (tempval) =>{
    var kelviToFah = (tempval - 273.15) * (9/5) + 32 
    tempEl.innerText = `${Math.floor(kelviToFah)} °`   
}

const currentWeather = (weatherval) =>{
    weatherEl.innerText = weatherval
}

const maxminTemp = (max,min) =>{
     let maxKtoF = (max - 273.15) * (9/5) + 32 
     let minKtoF = (min - 273.15) * (9/5) + 32 

     maxTempEl.innerText = `${Math.floor(maxKtoF)}°`
     minTempEl.innerText = `${Math.floor(minKtoF)}°`

}

const wphRates = (wind,pressure,humidity) => {
    windspeedEl.innerText = wind.toFixed(2)

    let pressureRate = Math.round(pressure/33.864)
    pressureEl.innerText = pressureRate

    humidityEl.innerText = humidity
}

const riseSet = (rise,set) =>{
        const riseTime = new Date(rise * 1000)
        let risehours = riseTime.getHours()
        let riseminutes = riseTime.getMinutes()
        sunRiseEl.innerText = `${risehours} : ${riseminutes}`
        const setTime = new Date(set * 1000)
        let sethours = setTime.getHours()
        let setminutes = setTime.getMinutes()
        sunsetEl.innerText = `${sethours} : ${setminutes}`

        const time = new Date()
        let recentTime = time.getHours()

        if(recentTime >= sethours && recentTime < risehours){
            body.classList.add('night')
        }
        else{
            body.classList.remove('night')
        }    
}
