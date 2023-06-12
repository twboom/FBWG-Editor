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
* 5 = magenta
* 6 = light blue
* 7 = purple
* 8 = white

## Chars id's
* spawn fb, gid = 16
* spawn wg, gid = 17
* Door fb, gid = 18
* Door wg, gid = 19
* Diamond fb, gid = 20
* Diamond wg, gid = 21
* Diamond silver, gid = 22
* Diamond fbwg, gid = 23

## Objects id's 
* Button, gid = 24
* Lever, gid = 25 (off is to left)
* Lever, gid = 26 (off is to right)
* Normal box, gid = 28
* Light emitter, gid = 29
* Rotation boxmirror, gid = 30
* Light receiver, gid = 31
* Ball, gid = 34
* Rotation mirror, gid = 35
* Boxmirror, gid = 36
* Heavy box, gid = 37
* Timed button, gid = 38
* Wind generator, gid = 39
* Moving platform, type = 'platform'

## Large objects id's
* Portal white side right, gid = 40
* Portal white side left, gid = 41

## Blank chars object
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

## Blank objects object
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