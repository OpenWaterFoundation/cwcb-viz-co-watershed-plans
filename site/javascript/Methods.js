/* This function below is used to set which DOM objects are active or inactive.
The function takes in two arrays containing a list of which DOM id's to set active
and which DOM id's to set to inactive. This function is used by the navbar containing
the 'Documentation', 'Data', and 'Source' tabs.
*/
function setActive(active, non_active)
{
  document.getElementById(active).style.display = 'inline';
  for(var index = 0; index < non_active.length; index++)
  {
    document.getElementById(non_active[index]).style.display = 'none';
  }
}

/* This function below is used to sort arrays. It will be used when a basin is selected
and will organize the Watershed plans in a descending order by year. This information will
be shown in the right-most 'well' underneath the 'Select Basin' button. 
*/
function sortYear(a,b)
{
  if(a[0] < b[0])
  {
    return -1;
  }
  else if(a[0] > b[0])
  {
	return 1;
  }
  else
  {
  	return 0;
  }
}

/* This function below is used to sort arrays. It will be used for the 'Select Basin' button. 
This will sort the list of basin names alphabetically in ascending order (A-Z). 
*/
function sortBasins(a,b)
{
  if(a[0] < b[0])
  {
    return -1;
  }
  else if(a[0] > b[0])
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

/* This function below is used to sort arrays. It is used to order the SubBasin property 
from the Watershed_Plans.csv in ascending order. 
*/
function compare(a,b)
{
  if(a.SubBasin < b.SubBasin)
  {
    return -1;
  }
  else if(a.SubBasin > b.SubBasin)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

/* This function below is used to get the number of Watershed Plans when passed in a specifi
HUC8 number. It returns an integer that represents the amount of Watershed Plans that basin
has. This number will then be shown in the right-most 'well' underneath the 'Select Basin' button
as well as the 'Basin Information' hub on the leaflet map.
*/
function getWaterPlanNumber(HUC8)
{
  if(counts[HUC8] != undefined)
  {
    return counts[HUC8];
  }
  else
  {
    return 0;
  }
}

/* This function below is used to create the list that is displayed in the 'Select Basin' button.
It will iterate over the array containing the names and id's of each basin. While iterating over the 
array, it will create multiple 'li' DOM's. Once the iteration is over, there will be an element with 
the id 'basinlist' that represents the list of basin names/id's.
*/
function createBasinList(basin_array)
{
	for(HUC8 in basin_array)
	{
	  var list = document.createElement('li');
	  var a = document.createElement('a');
	  a.setAttribute("href","#");
	  a.setAttribute("onclick",'clickOnMapItem(' + '"' + basin_array[HUC8][1] + '"); return false;');
	  var basin = document.createTextNode(basin_array[HUC8][0] + " " + basin_array[HUC8][1]);
	  a.appendChild(basin);
	  list.appendChild(a);
	  document.getElementById('basinlist').appendChild(list);
	}
}

/* ------------------------LEAFLET MAP METHODS------------------------ */

/* getColor is called by the onEachFeature function. This is what controls `
the color of each basin depending on the  Mean SME data value. 
This also controls the colors that are shown in the legend. */
function getColor(d) {
    if(d == undefined || d == 0)
    {
        return '#fafafa';
    }
    return d < 2 ? '#CCCCCC':
      d < 3 ? '#8c8c8c':
      d < 4 ? '#A6BDDB':
      d < 5 ? '#74A9CF':
      d < 10 ? '#2B8CBE':
    '#045A8D';
}

/* The function below is called when adding the geojson data from the SNODAS files.
Style controls the fill color of each basin, the weight of the lines surrounding the 
basin, the color of the lines outlining each basin, and the opacity. */                 
function setSWELayerStyle(feature){
    return {
        fillColor: getColor(feature.properties.plans),
        weight: 1, 
        color: 'black',
        fillOpacity: 0.40
    };
}

/* This function is used for the CO_boundary style. It sets the weight of the line used
to border Colorado, the color of that line, and sets the fill opacity to 0. */
function setStateBoundaryStyle(feature){
    return {
	    weight: 5, 
	    color: 'black',
	    fillOpacity: 0,
    };
}


/* select_basin_call is a boolean value. This is set true when the ClickOnMapItem function is called.
This boolean value is used to highlight basins and will prevent the highlight to be removed when the
user "mouseouts" of the basin.*/
var select_basin_call = false;

/* This feature is called by the onEachFeature function. It is what allows users to 
highlight over basins and will pop up a gray line outlining the basin. 
*/
function highlightFeature(e) 
{
  select_basin_call = false;
  var layer = e.target;
  layer.setStyle({
  	weight: 6,
    color: '#666',
    dashArray: '',  
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	layer.bringToFront();
  }
  info.update(layer.feature.properties);
}
                  
/* This function is also called by the onEachFeature function. It is used
once a basin has been highlighted over, then the user moves the mouse it will
reset the layer back to the original state. */
function resetHighlight(e)
{
  if(!e.target.feature.properties.hasBeenSelected)
  {
    geojson.resetStyle(e.target);
    info.update();
    if(select_basin_call)
    {
      var layer = geojson.getLayer(e.target.feature.properties.HUC8);
      layer.fireEvent('mouseover');
      select_basin_call = false;
    }
  }
}
                  
/* This function is called by the onEachFeature function. It is used
if a user clicks on a basin. Once a basin is selected, the proper SWE graphs
will be accessible to view. */
function selectBasin(e) 
{
  clickOnMapItem(e.target.feature.properties.HUC8);
}

/* This function is used when adding the SNODAS data from a csv file to the map. It makes every object
in the data have these certain "properties". So each object will have a mouseover,
mouseout, and click property. All of these properties allow users to highlight over
basins, and click on basins to zoom in on  them */
function onEachFeature(feature, layer) 
{
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: selectBasin
  });
  layer._leaflet_id = feature.properties.HUC8;
}

/* basin_selected is a boolean value. This is set true when the ClickOnMapItem function is called.
This boolean value is used to highlight basins and will prevent the highlight to be removed when the
user "mouseouts" of the basin.*/
var basin_selected = false; 

var old_basin;
/* This function is used to imitate the fire event 'mouseover'.
It is called when a user selects a basin from the 'Select Basin' button.
Once a basin is selected this function will imitate a user moving the 
cursor over a basin. This function takes in a HUC8 and will highlight
the currently selected basin. */
function clickOnMapItem(HUC8)
{
  if(basin_selected)
  {
    var old_layer = geojson.getLayer(old_basin);
    old_layer.feature.properties.hasBeenSelected = false;
    old_layer.fireEvent('mouseout');
  }
  var id = HUC8;
  old_basin = HUC8;
  //get target layer by it's id
  var layer = geojson.getLayer(id);
  //fire event 'click' on target layer 
  layer.fireEvent('mouseover');
  layer.feature.properties.hasBeenSelected = true;
  // select_basin_call = true;
  basin_selected = true;
  getWaterPlans(HUC8, layer.feature.properties.NAME, getWaterPlanNumber(HUC8));
}