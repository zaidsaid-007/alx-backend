import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';


const app = express();
const port = 1245;

const client = redis.createClient();
const queue = kue.createQueue();

const reserveSeat = async (number) => {
    await client.set('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
    const getAsync = promisify(client.get).bind(client);
    const seats = await getAsync('available_seats');
    return parseInt(seats, 10);
};

let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    });
});

app.get('/process', (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        const currentSeats = await getCurrentAvailableSeats();
        if (currentSeats > 0) {
            await reserveSeat(currentSeats - 1);
            if (currentSeats - 1 === 0) {
                reservationEnabled = false;
            }
            done();
        } else {
            done(new Error('Not enough seats available'));
        }
    });
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await reserveSeat(50);
});