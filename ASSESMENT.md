## Assignment Description

The serverless application we would like you to create is a microservice that is part of a microservice architecture. 
There are multiple technologies available to build such an application. We use a stack comprised of AWS CDK and Typescript, so this is the suggested stack for this assessment as this will allow us to best assess your capabilities. If you decide to choose another option, please share your reason for doing so.

The service you’re going to build is the Person Service. The person service stores information about persons and allows users of its API to create new persons and list existing persons.
The microservice should expose a Rest API endpoint POST /persons to create a new person. A person has first name, last name, phone number and address information. This information should be stored in a database, preferably NoSQL. After successfully storing this information, a Person Created event should be published to fan out to other subscribed microservices.

The microservice should be easily deployable to different environments and we expect that you use a serverless approach to ensure the microservice can scale on its own based on usage without having to manage infrastructure.
