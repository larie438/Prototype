


const mapWidth = 1000;
const mapHeight = 600;

const edges = {
    minLong: 69,
    maxLong: 70,
    minLat: 34,
    maxLat: 35,
}

let allFlights = {}

let currentFlight = null

function preload() {
    loadJSON("/data/allDays.json", function(days){
        
        // once days are loaded; display days
        // console.log("days are loaded",days)

        for( let d = 0; d < days.length; d++ ){
            const day = days[d];
            let dayFlights = {}
            
            loadJSON(
                "/data/days/" + day.day + "_flights.json", // which file to open
                function(flights_of_day){ // what to do if found

                    for( let f = 0; f < flights_of_day.length; f++ ){

                        let flight = flights_of_day[f];

                        dayFlights[flight.flight_id] = flight

                        loadJSON("/data/flights/" + day.day + "/" + day.day + "_" + flight.flight_id + ".json", function(flight_data){
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

function getFlightData ( day, id ) {
    currentFlight = allFlights[day].flights[id]
    console.log(currentFlight)
}


function setup() {
  let cnv = createCanvas(mapWidth, mapHeight);
  cnv.parent('myContainer');

  background(0);

  console.log( allFlights)
  getFlightData("20210815","684304472")
//   getFlightData("20210815","684284307")
 
    noLoop()
}

function draw() {
    background(200);
    noFill()
    stroke("red")
    strokeWeight(3);

  
    if( currentFlight ){

        beginShape()
        for( let i = 0; i < currentFlight.route.length; i++ ){
            const routePoint = currentFlight.route[i]

            let x = map( routePoint.longitude, edges.minLong, edges.maxLong, 0, width )
            let y = map( routePoint.latitude, edges.minLat, edges.maxLat, 0, height )
            
            
            if( x >= 0 && x <= width && y >= 0 && y <= height ){
                vertex( x, y )
            }
           

        }
        endShape()

    }

}
