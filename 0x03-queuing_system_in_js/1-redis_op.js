//connecting redis server to local machine
import { createClient } from 'redis';

const client = createClient();
 client.on ('connect', () => {
    console.log ('Redis client connected to the server');
 });

 client.on('error',(error) =>{
    console.log('Redis client not connected to the server', erroessage);
    });
//function to set a value in redis it should accept 2 arguments schoolname and value
export function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (error, reply) => {
    console.log(`Reply: ${reply}`);
  });
}
//function displaychool value, it accepts one argumet school name and it should log to the console the value of the key passes as argument
export function displaySchoolValue(schoolName) {
  client.get(schoolName, (error, reply) => {
    console.log(reply);
  });
}
//call displaySchoolValue('holberton')
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');