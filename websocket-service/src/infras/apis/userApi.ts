import * as config from "configs/app";

import axios from 'axios';

export class UserApi {

    // Just a mock method call to user service so there's no parameters
    async validateUser() {
        const client = axios.create({
            baseURL: config.default.userBaseUrl,
        });
        const resp = await client.post('/api/v1/users/validate');
        console.log('validateUser', resp.data);
        return resp.data;
    }
}