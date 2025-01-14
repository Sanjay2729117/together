import { useState,useEffect } from "react"
import './App.css'
import {OlaMaps} from "./assets/maps/OlaMapsWebSDKNew/OlaMapsWebSDKNew"
import {db} from "./firebase/app"
import { collection,getDocs,where,updateDoc,doc} from "firebase/firestore"
import { addDoc, query } from "firebase/firestore"
function App() {
  const [frd1lat, setFrd1lat] = useState(null);
  const [frd1lon, setFrd1lon] = useState(null);
  const [frd2lat, setFrd2lat] = useState(null);
  const [frd2lon, setFrd2lon] = useState(null);
  const [venuelat, setVenuelat] = useState(null);
  const [venuelon, setVenuelon] = useState(null);
  const [joincode,setjoincode] = useState("");
  const [generated,setGenerated] = useState(false);
  const [normcode,setNormcode] = useState("");
  const olaMaps = new OlaMaps({
    apiKey: ['UsnXY6ksvmMMLC3TFNmyWQtMdOQdXbcKxqwCaXhn'],
})
useEffect(()=>{
  const myMap = olaMaps.init({
    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
    container: 'map',
    center: [77.61648476788898, 12.931423492103944],
    zoom: 13
  })
  async function map(){
  const q=query(collection(db,"Locations"),where("code","==",normcode))
  const qs=await getDocs(q);
  if(!qs.empty){
    const docData = qs.docs[0].data();
    if(docData.frd1lat!=null && docData.frd1lon!=null){
      olaMaps
      .addMarker({ offset: [0,0], anchor: 'center' })
      .setLngLat([docData.frd1lon,docData.frd1lat])
      .addTo(myMap)
      if(docData.frd2lat!=null && docData.frd2lon!=null){
        olaMaps
        .addMarker({ offset: [0,0], anchor: 'center' ,color:'red'})
        .setLngLat([docData.frd2lon,docData.frd2lat])
        .addTo(myMap)
      }else{
        console.log("waiting for your frd")
      }
    }
  }
}
map()
},[normcode])

async function generate(){
 
  async function gen(){
    let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let len=characters.length;
    let result=[];
    for(let i=0;i<4;i++){
    result.push(characters.charAt(Math.floor(Math.random()*len)))
    }
    
    return result.join('');
  }
  await navigator.geolocation.getCurrentPosition(async (pos)=>{
    setFrd1lat(pos.coords.latitude)
    setFrd1lon(pos.coords.longitude)
   
  })
  while(true){
    let code=await gen();
    const q=query(collection(db,"Locations"),where("code","==",code))
    const qs=await getDocs(q);
    
  
    if(qs.empty){
    try{
      await addDoc(collection(db,"Locations"),{
        "code":code,
        "frd1lat":frd1lat,
        "frd1lon":frd1lon,
        "frd2lat":null,
        "frd2lon":null,
        "midlat":null,
        "midlon":null,
        "venlat":null,
        "venlon":null,
        "venuetype":null
      })
      setNormcode(code)
    }catch(e){
      console.log(e)
    }

    setGenerated(true)
    return code
    }
}
}
async function Handler() {
  setNormcode(joincode);
  await navigator.geolocation.getCurrentPosition((pos)=>{
    setFrd2lat(pos.coords.latitude)
    setFrd2lon(pos.coords.longitude)
    console.log(frd2lat)
    console.log(frd2lon)
  
  })
  try {
    const q = query(collection(db, "Locations"), where("code", "==", joincode));
    const qs = await getDocs(q);

    if (!qs.empty) {
      const docRef = doc(db, "Locations", qs.docs[0].id); // Get the document reference using the ID

      console.log(`Updating document with ID: ${qs.docs[0].id}`); // Log document ID

      // Log the values being updated
      console.log("Updating fields:", {
        "frd2lat": frd2lat,
        "frd2lon": frd2lon,
      });

      // Update the document with new values for frd2lat and frd2lon
      await updateDoc(docRef, {
        "frd2lat": frd2lat,
        "frd2lon": frd2lon,
      });

      console.log("Document updated successfully");
    } else {
      console.log("No document found with the specified code");
    }
  } catch (error) {
    console.error("Error updating document:", error); // Log any errors during the update process
  }
}

function join(e){
 
  if(e.target.value.length===4){
    setjoincode(e.target.value)
    Handler();
    console.log("finished")

  }
}
return(
<>
<div>
    <div id="map" style={{height:"90vh"}}>
  
    </div>
    <h1>{normcode}</h1>
    <button onClick={generate}>click</button>
    <input type="text" maxLength={4} placeholder="Enter code" onChange={join}/>
</div>
</>
)
}

export default App
