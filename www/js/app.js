/*Function for storing the data in local storage*/
function set_data(data) {
  localStorage.setItem('fallas', JSON.stringify(data));
};

/**Function for getting data form local storage.*/
function get_data() {
  if (localStorage.getItem('fallas') === null) {
    return [];
  }
  else {
    return JSON.parse(localStorage.getItem('fallas'));
  }
};

/*Funcion para registrar un usuario en el local storage*/
function set_user(data) {
  localStorage.setItem('users', JSON.stringify(data));
};

/*Funcion para obtener los usuarios del local storage*/
function get_user() {
  if (localStorage.getItem('users') === null) {
    return [];
  }
  else {
    return JSON.parse(localStorage.getItem('users'));
  }
};

// =============================
// ========== LEAFLET ==========
// =============================
function create_map() {

  try {
    map.off();
    map.remove();
  }
  catch (error) {

  }

  // initialize the map on the "map" div with a given center and zoom
  map = L.map('mapid').setView([39.475498, -0.375431], 16);


  // load a tile layer
  var OpenStreetMap =L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'Map data <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 20,
        minZoom: 11
      });
  //OpenStreetMap.addTo(map)

  var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
          maxZoom: 20,
          attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

  var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
          maxZoom: 20,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

  var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
     maxZoom: 19,
       attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
  Esri_WorldImagery.addTo(map)

  //Creamos marker customizado
  var geojsonMarkerOptions = new L.Icon();
  geojsonMarkerOptions.options.iconUrl = './img/punta_pointer.png';
  geojsonMarkerOptions.options.iconAnchor = new L.Point(15, 60),
  geojsonMarkerOptions.options.iconSize   = new L.Point(30, 60);

  //Creamos la capa fallas como vacia, con la configuracion de marker anterior
  Fallas = L.geoJSON([],
    {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.marker(new L.LatLng(latlng["lat"], latlng["lng"]), {icon: geojsonMarkerOptions});
      }
    }).addTo(map);
  //Introducimos todos los datos de las fallas en la capa
  Fallas.addData(get_data());

  //Selector de capas
  var basemaps = {
      "Street Map" : OpenStreetMap,
      "Grayscale" : OpenStreetMap_BlackAndWhite,
      "Terrain Map" : OpenTopoMap,
      "Satellite Imagery": Esri_WorldImagery
  };
  var overlaymaps = {
      "Fallas" : Fallas,
  };

  //Creamos controlador de capas
  L.control.layers(basemaps, overlaymaps).addTo(map);

  L.closePopupOnClick = true;
};


//Popup
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        content = `
        <div id='popup_div' class='popup_div'>
          <h1>Nom: </h1>
          <p>
            ` + feature.properties.nombre + `
          </p>
          <h1>Secció: </h1>
          <p>
            ` + feature.properties.seccion + `
          </p>
          <h1>Fallera: </h1>
          <p>
            ` + feature.properties.fallera + `
          </p>
          <h1>President: </h1>
          <p>
            ` + feature.properties.presidente + `
          </p>
          <h1>Any de fundació: </h1>
          <p>
            ` + feature.properties.anyo_fundacion + `
          </p >
          <h1>ArtistE: </h1>
          <p>
            ` + feature.properties.artista + `
          </p >
          <h1>Lema: </h1>
          <p>
            ` + feature.properties.lema + `
          </p >
          <h1>Sector: </h1>
          <p>
            ` + feature.properties.sector + `
          </p>
          <h1>Esbós: </h1>
          <img class="popup_img" src= "` + feature.properties.boceto + `">
          </img >
        </div>
        <button type="button" id="routing_bttn" class="routing_bttn" onclick="calculate_route(` + feature.geometry.coordinates[1] + `, ` + feature.geometry.coordinates[0] + `)">
          Calculate Route
        </button>
      `;
        layer.bindPopup(content);
    }
};

