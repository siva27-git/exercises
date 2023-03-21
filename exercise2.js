const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();

app.use(express.json());

app.get('/getRandomUsers', async (req, res) => {
    try {
        const data = await getRandomUsers();
        res.status(200).send({ users: data })

    } catch (e) {
        res.status(400).send({ 'Error': e.message })

    }
})

app.listen(3000, () => {
    console.log('server started in port 3000')
})

const getRandomUsers = async () => {
    const arr = []
    while (arr.length < 10) {
        // calling the api recursively untill getting 10 user data
        const data = await callUsersApi(10 - arr.length);
        arr.push(...data.filter(ele => ele != undefined))
    }
    return arr
};

const callUsersApi = async (value) => {

    const url = 'https://randomuser.me/api/';

    // Forming an array on n length

    const arr = Array.from(Array(value).fill(url));

    // Calling the API using Promise.allSettled , it is possible to have some failuers in the parallel api calls

    return Promise.allSettled(arr.map(e => axios(e))).then((data) => {
        return data.map(eachRec => {
            const { status, value } = eachRec;
            if (status == "fulfilled") {
                // considering only fullfilled not rejected
                const { data } = value;
                const { results = [] } = data;
                const { name = {}, dob = {}, email = "" } = results && results[0];
                const { title = "", first = "", last = "" } = name;
                const { date = "" } = dob;

                // preparing the object based on the api response

                const obj = {
                    name: title + ' ' + first + ' ' + last,
                    DOB: moment(date).format("YYYY-MM-DD"),
                    email: email
                };
                return obj;
            }
        })
    }).catch((error) =>
        console.log("error", error)
    )
};


