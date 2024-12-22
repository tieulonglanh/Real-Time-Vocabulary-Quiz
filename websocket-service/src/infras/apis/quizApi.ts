import * as config from "configs/app";

import axios from 'axios';

export class QuizApi {

    // Just a mock method call to quiz service so there's no parameters
    async validateAnswer() {
        const client = axios.create({
            baseURL: config.default.quizBaseUrl,
        });
        const resp = await client.post('/api/v1/answers/validate');
        console.log('validateAnswer', resp.data);
        return resp.data;
    }
}