/********************** DOCUMENT ON READY *************************************/
$(document).ready( function () {

//***************** GEOJSON CON FALLAS *****************************
if (localStorage.getItem('fallas') === null) {
  set_data(geojsonFeature);
}
else {
  if (get_data() != geojsonFeature && geojsonFeature.length > get_data().length) {
    set_data(geojsonFeature);
  };
};


create_map();

});

//****************************** INDEX PAGE *****************************************************/
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }


};

app.initialize();

function cameraTakePicture() {
  document.getElementById("submit_bttn").style.display = "none";
   navigator.camera.getPicture(onSuccess, onFail, {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL
   });

   function onSuccess(imageData) {
      image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      document.getElementById("myImage").style.display = "block";
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }
}

//****************************** START PAGE *****************************************************/
function sign_in() {
  var $login_form=$('#login_form').addClass('display');
  setTimeout(function() {
    $login_form.addClass('show');
  });

  document.getElementById('button_div').style.display='none';
};

function log_in() {
  //Obtenemos el usuario y contraseña del formulario de log_in
  user=document.getElementById('username').value;
  password=document.getElementById('password').value;
  //Obtenemos todos los usuarios almacenados
  users=get_user();
  //Inicializamos variables de comprobacion
  user_ok=false;
  pass_ok=false;
  //Buscamos el usuario y el password entre los almacenados
  for (i=0; i<users.length; i++) {
    if (user==users[i]['username']) {
      user_ok=true;
      if (password==users[i]['password']) {
        pass_ok=true;
      };
    };
  };
  //Ejecutamos segun se hayan encontrado ambos, solo uno o ninguno
  if (user_ok==true && pass_ok==true) {
    document.getElementById('start_section').style.display='none';
    document.getElementById('navbar_section').style.display='block';
    document.getElementById('map_section').style.display='block';
  }
  else if (user_ok==true && pass_ok==false) {
    document.getElementById('username').value='Contraseña incorrecta';
  }
  else {
    document.getElementById('username').value="Usuario no registrado";
  }
  map._onResize();
}

//Funcion para mostrar el formulario de registro
function register() {
  document.getElementById('start_section').style.display='none';
  document.getElementById('regiter_section').style.display='block';
  document.getElementById('firstname').value="";
  document.getElementById('lastname').value="";
  document.getElementById('username').value="";
  document.getElementById('passwordregister').value="";
}

//Funcion para registrar los datos del formulario de registro
function register_done() {
  //Obtenemos los datos
  first_name=document.getElementById('firstname').value;
  second_name=document.getElementById('lastname').value;
  username=document.getElementById('user_name').value;
  password=document.getElementById('passwordregister').value;
  //Comprobamos que se hayan introducido todos los datos
  if (first_name!="" && second_name!="" && username!="" && password!="") {
    //Obtenemos los usuarios existentes
    users = get_user();
    //Creamos un objeto con los datos del nuevo usuario
    new_user = {"username": username, "password": password,
    "firstname": first_name, "second_name": second_name};
    //Incluimos el nuevo usuario en la lista de usuarios existentes
    users.push(new_user);
    //Guardamos los usuarios en el local storage
    set_user(users);
    //Quitamos el formulario y volvemos a la pantalla de inicio
    document.getElementById('regiter_section').style.display='none';
    document.getElementById('start_section').style.display='block';
  }
}

//Funcion del boton back del formulario de registro
function back_bttn() {
  document.getElementById('regiter_section').style.display='none';
  document.getElementById('start_section').style.display='block';
}

