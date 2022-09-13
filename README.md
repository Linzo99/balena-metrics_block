## balena-metricsblock
The balena Supervisor reports metrics about your device to the cloud.
Now you access those metrics via this block

---
### usage
Just send a GET request to the endpoint **/metrics**
Ex:
```
curl -X GET mydevice.local:28282/metrics
```
response
```json
{
    "cpu_usage":26,
    "memory_usage":3748,
    "memory_total":7885,
    "storage_block_device":"",
    "storage_usage": 2000,
    "storage_total": 32000,
    "cpu_temp":44
}
```

#### docker-compose file
```yaml
version: '2'

services:
    metrics:
        build: https://github.com/Linzo99/balena-metrics_block.git
        privileged: true
        environment:
            - PORT=28282
        ports:
            - 28282
```

### Environment variables

+ PORT : the listening port for the server
