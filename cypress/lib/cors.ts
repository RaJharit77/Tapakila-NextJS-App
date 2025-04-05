import Cors from 'cors';

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
});

export default cors;