//Funcion para registrar una nueva falla
function submit_element() {
  //Mostramos el formulario
  document.getElementById("capturing_section").style.display = "none";
  document.getElementById('map_section').style.display='block';
  //Obtenemos los datos del formulario
  var nom=document.getElementById('nom').value;
  var seccio=document.getElementById('seccio').value;
  var fallera=document.getElementById('fallera').value;
  var president=document.getElementById('president').value;
  var any_fundacio=document.getElementById('any_fundacio').value;
  var artiste=document.getElementById('artiste').value;
  var lema=document.getElementById('lema').value;
  var sector=document.getElementById('sector').value;
  //Obtenemos las fallas ya registradas y encontramos el id mas grande
  var id_max = -999;
  var local_data = get_data();
  for (var i=0; i < local_data.length; i++) {
    var id = local_data[i].properties.id;
    if (id > id_max) {
      id_max = id;
    };
  };
  //Creamos un objeto con los datos de la nueva falla
  var new_element = {"type": "Feature",
                    "properties": { "id": (id_max+1),
                    "nombre": nom,
                    "seccion": seccio,
                    "fallera": fallera,
                    "presidente": president,
                    "artista": artiste,
                    "lema": lema,
                    "boceto": "",
                    "grpro": "",
                    "proteccion": "",
                    "grins": "",
                    "orden": "",
                    "hora": "",
                    "seccion_i": seccio,
                    "fallera_i": fallera,
                    "presidente_i": president,
                    "artista_i": artiste,
                    "lema_i": lema,
                    "anyo_fundacion": any_fundacio,
                    "anyo_fundacion_i": any_fundacio,
                    "distintivo": "",
                    "distintivo_i": "",
                    "sector": sector,
                    "boceto_i": "" },
                    "geometry": { "type": "Point",
                                  "coordinates": [ longitude, latitude ] }
                    };
  //Incluimos la nueva falla en la lista de fallas ya registradas
  local_data.push(new_element);
  //Guardamos las fallas en el local storage
  set_data(local_data);
  //Recargamos el mapa
  create_map();
}

//Funcion que ejecuta el boton back de la seccion de captura
function capture_back() {
  x=0;
  document.getElementById('map_section').style.display='block';
  document.getElementById('capturing_section').style.display='none';
  document.getElementById('myImage').style.display='none';

  map.removeLayer(marker);
}



//****************************** LOCATE POSITION *********************************************/
//Funcion que obtiene las coordenadas GPS del dispositivo
var marker;
x = 0;
 function locate_position(){
  located=false;
   //Creamos un popup para mostrar la precision
  	var popup = document.createElement('div');
    popup.className = 'accuracy';
    popup.id = 'accuracy';
    document.body.appendChild(popup);
    document.getElementById('accuracy').innerHTML='Wait for accuracy';

    function watchPosition() {
      var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000,
        enableHighAccuracy: true,
      };

      watchID=navigator.geolocation.watchPosition(geolocation, onError, options);

      function geolocation(position) {
        longitude_pre=position.coords.longitude;
        latitude_pre=position.coords.latitude;
        accuracy_pre=position.coords.accuracy.toFixed(3);
        if (typeof(marker) == 'undefined') {
          //nothing
        }
        else {
          map.removeLayer(marker);
        }
        if (typeof(marker) == 'undefined') {
          marker = setMarker(latitude_pre, longitude_pre);
          map.setView([latitude, longitude], 19);
          located=true;
        }
        else {
          marker.setLatLng(latitude_pre, longitude_pre);
          map.setView([latitude, longitude], 19);
          located=true;
        }
        var acc_box=document.getElementById('accuracy');
        if (acc_box) {
          document.getElementById('accuracy').innerHTML='Accuracy: '+accuracy_pre+' m'
        }

      };

      function onError(error) {
        alert('code: '+error.code+'\n'+'message: '+error.message+'\n');
      }
    };

    geolocate=setInterval(watchPosition, 5000);
		popup.parentNode.removeChild(popup);
    document.body.appendChild(popup);
};



