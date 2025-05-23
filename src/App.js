import "./App.css";
import { Container, Typography } from "@mui/material";
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from 'react-i18next';
moment.locale("en");

let cancelAxios= null;
function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en");
  const [time, setTime] = useState(moment().format('MMMM Do YYYY, h:mm a'));
  const [direction, setDirection] = useState("ltr");
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
  useEffect(() => {
    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=25.276987&lon=55.296249&appid=7e36852739ab69ed8f1b4b9bfb8358a2",
      {
        cancelToken: new axios.CancelToken((c)=>
        {
          cancelAxios = c;
        }
        )
      }
    )
      .then((response) => {
        console.log(response.data);
        const temp = Math.round(response.data.main.temp - 272.15);
        setTemp({
          temp: temp,
          description: response.data.weather[0].description,
          minTemp: Math.round(response.data.main.temp_min - 272.15),
          maxTemp: Math.round(response.data.main.temp_max - 272.15),
          city: response.data.name,
          icon: response.data.weather[0].icon,
        });
      })
      .catch((error) => {
        console.error(error);
      });
      return () => {
        cancelAxios();
      };
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
  return (
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
  );
}

export default App;
