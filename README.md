# udptcpcrossconvert
Converts UDP messages to TCP and vice versa

Install Nodejs

copy convertApp to a folder on your computer, ideally c:\convertApp

Open the convert.js file in a text editor and change the ports:

UDPIN - This is what the node app listens on
UDPOUT - This is what the node app sends UDP messages out on
TCPIN  - This is what the node app listens on
TCPOUT - This is what the node app sends TCP messages out on

Then change the UDPOUTHOST and TCPOUTHOST to the IP address of the kit you're trying to control.

open node command prompt

cd c:\convertApp

then start the app by typing "node convert.js"

The app can cross convert both ways at any time. And you can have multiple copies of the app open as long as the ports don't clash.

Use packet sender to test the system.