//****************************** LOCATION SELECTION *********************************************/
x = 0;
 function select_location(){
  located=false;
   closeNav();
   if (control != undefined) {
     map.removeControl(control);
   }

   if (typeof(marker) == 'undefined') {
     //nothing
   }
   else {
     map.removeLayer(marker);
   }
   var popup_accuracy=document.getElementById('accuracy')
   if (popup_accuracy) {
     popup_accuracy.parentNode.removeChild(popup_accuracy);
   }
   document.getElementById("locate_position").style.display = "none";

    var popup = document.getElementById('locationsetting');
    if (typeof(popup) == 'undefined' || popup == null) {
      var popup = document.createElement('div');
      popup.className = 'locationsetting';
      popup.id = 'locationsetting';
      var popup2 = document.getElementById('acc_div');
      if ((typeof(popup2) == 'undefined') || (popup2 == null)) {
        //nothing
      }
      else {
        popup2.parentNode.removeChild(popup2);
      };

      var message1 = document.createElement('div');
      message1.innerHTML = "GPS";
      message1.className = 'GPS';
      message1.id = 'GPS';
      message1.onclick = function GPScoordinates(){

                  var longitude_pre;
                  var latitude_pre;
                  var accuracy_pre;

                  var accuracy_div = document.createElement('div');
                  accuracy_div.className = 'acc_div';
                  accuracy_div.id = 'acc_div';
                  var accuracy_p = document.createElement('div');
                  accuracy_p.className = 'acc_p';
                  accuracy_p.id = 'acc_p';

                  var accuracy_button = document.createElement('div');
                  accuracy_button.className = 'acc_bttn';
                  accuracy_button.id = 'acc_bttn';
                  accuracy_button.innerHTML = "CAPTURE";
                  accuracy_button.onclick = function confirmCoordinates(){
                    document.getElementById('usernamecapture').value=user;
                    longitude=longitude_pre;
                    latitude=latitude_pre;
                    document.getElementById('map_section').style.display='none';
                    document.getElementById('capturing_section').style.display='block';
                  };

                  document.getElementById('map_section').appendChild(accuracy_div);
                  document.getElementById('acc_div').appendChild(accuracy_p);
                  document.getElementById('acc_div').appendChild(accuracy_button);
                  document.getElementById('acc_bttn').style.display='none';

                  document.getElementById('acc_p').innerHTML='Wait for accuracy';

                  function watchPosition() {
                    var options = {
                      enableHighAccuracy: true,
                      maximumAge: 3600000,
                      enableHighAccuracy: true,
                    };

                    watchID=navigator.geolocation.watchPosition(geolocation, onError, options);

                    function geolocation(position) {
                      longitude_pre=position.coords.longitude;
                      latitude_pre=position.coords.latitude;
                      accuracy_pre=position.coords.accuracy.toFixed(3);
                      if (typeof(marker) == 'undefined') {
                        //nothing
                      }
                      else {
                        map.removeLayer(marker);
                      }
                      if (typeof(marker) == 'undefined') {
                        marker = setMarker(latitude_pre, longitude_pre);
                        map.setView([latitude, longitude], 19);
                        located=true;
                      }
                      else {
                        marker.setLatLng(latitude_pre, longitude_pre);
                        map.setView([latitude, longitude], 19);
                        located=true;
                      }
                      var acc_box=document.getElementById('acc_p');
                      if (acc_box) {
                        document.getElementById('acc_p').innerHTML='Accuracy: '+accuracy_pre+' m'
                        document.getElementById('acc_bttn').style.display='block';
                      }
                    };

                    function onError(error) {
                      alert('code: '+error.code+'\n'+'message: '+error.message+'\n');
                    }
                  };
                  geolocate=setInterval(watchPosition, 5000);
  								popup.parentNode.removeChild(popup);
  						};

      var message2 = document.createElement('div');
      message2.innerHTML = "Manual Selection";
      message2.className = 'manual';
      message2.id = 'manual';
     	message2.onclick = function manualSelection(){
        if (typeof(marker) == 'undefined') {
          //nothing
        }
        else {
          map.removeLayer(marker);
        }
        var map_sec = document.getElementById("map_section");
        var div_acc = document.getElementById("acc_div");   // Get the <ul> element with id="myList"
        if (div_acc) {
          map_sec.removeChild(div_acc);
        }

				map.on('click', onMapClick);
				popup.parentNode.removeChild(popup);
        document.getElementById('usernamecapture').value=user;
		};
      popup.appendChild(message1);
      popup.appendChild(message2);
    }
    document.body.appendChild(popup);
    document.getElementById("locationsetting").style.display = "block";
}

