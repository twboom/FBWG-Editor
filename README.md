# FBWG-Editor
Fireboy &amp; Watergirl Level Editor

## Object id's 
* 0 = Air
* 1 = Ground
* 2 = Top slope facing right
* 3 = Top slope facing left
* 4 = Bottom slope facing left
* 5 = Bottom slope facing right
* 6 = Water
* 7 = Lava
* 8 = Green stuff

## Color id's
* 1 = red
* 2 = green
* 3 = blue
* 4 = yellow 
* 5 = pink
* 6 = light blue
* 7 = purple
* 8 = white

## Special id's
* spawn fb, gid = 16
* spawn wg, gid = 17
* Door fb, gid = 18
* Door wg, gid = 19
* Diamond fb, gid = 20
* Diamond wg, gid = 21
* Diamond silver, gid = 22
* Diamond fbwg, gid = 23

## Black chars object
* {
*    "gid":0,
*    "height":0,
*    "id":0,
*    "name":"",
*    "rotation":0,
*    "type":"",
*    "visible":true,
*    "width":0,
*    "x":0,
*    "y":0
* }

## Black objects object
* {
*    "gid":0,
*    "height":0,
*    "id":0,
*    "name":"",
*    "properties":{
*      "dx":0,
*      "dy":0,
*      "group":0
*    },
*    "propertytypes":{
*      "dx":"int",
*      "dy":"int",
*      "group":"int"
*    },
*    "rotation":0,
*    "type":"",
*    "visible":true,
*    "width":o,
*    "x":0,
*    "y":0
* }