Watershed_Plans_Simplified00006.geojson

This GeoJSON was created to decrease the size of the Watershed_Plans.geojson file. Kory is to be making a visualization 
with the Watershed_Plans.geojosn file and needed a smaller file size to work with. The steps to create the 
Watershed_Plans_Simplified00006.geojson are listed below. 

Step-by-Step Instructions on How to Use the QGIS Simplify Geometries tool 

1. Open QGIS 
2. Import the GeoJSON layer. In the top menu bar, click 'Layer' > 'Add Layer' > 'Add Vector Layer...'. In the pop-up window, browse to the location of the GeoJSON file and then click 'Open'. The layer will appear. 
3. Simplify the geometry of the GeoJSON layer (remove verticies). In the top menu bar, click 'Vector' > 'Geometry Tools' > 'Simplify Geometries'. 
4. In the 'Simplify Geometries' pop-up window, 
	A. Select the GeoJSON file as the input layer
	B. Choose a tolerance of '0.00006' (or other value, this values was used because it brought the 'Watershed_Plans.geojson' down in size from 23,966 KB to 9,089 KB
	C. Browse to location of output GeoJSON under 'Simplified'
	D. Click 'Run'.