function onMapClick(e) {
  document.getElementById('myImage').style.display="none";
  latitude= e.latlng.lat;
  longitude= e.latlng.lng;
  x++;
  if (x <=1) {
    myIcon = L.icon({
  	iconUrl: 'img/capturewhite.svg',
  	iconSize: [20, 20]
  });

  popup = document.createElement('div');
  popup.className = 'locationsetting';
  popup.id = 'digitalizeoptions';

  var message1 = document.createElement('div');
  message1.innerHTML = "SUBMIT";
  message1.className = 'GPS';
  message1.id = 'GPS';
  message1.onclick = function showCapturingForm(){
              document.getElementById('map_section').style.display='none';
              document.getElementById('capturing_section').style.display='block';
              popup.parentNode.removeChild(popup);
              x++;
          };

  var message2 = document.createElement('div');
  message2.innerHTML = "DELETE";
  message2.className = 'manual';
  message2.id = 'manual';
  message2.onclick = function removeMarker(){
              //alert("I am an alert box!");
              map.removeLayer(marker);
              popup.parentNode.removeChild(popup);
              x=0;
          };

  popup.appendChild(message1);
  popup.appendChild(message2);
  document.body.appendChild(popup);

  marker = L.marker([latitude, longitude],{icon: myIcon}).bindPopup(popup).addTo(map);
  }
}

function setMarker(latitude_input, longitude_input) {
  if (typeof(marker) == 'undefined') {
    //nothing
  }
  else {
    map.removeLayer(marker);
  }
	latitude= latitude_input;
	longitude= longitude_input;

	myIcon = L.icon({
		iconUrl: 'img/capturewhite.svg',
		iconSize: [20, 20]
	});

	marker=L.marker([latitude, longitude],{icon: myIcon}).addTo(map);

  
}

//************************************ SIDE MENU ***********************************/
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "230px";
    //document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}

function goHome() {
  if (control != undefined) {
    map.removeControl(control);
  }

  if (typeof(marker) == 'undefined') {
    //nothing
  }
  else {
    map.removeLayer(marker);
  }
  x=0;
  document.getElementById("map_section").style.display = "block";
  document.getElementById("locate_position").style.display = "block";
  document.getElementById("help_section").style.display = "none";
  document.getElementById("about_section").style.display = "none";
  document.getElementById("contact_section").style.display = "none";
  document.getElementById("capturing_section").style.display = "none";
  var popup_acc =  document.getElementById('locationsetting');
  if (typeof(popup_acc) != 'undefined' && popup_acc != null)
  {
    document.getElementById("locationsetting").style.display = "none";
  }
  var popup_acc2 = document.getElementById('acc_div');
  if (typeof(popup_acc2) != 'undefined' && popup_acc2 != null) {
    document.getElementById("acc_div").style.display = "none";
  }
  var popup_digi = document.getElementById('digitalizeoptions');
  if (typeof(popup_digi) != 'undefined' && popup_digi != null) {
    document.getElementById("digitalizeoptions").style.display = "none";
  }
  var popup_accuracy=document.getElementById('accuracy')
  if (popup_accuracy) {
    popup_accuracy.parentNode.removeChild(popup_accuracy);
  }
  map.off('click', onMapClick);
  closeNav();
}

function goHelp() {
  if (control != undefined) {
    map.removeControl(control);
  }

  if (typeof(marker) == 'undefined') {
    //nothing
  }
  else {
    map.removeLayer(marker);
  }
  x=0;
  document.getElementById("locate_position").style.display = "none";
  document.getElementById("map_section").style.display = "none";
  document.getElementById("help_section").style.display = "block";
  document.getElementById("about_section").style.display = "none";
  document.getElementById("contact_section").style.display = "none";
  document.getElementById("capturing_section").style.display = "none";
  var popup_choose=document.getElementById('locationsetting')
  if (popup_choose) {
    popup_choose.parentNode.removeChild(popup_choose);
  }
  var popup_submit=document.getElementById('digitalizeoptions')
  if (popup_submit) {
    popup_submit.parentNode.removeChild(popup_submit);
  }
  var popup_accuracy=document.getElementById('accuracy')
  if (popup_accuracy) {
    popup_accuracy.parentNode.removeChild(popup_accuracy);
  }
  closeNav();
}

