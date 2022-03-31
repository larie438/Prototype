const mapWidth = 1000;
const mapHeight = 600;
let bg;

let dayArray = [];
let flightArray = [];
let pointCount = 0;

let daySelector = 0;
let flightSelector = 0;

const edges = {
    minLong: 68.482095,
    maxLong: 69.93296,
    minLat: 34.22276,
    maxLat: 34.906933,
}

let allFlights = {}

let currentFlight = null

function preload() {

    bg = loadImage('assets/map.png');

    loadJSON("/data/allDays.json", function (days) {

        // once days are loaded; display days
        // console.log("days are loaded",days)

        for (let d = 0; d < days.length; d++) {
            const day = days[d];
            let dayFlights = {}

            loadJSON(
                "/data/days/" + day.day + "_flights.json", // which file to open
                function (flights_of_day) { // what to do if found

                    for (let f = 0; f < flights_of_day.length; f++) {

                        let flight = flights_of_day[f];

                        dayFlights[flight.flight_id] = flight

                        loadJSON("/data/flights/" + day.day + "/" + day.day + "_" + flight.flight_id + ".json", function (flight_data) {
                            // console.log(flight_data)
                            dayFlights[flight.flight_id]["route"] = flight_data
                        })
                    }

                }
            )

            allFlights[day.day] = {
                flights: dayFlights
            }
        }
    });
}

function getFlightData(day, id) {
    currentFlight = allFlights[day].flights[id]
    // console.log(currentFlight)
}


function setup() {
    // frameRate(30);
    let cnv = createCanvas(mapWidth, mapHeight);
    cnv.parent('myContainer');
    background(bg);



    // console.log(allFlights)
    
    // getFlightData("20210815","684284307")


    // noLoop()

    //2d array
    for (var day in allFlights) {
        if (allFlights.hasOwnProperty(day)) {
            console.log(day + " -> " + allFlights[day]);
            dayArray.push(day);

        }
    }
    for (let i = 0; i < dayArray.length; i++) {
        flightArray[i] = [];
        for (var flights in allFlights[dayArray[i]]['flights']) {
            if (allFlights[dayArray[i]]['flights'].hasOwnProperty(flights)) {
                flightArray[i].push(flights);
            }
        }
    }
    // getFlightData("20210815", "684304472")  //maybe?
    drawFlight();
    // console.log("LOADED");


}

function drawFlight() {
    // background(bg); // re-draw background every flight
    if (flightSelector < flightArray[daySelector].length - 1) {
        flightSelector++;
        console.log(flightSelector);
    } else {
        flightSelector = 0
        if (daySelector < dayArray.length - 1) {
            daySelector++;
            background(bg);
        }
    }
    getFlightData(dayArray[daySelector], flightArray[daySelector][flightSelector]);
}

// for(let flightSelector = 0; flightSelector < flightArray[daySelector].length - 1; flightSelector++){
//     getFlightData(dayArray[daySelector], flightArray[daySelector][flightSelector]);
// }

function draw() {

    noFill()
    stroke("red")
    
    strokeWeight(1);


    if (currentFlight) {

        beginShape();
        if (pointCount < currentFlight.route.length) {
            for (let i = 0; i < pointCount; i++) {

                const routePoint = currentFlight.route[i]

                let x = map(routePoint.longitude, edges.minLong, edges.maxLong, 0, width)
                let y = map(routePoint.latitude, edges.maxLat, edges.minLat, 0, height)


                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    vertex(x, y)
                }
            }
            pointCount++;


            endShape();
        } else {
            pointCount = 0;
            drawFlight();
        }
    }
}
