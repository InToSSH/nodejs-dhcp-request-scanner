# DHCP Request scanner in Node.js

This tiny app listens on UDP port 67 for `DHCPDICOVER` and `DHCPREQUEST` packets.
When a new device connects to the network it first sends one of these packets to get an IP address from the DHCP server.
We can use this to quickly get a MAC address of the device.
This is inteded to be integrated into Home Assistant to update the `device_tracker` entity.
The response time is usually much faster than getting this info from any of the router integrations, however one downside is that we only get the `home` state but not the `not_home` state (other means of detecting this have to be used).
I built this app to get the `home` state as soon as possible to unlock the front door lock (it triggers the BT beacon detection in my phone for better security to prevent MAC spoofing).

It also uses MongoDB to log seen MAC addresses and has a basic UI to preview them. More on this below.

---
## Running with Docker Compose
> Warning: Still in development so it uses nodemon to run the app, the production version will have proper node container with supervisor.

Simply set the ENV variable and run with command:
```
docker compose up -d
```

> Make sure to add a rule to your firewall to accept incoming traffic on UDP port 67.

## Environment variables
| Name            | Default       | Description                                                               |
|-----------------|---------------|---------------------------------------------------------------------------|
| WEB_SERVER_PORT | 3000          | Specifies port the web server for UI/JSON API will listen on              |
| HA_ENDPOINT     |               | URL of endpoint to make POST request to when new MAC address is detected. |
| DB_HOST         | mongodb:27017 | MongoDB host address                                                      |
| DB_NAME         | dhcplogger    | Databse name                                                              |
| DB_USERNAME     | root          | MongoDB username                                                          |
| DB_PASWORD      |               | MongoDB password                                                          |

## Web server
By default, the web server listens on port 3000.
There are two endpoints available:

| Endpoint                      | Optional query                              | Description                                                                                               |
|-------------------------------|---------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `http://localhost:3000`       | `?limit=<x>` - limit the number of requests | Shows the latest DHCP requests                                                                            |
| `http://localhost:3000/<mac>` | `?limit=<x>` - limit the number of requests | Shows latest DHCP requests for specific MAC address. MAC address has to be in format: `11-AA-22-BB-33-CC` |

> If `Accept: application/json` header is set when accessing the web server, the list of requests will be returned in JSON format