function goAbout() {
  if (control != undefined) {
    map.removeControl(control);
  }

  if (typeof(marker) == 'undefined') {
    //nothing
  }
  else {
    map.removeLayer(marker);
  }
  x=0;
  document.getElementById("locate_position").style.display = "none";
  document.getElementById("map_section").style.display = "none";
  document.getElementById("help_section").style.display = "none";
  document.getElementById("about_section").style.display = "block";
  document.getElementById("contact_section").style.display = "none";
  document.getElementById("capturing_section").style.display = "none";
  var popup_choose=document.getElementById('locationsetting')
  if (popup_choose) {
    popup_choose.parentNode.removeChild(popup_choose);
  }
  var popup_submit=document.getElementById('digitalizeoptions')
  if (popup_submit) {
    popup_submit.parentNode.removeChild(popup_submit);
  }
  var popup_accuracy=document.getElementById('accuracy')
  if (popup_accuracy) {
    popup_accuracy.parentNode.removeChild(popup_accuracy);
  }
  closeNav();
}

function goContact() {
  if (control != undefined) {
    map.removeControl(control);
  }

  if (typeof(marker) == 'undefined') {
    //nothing
  }
  else {
    map.removeLayer(marker);
  }
  x=0;
  document.getElementById("locate_position").style.display = "none";
  document.getElementById("map_section").style.display = "none";
  document.getElementById("help_section").style.display = "none";
  document.getElementById("about_section").style.display = "none";
  document.getElementById("capturing_section").style.display = "none";
  document.getElementById("contact_section").style.display = "block";
  var popup_choose = document.getElementById('locationsetting');
  if (popup_choose) {
    popup_choose.parentNode.removeChild(popup_choose);
  }
  var popup_submit=document.getElementById('digitalizeoptions')
  if (popup_submit) {
    popup_submit.parentNode.removeChild(popup_submit);
  }
  var popup_accuracy=document.getElementById('accuracy')
  if (popup_accuracy) {
    popup_accuracy.parentNode.removeChild(popup_accuracy);
  }
  closeNav();
}

var control;
function calculate_route(latitude, longitude) {
  var longitude_origin;
  var latitude_origin;
  var located = false;
  function watchPosition() {
    var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000,
      enableHighAccuracy: true,
    };

    watchID=navigator.geolocation.watchPosition(geolocation, onError, options);

    function geolocation(position) {
      longitude_origin=position.coords.longitude;
      latitude_origin=position.coords.latitude;
      accuracy_pre=position.coords.accuracy.toFixed(3);
      if (latitude_origin && longitude_origin && located==false) {
        map.setView([latitude, longitude], 19);
        if (control != undefined) {
          if (control.getWaypoints().length > 0) {
            control.spliceWaypoints(control.getWaypoints().length - 1, 1, [latitude, longitude]);
            located=true;
          }
        }
        else {
          control = L.Routing.control({
            waypoints: [
                L.latLng(latitude_origin, longitude_origin),
                L.latLng(latitude, longitude)
            ]
          }).addTo(map);
      }
      }
      if (typeof(marker) == 'undefined') {
        //nothing
      }
      else {
        map.removeLayer(marker);
      }
      if (typeof(marker) == 'undefined') {
        marker = setMarker(latitude_origin, longitude_origin);
      }
      else {
        marker.setLatLng(latitude_origin, longitude_origin);
      }
      var acc_box=document.getElementById('acc_p');
      if (acc_box) {
        document.getElementById('acc_p').innerHTML='Accuracy: '+accuracy_pre+' m'
        document.getElementById('acc_bttn').style.display='block';
      }
    };

    function onError(error) {
      alert('code: '+error.code+'\n'+'message: '+error.message+'\n');
    }
  };
  geolocate=setInterval(watchPosition, 5000);
}
