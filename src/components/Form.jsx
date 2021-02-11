import { React, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card, Button, FormControl } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from 'moment';
import axios from "axios";

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ImageUploader from 'react-images-upload';
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';

import { API_URL } from "../constant";

const useStyles = makeStyles(() => ({
  card: {
    margin: '2% 10%',
    padding: '5% 10%',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  formControl: {
    marginBottom: '30px',
  },
  appointmentControl: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    width: '300px',
  },
  imageUploader: {
    width: '300px',
  },
  button: {
    marginTop: '30px',
  },
  scheduler: {
    width: '300px',
  },
}));

// name, date of birth, phone number, email, address, photo (driver license), and appointment time to register
export default function Form() {
  const classes = useStyles();
  const emailValidator = require("email-validator");
  const currentDate = '2021-02-10';

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [appointments, setAppointments] = useState([
    { title: 'Team meeting', startDate: '2021-02-10T08:30', endDate: '2021-02-10T09:00' },
    { title: 'Interview with new doctor', startDate: '2021-02-10T11:30', endDate: '2021-02-10T12:30'},
  ]);
  
  const handleDateChange = (birthDate) => {
    setBirthDate(birthDate);
    console.log(birthDate);
  };

  const uploadPhotos = (photo) => {
    setPhotos(photos.concat(photo));
  }

  const addAppointment = () => {
    const appointmentTitle = name + "'s appointment";
    const start = currentDate + 'T' + startTime;
    const end = currentDate + 'T' + endTime;
    setAppointments(appointments.concat({title: appointmentTitle, startDate: start, endDate: end}));
  }

  const handleSubmit = () => {
    if (!emailValidator.validate(email))
      alert("The email formatt is incorrect!");
    else {
      const patientInfo = {
        name: name,
        birthDate: moment.utc(birthDate).format('YYYY/MM/DD'),
        phone: phone,
        email: email,
        // photo: photos[0],
        startTime: startTime,
        endTime: endTime,
      }
      console.log(patientInfo);
      axios.post(API_URL, patientInfo).then((res) => {
        alert("Submit successfully!");
        console.log(res.data);
      }).catch((err) => {
        alert("Submit failed!");
        console.log(err);
      })
    }
  }


  return (
    <Card className={classes.card}>
      <form className={classes.form}>
        <h1> Done. Patient Registration</h1>
        <FormControl className={classes.formControl}>
          <TextField className={classes.input} label="Name" value={name} onChange={e => setName(e.target.value)}></TextField>
        </FormControl>
        <FormControl className={classes.formControl}>
          <p>Birth Date</p>
          <KeyboardDatePicker
            className={classes.input}
            placeholder="1990/01/01"
            value={birthDate}
            onChange={handleDateChange}
            format="yyyy/MM/dd"
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <p>Phone number</p>
          <PhoneInput
            country={'us'}
            value={phone}
            onChange={phone => setPhone(phone)}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField className={classes.input} label="Email" value={email} onChange={e => setEmail(e.target.value)}></TextField>
        </FormControl>
        <FormControl className={classes.formControl}>
          <p>Upload your photo (driver license) 👇</p>
          <ImageUploader
            className={classes.imageUploader}
            withIcon={true}
            withPreview={true}
            singleImage={true}
            buttonText='Choose images'
            onChange={uploadPhotos}
            imgExtension={['.jpg', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <p> Make an appointment (see doctor's avaliability) 👇</p>
          <TextField type="time" className={classes.input} label="Start time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{'marginBottom': '15px'}}></TextField>
          <TextField type="time" className={classes.input} label="End time" value={endTime} onChange={e => setEndTime(e.target.value)}></TextField>
          <Button className={classes.button} variant="contained" color="primary" onClick={addAppointment}>Add appointment</Button>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Scheduler className={classes.scheduler} data={appointments}>
            <ViewState
              currentDate={currentDate}
            />
            <DayView
              startDayHour={8}
              endDayHour={13}
            />
            <Appointments />
            <AppointmentTooltip />
          </Scheduler>
        </FormControl>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </form>
    </Card>
  )
}