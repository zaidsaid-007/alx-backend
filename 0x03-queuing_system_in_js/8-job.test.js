const { expect }= require ('chai');
const kue = require('kue');
const sinon = require('sinon');
const createPushNotificationsJobs = require('./8-job.js');

describe('createPushNotificationsJobs', () => {
    let queue;

    beforeEach(() => {
        queue = kue.createQueue();
        kue.Job.rangeByType('push_notification_code_3', 'inactive', 0, -1, 'asc', (err, selectedJobs) => {
            selectedJobs.forEach(job => job.remove());
        });
        queue.testMode.enter();
    });

    afterEach(() => {
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should display an error message if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs('not an array', queue)).to.throw('Jobs is not an array');
    });

    it('should create two new jobs to the queue', () => {
        const jobs = [
            { phoneNumber: '1234567890', message: 'This is the code 1' },
            { phoneNumber: '0987654321', message: 'This is the code 2' }
        ];

        createPushNotificationsJobs(jobs, queue);

        expect(queue.testMode.jobs.length).to.equal(2);
        expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
        expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);
        expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
        expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
    });

    it('should log the correct messages for job events', () => {
        const jobs = [
            { phoneNumber: '1234567890', message: 'This is the code 1' }
        ];

        const consoleSpy = sinon.spy(console, 'log');

        createPushNotificationsJobs(jobs, queue);

        const job = queue.testMode.jobs[0];
        job._events.complete();
        job._events.failed('Some error');
        job._events.progress(50);

        expect(consoleSpy.calledWith(`Notification job created: ${job.id}`)).to.be.true;
        expect(consoleSpy.calledWith(`Notification job ${job.id} completed`)).to.be.true;
        expect(consoleSpy.calledWith(`Notification job ${job.id} failed: Some error`)).to.be.true;
        expect(consoleSpy.calledWith(`Notification job ${job.id} 50% complete`)).to.be.true;

        consoleSpy.restore();
    });
});