import "./App.css";
import { Container, Typography } from "@mui/material";
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


moment.locale("en");

let cancelAxios= null;
function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en");
  const [time, setTime] = useState(moment().format('MMMM Do YYYY, h:mm a'));
  const [direction, setDirection] = useState("ltr");
  const [city, setCity] = useState("");
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [temp, setTemp] = useState({
    temp: 0,
    description: "",
    minTemp: 0,
    maxTemp: 0,
    city: "",
    icon: null,
  });

  useEffect(() => {
    changeLanguage();
    setTime(moment().format('Do MMMM YYYY, h:mm a'));
    setDirection(lang === "en" ? "ltr" : "rtl");
  }, []);

  const fetchLocationAndWeather = async () => {
    try {
      // Fetch location first
      const locationResponse = await fetch("http://ip-api.com/json");
      const locationData = await locationResponse.json();
      const latitude = locationData.lat;
      const longitude = locationData.lon;
      setLocation({ latitude, longitude });

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7e36852739ab69ed8f1b4b9bfb8358a2`
      );
      const tempValue = Math.round(weatherResponse.data.main.temp - 272.15);
      setTemp({
        temp: tempValue,
        description: weatherResponse.data.weather[0].description,
        minTemp: Math.round(weatherResponse.data.main.temp_min - 272.15),
        maxTemp: Math.round(weatherResponse.data.main.temp_max - 272.15),
        city: weatherResponse.data.name,
        icon: weatherResponse.data.weather[0].icon,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
   fetchLocationAndWeather();
  }, []);
  function changeLanguage() {
    if(lang === "ar")
    {
      i18n.changeLanguage("ar");
      moment.locale("ar");
    }
    else
    {
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setLang(lang === "en" ? "ar" : "en");
    setTime(moment().format('Do MMMM YYYY, h:mm a'));
    setDirection(lang === "en" ? "ltr" : "rtl");
  }
  function findCity() {
    const apiKey = "MAV3/YkuFOSWEBvO24833w==PgDmsCDg1vUbUZRa";
    const weatherApiKey = "7e36852739ab69ed8f1b4b9bfb8358a2";
    const cityName = t(city);
  
    axios.get(`https://api.api-ninjas.com/v1/city?name=${cityName}`, {
      headers: { 'X-Api-Key': apiKey }
    })
    .then(response => {
      if (!response.data.length) setOpen(true);
      const { latitude: lat, longitude: lon } = response.data[0];
    
      return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`);
    })
    .then(response => {
      const { temp, temp_min, temp_max } = response.data.main;
      setTemp({
        temp: Math.round(temp - 272.15),
        description: response.data.weather[0].description,
        minTemp: Math.round(temp_min - 272.15),
        maxTemp: Math.round(temp_max - 272.15),
        city: response.data.name,
        icon: response.data.weather[0].icon
      });
    })
    .catch(error => console.error("Error fetching data:", error.message));
  }


  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <>
{/*Dialog*/}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            City not found, please try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
  
{/*Dialog*/}
    <div>  
      <Container maxWidth="sm" style={{ padding: "20px" }}>
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/*Header*/}
          <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Typography variant="h2" style={{color: "white", fontWeight: "bold"}}>
              {t("Weather App")}
            </Typography>
            {/*Search*/}
            <div dir={direction} style={{display: "flex", justifyContent: "center", alignItems: "center", width: "80%"}}>
            <TextField value={city} onChange={(e) => setCity(e.target.value)} color="primary" id="outlined-basic" label={t("Search city")} variant="outlined" style={{margin: "20px",width: "100%"}}/>
            <Button disabled={city === ""} variant="contained" color="primary" style={{margin: "20px", height: "50px"}} onClick={() => findCity()}>
              {t("Search")}
            </Button>
            </div>
            {/*Search*/}
          </div>
          {/*Header*/}
          {/*Card*/}
          <div 
          dir={direction}
            style={{
              width: "100%",
              backgroundColor: "rgba(214, 213, 213, 0.52)",
              padding: "20px",
              color: "white",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            {/*Content*/}
            <div>
              {/*City And Time*/}
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "end",
                }}
              >
                <Typography variant="h2">
                  {t(temp.city)}
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{margin: "10px 20px"}}
                >
                  {time}
                </Typography>
              </div>
              {/*City And Time*/}
              <hr />
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              {/*degree And description*/}
              <div>
                {/*degree*/}
                <div style={{display: "flex", alignItems: "center"}}>
                  <Typography
                    variant="h1"
                    style={{ textAlign: "left" }}
                  >
                   {temp.temp}
                  </Typography>
                  <img src={`https://openweathermap.org/img/wn/${temp.icon}.png`} alt="" />
                </div>
                {/*degree*/}
                <Typography
                    variant="h6"
                    style={{ textAlign: direction === "ltr" ? "left" : "right" }}
                  >
                   {t(temp.description)}
                  </Typography>
                  {/*Min temp & max temp*/}
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <Typography
                    variant="h6"
                    style={{ textAlign: "left" }}
                  >
                   {t("Min")} {temp.minTemp}
                  </Typography>
                  <h6 style={{ margin: "0 10px" }}>|</h6>
                  <Typography
                    variant="h6"
                    style={{ textAlign: "left" }}
                  >
                   {t("Max")} {temp.maxTemp}
                  </Typography>
                  </div>

              </div>
              {/*degree And description*/}
              <CloudIcon style={{ fontSize: "200px", color: "white" }}/>
              </div>
              {/*Content*/}
            </div>
            {/*Content*/}
          </div>
          {/*Card*/}
          <div dir={direction} style={{width: "100%", display: "flex", justifyContent: "end"}}>
          <Button variant="text" style={{ color: "white",marginTop: "20px" }} onClick={() => changeLanguage()}>{lang === "ar" ? "Arabic" : "انجليزي"}</Button>
          </div>
        </div>
      </Container>
    </div>
    </>
  );
}

export default App;
