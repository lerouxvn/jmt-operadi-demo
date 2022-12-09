# jmt-api-demo

Rabit Setup

docker run -d --hostname my-rabbit -p 5672:5672 -p 15672:15672 -p 15675:15675  --name some-rabbit -e RABBITMQ_DEFAULT_USER=<USER> -e RABBITMQ_DEFAULT_PASS=<PASSWORD> rabbitmq:3-management

rabbitmq-plugins enable rabbitmq_web_mqtt