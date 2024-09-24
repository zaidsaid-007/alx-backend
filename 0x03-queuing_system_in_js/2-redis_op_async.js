//connecting redis server to local machine
import { createClient } from 'redis';
import { promisify } from 'util';
import redis from 'redis';

const client = createClient();
const getAsync = promisify(client.get).bind(client);
 client.on ('connect', () => {
    console.log ('Redis client connected to the server');
 });

 client.on('error',(error) =>{
    console.log('Redis client not connected to the server', erroessage);
    });

export function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (error, reply) => {
    console.log(`Reply: ${reply}`);
  });
}

async function displaySchoolValue(schoolName) {
    try{
        const result = await getAsync(schoolName);
        console.log(`Value for key '${schoolName}': ${result}`);}
    catch (error){
        console.error('Error: ', error)
        }
    }


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');